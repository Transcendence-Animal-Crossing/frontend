import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useSocket } from '../../utils/SocketProvider';
import { useEventEmitter } from '../../utils/EventEmitterProvider';
import axiosInstance from '../../utils/axiosInstance';
import ProfileContainer from './myProfile';
import SearchBarContainer from './searchBar';
import UserInfo from '../userInfo';
import UserModal from '../userModal';
import AlarmModal from './alarmModal';

interface dmData {
  id: number;
  senderId: number;
  date: Date;
  text: string;
}

interface friendData {
  id: number;
  nickName: string;
  intraName: string;
  avatar: string;
  status: string;
  unReadMessages: dmData[];
}

interface RequestData {
  sendBy: number;
  nickName: string;
  intraName: string;
}

const Navigation = () => {
  const { data: session } = useSession();
  const { chatSocket } = useSocket();
  const emitter = useEventEmitter();
  const [chatSocketFlag, setSocketFlag] = useState<boolean>(true);
  const [friendsList, setFriendsList] = useState<friendData[]>([]);
  const [requestList, setRequestList] = useState<RequestData[]>([]);
  const [requestListLen, setRequestListLen] = useState<number>(0);
  const [openDmId, setOpenDmId] = useState<number>(-1);
  const [userInfo, setUserInfo] = useState<friendData>({
    id: 0,
    nickName: '',
    intraName: '',
    avatar: '',
    status: '',
    unReadMessages: [],
  });
  const [isOpenRequest, setOpenRequest] = useState<boolean>(false);
  const [requestRect, setRequestRect] = useState<{
    top: number;
    left: number;
    height: number;
  }>({ top: 0, left: 0, height: 0 });
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [userRect, setUserRect] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });
  const userRefs: React.MutableRefObject<HTMLDivElement | null>[] = [];

  // game lobby
  const [gameButton, setGameButton] = useState<boolean>(false);
  const [matchingGame, setMatchingGame] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    if (chatSocket && chatSocketFlag) {
      chatSocket.emitWithAck('friend-list').then((response) => {
        console.log('response', response);
        if (response.status === 200) {
          const sortedFriendsList = response.body.sort((a: friendData, b: friendData) => {
            const statusOrder: Record<string, number> = {
              ONLINE: 0,
              IN_GAME: 1,
              WATCHING: 1,
              OFFLINE: 2,
            };

            const statusComparison = statusOrder[a.status] - statusOrder[b.status];

            if (statusComparison !== 0) {
              return statusComparison;
            }

            return 0;
          });

          setFriendsList(sortedFriendsList);
          setRequestListLen(requestList.length);
          setSocketFlag(false);
        }
      });
    }
  });

  useEffect(() => {
    if (chatSocket) {
      const handleFriendUpdate = (response: friendData) => {
        console.log('friend update', response);
        setFriendsList((preFriendslist) => {
          const updatedUserlist = preFriendslist
            .map((user) => {
              if (user.id === response.id) {
                return {
                  ...user,
                  nickName: response.nickName,
                  avatar: response.avatar,
                  status: response.status,
                };
              }
              return user;
            })
            .sort((a: friendData, b: friendData) => {
              const statusOrder: Record<string, number> = {
                ONLINE: 0,
                IN_GAME: 1,
                WATCHING: 1,
                OFFLINE: 2,
              };
              const statusComparison = statusOrder[a.status] - statusOrder[b.status];
              if (statusComparison !== 0) {
                return statusComparison;
              }
              return 0;
            });
          return updatedUserlist;
        });
      };

      const handleDM = (response: dmData) => {
        const targetId = response.senderId;
        if (openDmId === targetId) {
          emitter.emit('newMessage', response);
        } else if (targetId !== session?.user.id) {
          setFriendsList((prevFriendsList) => {
            return prevFriendsList.map((friend) => {
              if (friend.id === targetId) {
                const updatedFriend = {
                  ...friend,
                  unReadMessages: [...friend.unReadMessages, response],
                };
                return updatedFriend;
              }
              return friend;
            });
          });
        }
      };

      const handleNewFriend = (response: friendData) => {
        const newFriendData: friendData = { ...response, unReadMessages: [] };
        setFriendsList((prevFriendsList) => {
          const updatedFriendsList = [...prevFriendsList, newFriendData].sort((a, b) => {
            const statusOrder: Record<string, number> = {
              ONLINE: 0,
              IN_GAME: 1,
              WATCHING: 1,
              OFFLINE: 2,
            };
            const statusComparison = statusOrder[a.status] - statusOrder[b.status];
            if (statusComparison !== 0) {
              return statusComparison;
            }
            return 0;
          });
          return updatedFriendsList;
        });
      };

      const handleDeleteFriend = (response: { id: number }) => {
        setFriendsList((prevFriendsList) =>
          prevFriendsList.filter((friend) => friend.id !== response.id)
        );
      };

      const handleNewFriendRequest = (response: RequestData) => {
        setRequestList((prevRequestList) => [...prevRequestList, response]);
      };

      const handleDeleteFriendRequest = (response: { sendBy: number }) => {
        setRequestList((prevRequestList) =>
          prevRequestList.filter((request) => request.sendBy !== response.sendBy)
        );
      };

      chatSocket.on('friend-update', handleFriendUpdate);
      chatSocket.on('dm', handleDM);
      chatSocket.on('new-friend', handleNewFriend);
      chatSocket.on('delete-friend', handleDeleteFriend);
      chatSocket.on('new-friend-request', handleNewFriendRequest);
      chatSocket.on('delete-friend-request', handleDeleteFriendRequest);

      return () => {
        chatSocket.off('friend-update', handleFriendUpdate);
        chatSocket.off('dm', handleDM);
        chatSocket.off('new-friend', handleNewFriend);
        chatSocket.off('delete-friend', handleDeleteFriend);
        chatSocket.off('new-friend-request', handleNewFriendRequest);
        chatSocket.off('delete-friend-request', handleDeleteFriendRequest);
      };
    }
  }, [chatSocket, openDmId]);

  useEffect(() => {
    const handleOpenDM = (targetId: number) => {
      setOpenDmId(targetId);
      setFriendsList((prevFriendsList) => {
        const targetFriend = prevFriendsList.find((friend) => friend.id === targetId);
        if (targetFriend) {
          process.nextTick(() => {
            emitter.emit('unReadMessages', targetFriend.unReadMessages);
            targetFriend.unReadMessages = [];
          });
        }
        return prevFriendsList;
      });
    };

    const handleCloseDM = () => {
      setOpenDmId(-1);
    };

    const handleGameLobby = () => {
      setGameButton(true);
    };

    emitter.on('openDM', handleOpenDM);
    emitter.on('closeDM', handleCloseDM);
    emitter.on('gameLobby', handleGameLobby);

    return () => {
      emitter.removeListener('openDM', handleOpenDM);
      emitter.removeListener('closeDM', handleCloseDM);
      emitter.removeListener('gameLobby', handleGameLobby);
    };
  }, [emitter]);

  useEffect(() => {
    setRequestListLen(requestList.length);
  }, [requestList]);

  useEffect(() => {
    handleRequest();
  }, []);

  const handleRequest = async () => {
    await axiosInstance.get(`/follow/request`).then((response) => {
      setRequestList(response.data);
    });
  };

  const updateUserRect = (index: number) => {
    const clickedUserRef = userRefs[index];
    if (clickedUserRef && clickedUserRef.current) {
      const buttonRect = clickedUserRef.current.getBoundingClientRect();
      setUserRect({
        top: buttonRect.top,
        left: buttonRect.left,
        width: buttonRect.width,
      });
    }
  };

  const handleClickBell = () => {
    setOpenRequest(true);
  };

  const handleCloseBell = () => {
    setOpenRequest(false);
  };

  const handleClickUser = (userInfo: friendData, index: number) => {
    setUserInfo(userInfo);
    updateUserRect(index);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAvatarPath = (avatar: string) => {
    const apiUrl = 'http://localhost:8080/';
    return apiUrl + avatar;
  };

  const handlerTranslation = (status: string) => {
    if (status === 'OFFLINE') return '오프라인';
    if (status === 'ONLINE') return '온라인';
    if (status === 'IN_GAME') return '게임중';
    if (status === 'WATCHING') return '관전중';
  };

  const handleGameStart = () => {
    emitter.emit('gameStart');
    setGameButton(false);
    setMatchingGame(true);
    setElapsedTime(0);
  };

  const handleLeaveQueue = () => {
    emitter.emit('leaveQueue');
    setGameButton(true);
    setMatchingGame(false);
    setElapsedTime(0);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (matchingGame) {
      intervalId = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [matchingGame]);

  return (
    <Container>
      <ProfileContainer />
      <DivisionBar />
      <SearchBarContainer
        handleClickBell={handleClickBell}
        setRequestRect={setRequestRect}
        requestListLen={requestListLen}
      />
      <UserList>
        {chatSocketFlag && <p> loading... </p>}
        {friendsList.map((friend, index) => {
          userRefs[index] = userRefs[index] || React.createRef<HTMLDivElement>();
          return (
            <UserInfoFrame
              key={index}
              onClick={() => handleClickUser(friend, index)}
              ref={userRefs[index]}
            >
              <UserInfo
                nickName={friend.nickName}
                intraName={friend.intraName}
                avatar={handleAvatarPath(friend.avatar)}
                width={40}
                height={5}
              />
              {friend.unReadMessages.length !== 0 && (
                <DmCount> {friend.unReadMessages.length} </DmCount>
              )}
              <Status textColor={friend.status}>
                <p>⦁</p>
                <p>&nbsp;{handlerTranslation(friend.status)}</p>
              </Status>
            </UserInfoFrame>
          );
        })}
        {gameButton && <GameStartButton onClick={handleGameStart}> Game Start </GameStartButton>}
        {matchingGame && (
          <GameStartButton onClick={handleLeaveQueue}>
            Matching..
            <Text>
              {Math.floor(elapsedTime / 60)}:{elapsedTime % 60}
            </Text>
          </GameStartButton>
        )}
      </UserList>
      <>
        {session ? (
          <>
            <br />
            <br />
            <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : null}
      </>
      {isOpenModal ? (
        <UserModal handleCloseModal={handleCloseModal} userId={userInfo.id} userRect={userRect} />
      ) : null}
      {isOpenRequest ? (
        <AlarmModal
          handleCloseModal={handleCloseBell}
          requestList={requestList}
          setRequestList={setRequestList}
          requestRect={requestRect}
        />
      ) : null}
    </Container>
  );
};

export default Navigation;

const Container = styled.div`
  width: 20%;
  height: 100%;
  background-color: #f8f4e8;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const DivisionBar = styled.div`
  width: 100%;
  height: 0.2vh;
  background-color: ${(props) => props.theme.colors.brown05};
`;

const UserList = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto;
  color: ${(props) => props.theme.colors.brown};
`;

const UserInfoFrame = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 2% 5%;
  box-sizing: border-box;
`;

const DmCount = styled.div`
  width: auto;
  height: auto;
  color: ${(props) => props.theme.colors.brown};
  background-color: ${(props) => props.theme.colors.gold02};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 2% 3%;
  font-size: 0.8vw;
  font-family: 'GiantsBold';
`;

const Status = styled.div<{ textColor: string }>`
  width: 24%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.8vw;
  font-family: 'GiantsLight';
  color: ${(props) => {
    switch (props.textColor) {
      case 'OFFLINE':
        return props.theme.colors.gray;
      case 'ONLINE':
        return props.theme.colors.green;
      case 'IN_GAME':
        return props.theme.colors.red;
      case 'WATCHING':
        return props.theme.colors.purple;
      default:
        return props.theme.colors.brown;
    }
  }};
`;

const GameStartButton = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8% 10%;
  margin: 5%;
  border-radius: 100px;
  color: #7a5025;
  background-color: #f7cd67;
  font-size: 3vh;
  text-align: center;
  font-family: 'GiantsLight';
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  cursor: pointer;
  gap: 1vh;

  &:hover {
    transform: scale(1.03);
  }
`;

const Text = styled.div`
  color: #7a5025;
  font-family: 'GiantsLight';
  font-size: 2vh;
`;

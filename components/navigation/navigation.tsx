import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSocket } from '@/utils/SocketProvider';
import { useEventEmitter } from '@/utils/EventEmitterProvider';
import axiosInstance from '@/utils/axiosInstance';
import ProfileContainer from './myProfile';
import SearchBarContainer from './searchBar';
import UserInfo from '@/components/userInfo';
import UserModal from '@/components/userModal';
import AlarmModal from './alarmModal';
import RoomInviteModal from '@/components/roomInviteModal';
import ReceiveGameModal from '@/components/receiveGameModal';
import { handleSetUserAvatar } from '@/utils/avatarUtils';

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

interface InviteRoomData {
  id: string;
  title: string;
  sendBy: friendData;
}

const Navigation = () => {
  const { data: session } = useSession();
  const { chatSocket, gameSocket } = useSocket();
  const router = useRouter();
  const emitter = useEventEmitter();
  const [chatSocketFlag, setSocketFlag] = useState<boolean>(true);

  // friends
  const [friendsList, setFriendsList] = useState<friendData[]>([]);
  const [userInfo, setUserInfo] = useState<friendData>({
    id: 0,
    nickName: '',
    intraName: '',
    avatar: '',
    status: '',
    unReadMessages: [],
  });

  // request
  const [requestList, setRequestList] = useState<RequestData[]>([]);
  const [requestListLen, setRequestListLen] = useState<number>(0);
  const [isOpenRequest, setOpenRequest] = useState<boolean>(false);
  const [requestRect, setRequestRect] = useState<{
    top: number;
    left: number;
    height: number;
  }>({ top: 0, left: 0, height: 0 });

  // user modal
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [userRect, setUserRect] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });
  const userRefs: React.MutableRefObject<HTMLDivElement | null>[] = [];
  const [openDmId, setOpenDmId] = useState<number>(-1);

  // game lobby
  const [gameButton, setGameButton] = useState<boolean>(false);
  const [matchingGame, setMatchingGame] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isOpenmode, setIsOpenmode] = useState<boolean>(false);
  const [modeButton, setModeButton] = useState<string>('NORMAL');
  const [modeRect, setModeRect] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });
  const modeRefs = useRef<HTMLImageElement | null>(null);
  let overlayTop = `${modeRect.top * 0.96}px`;
  let overlayLeft = `${modeRect.left + (modeRect.width / 3) * 2}px`;

  // invite chatting room
  const [isRoomInvite, setIsRoomInvite] = useState<boolean>(true);
  const [inviteRoomInfo, setInviteRoomInfo] = useState<InviteRoomData>();

  // invite game
  const [isGameInvite, setIsGameInvite] = useState<boolean>(true);
  const [inviteGameInfo, setInviteGameInfo] = useState<friendData>();
  const [inviteResponse, setInviteResponse] = useState<string>('');
  const inviteResponseRef = useRef<string>('');

  useEffect(() => {
    if (chatSocket && chatSocketFlag) {
      chatSocket.emitWithAck('friend-list').then((response) => {
        console.log('response', response);
        if (response.status === 200) {
          const sortedFriendsList = response.body.sort(
            (a: friendData, b: friendData) => {
              const statusOrder: Record<string, number> = {
                ONLINE: 0,
                IN_GAME: 1,
                WATCHING: 1,
                OFFLINE: 2,
              };
              const statusComparison =
                statusOrder[a.status] - statusOrder[b.status];
              if (statusComparison !== 0) {
                return statusComparison;
              }
              return 0;
            }
          );
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
              const statusComparison =
                statusOrder[a.status] - statusOrder[b.status];
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
          const updatedFriendsList = [...prevFriendsList, newFriendData].sort(
            (a, b) => {
              const statusOrder: Record<string, number> = {
                ONLINE: 0,
                IN_GAME: 1,
                WATCHING: 1,
                OFFLINE: 2,
              };
              const statusComparison =
                statusOrder[a.status] - statusOrder[b.status];
              if (statusComparison !== 0) {
                return statusComparison;
              }
              return 0;
            }
          );
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
          prevRequestList.filter(
            (request) => request.sendBy !== response.sendBy
          )
        );
      };

      const handleRoomInvite = (response: InviteRoomData) => {
        setInviteRoomInfo(response);
        setIsRoomInvite(true);
      };

      const handleGameInvite = (response: friendData, callback: (arg0: string) => void) => {
        inviteResponseRef.current = '';
        setInviteGameInfo(response);
        setIsGameInvite(true);

        const checkResponse = () => {
          if (inviteResponseRef.current === 'ACCEPT' || inviteResponseRef.current === 'DENIED') {
            callback(inviteResponseRef.current);
            setIsGameInvite(false);
          } else {
            setTimeout(checkResponse, 100);
          }
        };

        checkResponse();
        setTimeout(() => {
          setIsGameInvite(false);
        }, 10000);
      };

      chatSocket.on('friend-update', handleFriendUpdate);
      chatSocket.on('dm', handleDM);
      chatSocket.on('new-friend', handleNewFriend);
      chatSocket.on('delete-friend', handleDeleteFriend);
      chatSocket.on('new-friend-request', handleNewFriendRequest);
      chatSocket.on('delete-friend-request', handleDeleteFriendRequest);
      chatSocket.on('room-invite', handleRoomInvite);
      chatSocket.on('game-invite', handleGameInvite);

      return () => {
        chatSocket.off('friend-update', handleFriendUpdate);
        chatSocket.off('dm', handleDM);
        chatSocket.off('new-friend', handleNewFriend);
        chatSocket.off('delete-friend', handleDeleteFriend);
        chatSocket.off('new-friend-request', handleNewFriendRequest);
        chatSocket.off('delete-friend-request', handleDeleteFriendRequest);
        chatSocket.off('room-invite', handleRoomInvite);
        chatSocket.off('game-invite', handleGameInvite);
      };
    }
  }, [chatSocket, openDmId]);

  useEffect(() => {
    if (gameSocket) {
      const handleGameMatched = (response: { id: string }) => {
        console.log('handleGameMatched', response);
        const responseGameId = response.id;
        router.push(`/game/${responseGameId}`);
      };

      gameSocket.on('game-matched', handleGameMatched);

      return () => {
        gameSocket.off('game-matched', handleGameMatched);
      };
    }
  }, [gameSocket]);

  useEffect(() => {
    inviteResponseRef.current = inviteResponse;
  }, [inviteResponse]);

  useEffect(() => {
    const handleOpenDM = (targetId: number) => {
      setOpenDmId(targetId);
      setFriendsList((prevFriendsList) => {
        const targetFriend = prevFriendsList.find(
          (friend) => friend.id === targetId
        );
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

    const handleGameLobby = (response: string) => {
      setGameButton(true);
      if (response === 'General') {
        setIsOpenmode(true);
      }
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

  useEffect(() => {
    const handleModeButton = () => {
      if (modeRefs.current) {
        const buttonRect = modeRefs.current.getBoundingClientRect();
        setModeRect({
          top: buttonRect.top,
          left: buttonRect.left,
          width: buttonRect.width,
        });
        overlayTop = `${buttonRect.top * 0.96}px`;
        overlayLeft = `${(buttonRect.left, +(buttonRect.width / 3) * 2)}px`;
      }
    };

    handleModeButton();
  }, [gameButton, modeRefs, friendsList]);

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

  const handleCloseInvite = () => {
    setIsRoomInvite(false);
  };

  const handleCloseGame = () => {
    setIsGameInvite(false);
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

  const handleGeneralMode = () => {
    if (modeButton === 'NORMAL') {
      setModeButton('HARD');
      emitter.emit('gameMode', 'HARD');
    } else if (modeButton === 'HARD') {
      setModeButton('NORMAL');
      emitter.emit('gameMode', 'NORMAL');
    }
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
          userRefs[index] =
            userRefs[index] || React.createRef<HTMLDivElement>();
          return (
            <UserInfoFrame
              key={index}
              onClick={() => handleClickUser(friend, index)}
              ref={userRefs[index]}
            >
              <UserInfo
                nickName={friend.nickName}
                intraName={friend.intraName}
                avatar={handleSetUserAvatar(friend.avatar)}
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
        {isOpenmode && (
          <Content
            overlayTop={overlayTop}
            overlayLeft={overlayLeft}
            onClick={handleGeneralMode}
          >
            {modeButton}
          </Content>
        )}
      </UserList>
      {isOpenModal ? (
        <UserModal
          handleCloseModal={handleCloseModal}
          userId={userInfo.id}
          userRect={userRect}
        />
      ) : null}
      {isOpenRequest ? (
        <AlarmModal
          handleCloseModal={handleCloseBell}
          requestList={requestList}
          setRequestList={setRequestList}
          requestRect={requestRect}
        />
      ) : null}
      {isRoomInvite && inviteRoomInfo && (
        <RoomInviteModal roomInfo={inviteRoomInfo} handleCloseModal={handleCloseInvite} />
      )}
      {isGameInvite && inviteGameInfo && (
        <ReceiveGameModal
          userInfo={inviteGameInfo}
          handleCloseModal={handleCloseGame}
          setInviteResponse={setInviteResponse}
        />
      )}
      {gameButton && (
          <GameStartButton onClick={handleGameStart} ref={modeRefs}>
            <Text fontsize='3vh'>Game Start</Text>
          </GameStartButton>
        )}
        {matchingGame && (
          <GameStartButton onClick={handleLeaveQueue} ref={modeRefs}>
            <Text fontsize='2.5vh'>Matching...</Text>
            <Text fontsize='2vh'>
              {Math.floor(elapsedTime / 60)}:{elapsedTime % 60}
            </Text>
          </GameStartButton>
        )}
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
  height: 65%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: auto;
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
  height: 8vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8% 10%;
  margin: 5%;
  border-radius: 100px;
  color: #7a5025;
  background-color: #f7cd67;
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

const Text = styled.div<{ fontsize: string }>`
  color: #7a5025;
  font-family: 'GiantsLight';
  font-size: ${(props) => props.fontsize};
`;

const Content = styled.div<{ overlayTop: string; overlayLeft: string }>`
  position: fixed;
  top: ${(props) => props.overlayTop};
  left: ${(props) => props.overlayLeft};
  width: 4.5vw;
  height: auto;
  background-color: rgba(103, 109, 247, 0.7);
  color: ${(props) => props.theme.colors.white};
  padding: 0.6% 0.5%;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'GiantsLight';
  font-size: 1.5vh;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
  }
`;

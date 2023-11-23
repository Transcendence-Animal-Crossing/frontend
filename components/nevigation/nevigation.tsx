import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useSocket } from '../../utils/SocketProvider';
import { useEventEmitter } from '../../utils/EventEmitterProvider';
import axiosInstance from '../../utils/axiosInstance';
import EventEmitter from 'events';
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
  const { socket } = useSocket();
  const emitter = useEventEmitter();
  const [socketFlag, setSocketFlag] = useState<boolean>(true);
  const [friendsList, setFriendsList] = useState<friendData[]>([]);
  const [requestList, setRequestList] = useState<RequestData[]>([]);
  const [requestListLen, setRequestListLen] = useState<number>(0);
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

  useEffect(() => {
    if (socket && socketFlag) {
      socket.emitWithAck('friend-list').then((response) => {
        console.log('response', response);
        if (response.status === 200) {
          const sortedFriendsList = response.body.sort((a: friendData, b: friendData) => {
            if (a.status === 'ONLINE' && b.status !== 'ONLINE') {
              return -1;
            } else if (a.status !== 'ONLINE' && b.status === 'ONLINE') {
              return 1;
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
    if (socket) {
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
              if (a.status === 'ONLINE' && b.status !== 'ONLINE') {
                return -1;
              } else if (a.status !== 'ONLINE' && b.status === 'ONLINE') {
                return 1;
              }
              return 0;
            });
          return updatedUserlist;
        });
      };

      const handleDM = (response: dmData) => {
        console.log('handleDM response : ' + response.text);
        const targetId = response.senderId;
        // targetId 의 DM창이 닫혀있을때
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
      };

      const handleNewFriend = (response: friendData) => {
        console.log('new friend', response);
        setFriendsList((prevFriendsList) => [...prevFriendsList, response]);
      };

      socket.on('friend-update', handleFriendUpdate);
      socket.on('dm', handleDM);
      socket.on('new-friend', handleNewFriend);

      return () => {
        socket.off('friend-update', handleFriendUpdate);
        socket.off('dm', handleDM);
        socket.off('new-friend', handleNewFriend);
      };
    }
  }, [socket]);

  useEffect(() => {
    const handleOpenDM = (targetId: number) => {
      setFriendsList((prevFriendsList) => {
        const targetFriend = prevFriendsList.find((friend) => friend.id === targetId);
        if (targetFriend) {
          emitter.emit('unReadMessages', targetFriend.unReadMessages);
          targetFriend.unReadMessages = [];
        }
        return prevFriendsList;
      });
    };

    emitter.on('openDM', handleOpenDM);

    return () => {
      emitter.removeListener('openDM', handleOpenDM);
    };
  }, [emitter]);

  useEffect(() => {
    handleRequest();
  }, []);

  const handleRequest = async () => {
    await axiosInstance.get(`/follow/request`).then((response) => {
      setRequestList(response.data);
      console.log('requestList', requestList);
    });
  };

  const updateUserRect = (index: number) => {
    const clickedUserRef = userRefs[index];
    console.log('updateUserRect', userRefs);
    console.log(userRefs[index]);

    if (clickedUserRef && clickedUserRef.current) {
      console.log('test');
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
    console.log('handleClickUser', userInfo.nickName, index);
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
        {socketFlag && <p> loading... </p>}
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

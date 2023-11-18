import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useSocket } from '../../utils/SocketProvider';
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
  const { socket } = useSocket();
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
          setFriendsList(response.body);
          setRequestListLen(requestList.length);
          setSocketFlag(false);
        }
      });
    }
  });

  useEffect(() => {
    if (socket) {
      const handleFriendUpdate = (response: friendData) => {
        console.log('friend update');
        const targetUser = friendsList.find((user) => user.id === response.id);
        if (targetUser) {
          setFriendsList((preFriendslist) => {
            const updatedUserlist = preFriendslist.map((user) => {
              if (user.id === response.id) {
                return {
                  ...user,
                  nickName: response.nickName,
                  avatar: response.avatar,
                  status: response.status,
                };
              }
              return user;
            });
            return updatedUserlist;
          });
        }
      };

      socket.on('friend-update', handleFriendUpdate);

      return () => {
        socket.off('friend-update', handleFriendUpdate);
      };
    }
  }, [socket]);

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

  const handleStatus = (status: string) => {
    if (status === 'OFFLINE') {
      return '0';
    } else if (status === 'ONLINE') {
      return '1';
    } else {
      return '2';
    }
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
                size={100}
              />
              <Status textColor={handleStatus(friend.status)}> ⦁&nbsp;{friend.status} </Status>
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

const Status = styled.div<{ textColor: string }>`
  display: flex;
  flex-direction: row;
  font-size: 0.8vw;
  font-family: 'GiantsLight';
  color: ${(props) => {
    switch (props.textColor) {
      case '0':
        return props.theme.colors.red;
      case '1':
        return props.theme.colors.green;
      default:
        return props.theme.colors.brown;
    }
  }};
`;

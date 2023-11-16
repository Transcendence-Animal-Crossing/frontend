import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import ProfileContainer from './myProfile';
import SearchBarContainer from './searchBar';
import { useSocket } from '../../utils/SocketProvider';
import UserInfo from '../userInfo';
import UserModal from '../userModal';

interface friendData {
  id: number;
  nickName: string;
  intraName: string;
  avatar: string;
  status: string;
}

const Navigation = () => {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const [friendsList, setFriendsList] = useState<friendData[]>([]);
  const [userInfo, setUserInfo] = useState<friendData>(friendsList[0]);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [userRect, setUserRect] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });
  const userRefs: React.MutableRefObject<HTMLDivElement | null>[] = [];

  useEffect(() => {
    if (socket && friendsList.length === 0) {
      socket.emitWithAck('friend-list').then((response) => {
        setFriendsList(response.body);
      });
    }
  });

  useEffect(() => {
    console.log('userRefs', userRefs);
  }, []);

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
      <SearchBarContainer />
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

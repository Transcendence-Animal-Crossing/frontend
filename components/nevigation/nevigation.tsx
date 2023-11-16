import styled from 'styled-components';
import Image from 'next/image';
import react, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import ProfileContainer from './myProfile';
import SearchBarContainer from './searchBar';
import { useSocket } from '../../utils/SocketProvider';
import UserInfo from '../userInfo';

interface friendData {
  friendId: number;
  freindNickName: string;
  freindIntraName: string;
  freindProfile: string;
  status: string;
}

const Navigation = () => {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const [friendsList, setFriendsList] = useState<friendData[]>([]);

  useEffect(() => {
    if (socket && friendsList.length === 0) {
      socket.emitWithAck('friend-list').then((response) => {
        console.log(response);
        setFriendsList(response.body);
      });
    }
  });

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
        {friendsList.map((friend, index) => (
          <UserInfoFrame>
            <UserInfo
              key={index}
              nickName={friend.freindNickName}
              // intraName={friend.freindIntraName}
              intraName="IntraName"
              avatar={handleAvatarPath(friend.freindProfile)}
              size={100}
            />
            <Status textColor={handleStatus(friend.status)}> ⦁&nbsp;{friend.status} </Status>
          </UserInfoFrame>
        ))}
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
  height: 50%;
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
  /* color: ${(props) => props.theme.colors.brown}; */
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

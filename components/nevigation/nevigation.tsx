import styled from 'styled-components';
import Image from 'next/image';
import react, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import ProfileContainer from './myProfile';
import { useSocket } from '../../utils/SocketProvider';

interface friendData {
  friendId: number;
  freindNickName: string;
  freindProfile: string;
  status: string;
}

const Navigation = () => {
  const { data: session } = useSession();

  return (
    <Container>
      <ProfileContainer />
      <DivisionBar />
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

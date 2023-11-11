import styled from 'styled-components';
import { ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';

const Navigation = () => {
  const { data: session } = useSession();

  return (
    <>
      <Container>
        {session ? (
          <>
            {/* <Text> Sign in as {session.user.email} </Text> <br /> */}
            <Text> Sign in as {session?.user?.intraName} </Text> <br />
            {/* <Text> accessToken : {session.accessToken} </Text> <br /> */}
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : null}
      </Container>
    </>
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
  justify-content: center;
`;

const Text = styled.div`
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
`;

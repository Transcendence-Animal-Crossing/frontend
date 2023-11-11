import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession, signIn, signOut } from 'next-auth/react'; // 테스트용

const Home: NextPage = () => {
  const { data: session } = useSession(); // 테스트용
  return (
    <>
      <Head>
        <title>Crossing PingPong</title>
        <link rel="icon" href="/Login/logo.png" />
      </Head>
      <p> index.tsx </p> <br />
      {/* 테스트용 */}
      {session ? (
        <>
          Sign in id : {session.user.id} <br />
          nickName : {session.user.nickName} <br />
          intraName : {session.user.intraName} <br />
          avatar : {session.user.avatar} <br />
          accessToken : {session.accessToken} <br />
          refreshToken : {session.refreshToken} <br />
          responseCode : {session.responseCode} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : null}
    </>
  );
};

export default Home;

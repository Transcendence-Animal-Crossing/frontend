import type { NextPage } from "next";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react"; // 테스트용

const Home: NextPage = () => {
  const { data: session } = useSession(); // 테스트용
  return (
    <>
      <Head>
        <title>Crossing PingPong</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <p> index.tsx </p> <br />
      {/* 테스트용 */}
      {session ? (
        <>
          Sign in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : null}
    </>
  );
};

export default Home;

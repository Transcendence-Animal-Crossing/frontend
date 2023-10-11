import styled from "styled-components";
import Head from "next/head";
import { ReactNode } from "react"; // ReactNode를 가져옵니다.

interface LayoutProps {
  children: ReactNode;
}

// Container 컴포넌트를 정의합니다.
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #e9e2c7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Crossing PingPong</title>
        <link rel="icon" href="/Login/logo.png" />
      </Head>
      {/* 이제 Container 컴포넌트를 렌더링할 수 있습니다. */}
      <Container>{children}</Container>
    </>
  );
};

export default Layout;

import styled from "styled-components";
import Head from "next/head";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const ColumnLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Crossing PingPong</title>
        <link rel="icon" href="/Login/logo.png" />
      </Head>
      <Container>{children}</Container>
    </>
  );
};

export default ColumnLayout;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #e9e2c7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

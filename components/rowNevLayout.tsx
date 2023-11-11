import styled from 'styled-components';
import Head from 'next/head';
import { ReactNode } from 'react';
import Nev from './nevigation/nevigation';

interface LayoutProps {
  children: ReactNode;
}

const columnNevLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Crossing PingPong</title>
        <link rel="icon" href="/Login/logo.png" />
      </Head>
      <Frame>
        <Container>{children}</Container>
        <Nev />
      </Frame>
    </>
  );
};

export default columnNevLayout;

const Frame = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #e9e2c7;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 80%;
  height: 100%;
  background-color: #e9e2c7;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

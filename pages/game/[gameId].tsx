import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Container from '../../components/columnLayout';
import Header from '../../components/lobbyHeader';

const generalLobbyPage: React.FC = () => {
  const router = useRouter();
  const { gameId } = router.query as { gameId: string };
  return (
    <Container>
      <Header title='General Game' text='일반 게임' />
      <GameFrame> INGAME: {gameId} </GameFrame>
    </Container>
  );
};

export default generalLobbyPage;

const GameFrame = styled.div`
  width: 70%;
  height: 70%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`;

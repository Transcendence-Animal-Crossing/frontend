import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '../../utils/SocketProvider';
import { useEventEmitter } from '../../utils/EventEmitterProvider';
import Container from '../../components/columnNevLayout';
import Header from '../../components/lobbyHeader';

const generalLobbyPage: React.FC = () => {
  const { data: session } = useSession();
  const { queueSocket } = useSocket();
  const emitter = useEventEmitter();

  useEffect(()=>{
    emitter.emit('gameLobby');
  },[]);

  useEffect(() => {

  },[emitter]);

  return (
    <Container>
      <Header title='General Game' text='일반 게임' />
      <GameListFrame>{/* 진행중인 게임 목록 랜더링 */}</GameListFrame>
    </Container>
  );
};

export default generalLobbyPage;

const GameListFrame = styled.div`
  width: 70%;
  height: 70%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`;

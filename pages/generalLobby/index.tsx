import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/utils/SocketProvider';
import { useEventEmitter } from '@/utils/EventEmitterProvider';
import Container from '@/components/columnNevLayout';
import Header from '@/components/lobbyHeader';

const generalLobbyPage: React.FC = () => {
  const { data: session } = useSession();
  const { queueSocket } = useSocket();
  const emitter = useEventEmitter();
  const router = useRouter();
  const [mode, setMode] = useState<string>('NORMAL');

  useEffect(() => {
    emitter.emit('gameLobby', 'General');
  }, []);

  useEffect(() => {
    if (queueSocket) {
      const handleQueueMatched = (response: { id: string }) => {
        const responseGameId = response.id;
        router.push(`/game/${responseGameId}`);
      };

      queueSocket.on('queue-matched', handleQueueMatched);

      return () => {
        queueSocket.off('queue-matched', handleQueueMatched);
      };
    }
  }, [queueSocket]);

  useEffect(() => {
    const handleGameStart = () => {
      if (queueSocket) {
        queueSocket
          .emitWithAck('queue-join', {
            type: mode,
          })
          .then((response) => {
            console.log(response);
          });
      }
    };

    const handleLeaveQueue = () => {
      if (queueSocket) {
        queueSocket.emitWithAck('queue-leave').then((response) => {
          console.log(response);
        });
      }
    };

    const handleGameMode = (response: string) => {
      setMode(response);
    };

    emitter.on('gameStart', handleGameStart);
    emitter.on('leaveQueue', handleLeaveQueue);
    emitter.on('gameMode', handleGameMode);

    return () => {
      emitter.removeListener('gameStart', handleGameStart);
      emitter.removeListener('leaveQueue', handleLeaveQueue);
      emitter.removeListener('gameMode', handleGameMode);
    };
  }, [emitter, queueSocket, mode]);

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

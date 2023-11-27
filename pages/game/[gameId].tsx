import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../../utils/SocketProvider';
import Container from '../../components/columnLayout';
import Header from '../../components/lobbyHeader';

interface UserData {
  id: number;
  nickName: string;
  intraName: string;
  avatar: string;
}

const generalLobbyPage: React.FC = () => {
  const { gameSocket } = useSocket();
  const router = useRouter();

  // game info
  const { gameId } = router.query as { gameId: string };
  const [gameType, setGameType] = useState<string>('');
  const [leftUser, setLeftUser] = useState<UserData>();
  const [rightUser, setRightUser] = useState<UserData>();
  const [leftScore, setLeftScore] = useState<number>();
  const [rightScore, setRightScore] = useState<number>();
  const [startTime, setStartTime] = useState<Date>();

  useEffect(() => {
    if (gameSocket) {
      if (!gameType) {
        gameSocket.emitWithAck('game-info').then((response) => {
          if (response.status === 200) {
            console.log('game-info', response);
            setGameType(response.game.type);
            setLeftUser(response.game.leftUser);
            setRightUser(response.game.rightUser);
            setLeftScore(response.game.leftScore);
            setRightScore(response.game.rightScore);
            setStartTime(response.game.startTime);
          } else {
            console.log('game-info error', response);
            router.push('http://localhost:3000/404');
          }
        });

        gameSocket.emitWithAck('game-ready').then((response) => {
          if (response.status === 200) {
            console.log('game-ready');
          } else {
            console.log('game-ready error', response);
            router.push('http://localhost:3000/404');
          }
        });
      }

      const handleGameStart = () => {
        console.log('handleGameStart');
      };

      gameSocket.on('game-start', handleGameStart);

      return () => {
        gameSocket.off('game-start', handleGameStart);
      };
    }
  }, [gameSocket]);

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

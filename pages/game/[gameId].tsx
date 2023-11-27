import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../../utils/SocketProvider';
import Container from '../../components/columnLayout';
import Header from '../../components/game/gameHeader';
import GameBackGround from '../../components/game/background';

interface UserData {
  id: number;
  nickName: string;
  intraName: string;
  avatar: string;
}

const generalLobbyPage: React.FC = () => {
  const { gameSocket } = useSocket();
  const router = useRouter();
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

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
            // router.push('http://localhost:3000/404');
          }
        });

        gameSocket.emitWithAck('game-ready').then((response) => {
          if (response.status === 200) {
            console.log('game-ready');
          } else {
            console.log('game-ready error', response);
            // router.push('http://localhost:3000/404');
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

  useEffect(() => {
    const handleResize = () => {
      const calculatedheight = window.innerHeight * 0.7;
      const calculatedWidth = calculatedheight * 2;
      setHeight(calculatedheight);
      setWidth(calculatedWidth);
    };

    if (window) {
      handleResize();

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  });

  return (
    <Container>
      <Header title='General Game' text='일반 게임' />
      <GameBackGround width={width} height={height} />
      <GameContent>INGAME: {gameId}</GameContent>
    </Container>
  );
};

export default generalLobbyPage;

const GameContent = styled.div`
  position: absolute;
  background-color: ${(props) => props.theme.colors.red};
`;

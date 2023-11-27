import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
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

interface pos {
  x: number;
  y: number;
}

const GamePage: React.FC = () => {
  const { gameSocket } = useSocket();
  const router = useRouter();
  const keyPressed = useRef({
    left: false,
    right: false,
    up: false,
    down: false,
  });

  // canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [barHeight, setBarHeight] = useState<number>(0);
  const [barWidth, setBarWidth] = useState<number>(0);

  // game info
  const { gameId } = router.query as { gameId: string };
  const [gameType, setGameType] = useState<string>('');
  const [leftUser, setLeftUser] = useState<UserData>();
  const [rightUser, setRightUser] = useState<UserData>();
  const [leftScore, setLeftScore] = useState<number>();
  const [rightScore, setRightScore] = useState<number>();
  const [startTime, setStartTime] = useState<Date>();

  // pos
  const [ball, setBall] = useState<pos>();
  const [leftPlayer, setLeftPlayer] = useState<pos>();
  const [rightPlayer, setRrightPlayer] = useState<pos>();

  useEffect(() => {
    if (gameSocket) {
      if (!gameType) {
        gameSocket.emitWithAck('game-info').then((response) => {
          if (response.status === 200) {
            console.log('game-info', response);
            setGameType(response.body.gameInfo.type);
            setLeftUser(response.body.gameInfo.leftUser);
            setRightUser(response.body.gameInfo.rightUser);
            setLeftScore(response.body.gameInfo.leftScore);
            setRightScore(response.body.gameInfo.rightScore);
            setStartTime(response.body.gameInfo.startTime);
            setBall(response.body.ball);
            setLeftPlayer(response.body.leftPlayer);
            setRrightPlayer(response.body.rightPlayer);
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

      const handleKeyDown = (event: KeyboardEvent) => {
        let gameKey: 'left' | 'right' | 'up' | 'down' | undefined;
        if (event.key == 'a' || event.key == 'ArrowLeft') gameKey = 'left';
        if (event.key == 'd' || event.key == 'ArrowRight') gameKey = 'right';
        if (event.key == 'w' || event.key == 'ArrowUp') gameKey = 'up';
        if (event.key == 's' || event.key == 'ArrowDown') gameKey = 'down';

        if (gameKey !== undefined && !keyPressed.current[gameKey]) {
          keyPressed.current[gameKey] = true;
          gameSocket.emit('game-key-press', { key: gameKey });
        }
      };

      const handleKeyUp = (event: KeyboardEvent) => {
        let gameKey: 'left' | 'right' | 'up' | 'down' | undefined;
        if (event.key === 'a' || event.key === 'ArrowLeft') gameKey = 'left';
        if (event.key === 'd' || event.key === 'ArrowRight') gameKey = 'right';
        if (event.key === 'w' || event.key === 'ArrowUp') gameKey = 'up';
        if (event.key === 's' || event.key === 'ArrowDown') gameKey = 'down';

        if (gameKey !== undefined) {
          keyPressed.current[gameKey] = false;
          gameSocket.emit('game-key-release', { key: gameKey });
        }
      };

      gameSocket.on('game-start', handleGameStart);
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        gameSocket.off('game-start', handleGameStart);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [gameSocket]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;
      canvas.width = width;
      canvas.height = height;

      window.addEventListener('resize', handleResize);
      handleResize();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef]);

  const handleResize = () => {
    const calculatedheight = window.innerHeight * 0.7;
    const calculatedWidth = calculatedheight * 2;
    setHeight(calculatedheight);
    setWidth(calculatedWidth);
    setBarWidth(calculatedWidth / 50);
    if (gameType === 'HARD') {
      setBarHeight(calculatedWidth / 10);
    } else {
      setBarHeight(calculatedWidth / 5);
    }
  };

  return (
    <Container>
      <Header title='General Game' text='일반 게임' />
      <GameBackGround width={width} height={height} canvasRef={canvasRef} />
      <GameContent>INGAME: {gameId}</GameContent>
    </Container>
  );
};

export default GamePage;

const GameContent = styled.div`
  position: absolute;
  background-color: ${(props) => props.theme.colors.red};
`;

const Bar = styled.div``;

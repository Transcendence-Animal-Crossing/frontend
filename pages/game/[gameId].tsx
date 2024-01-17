import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '@/utils/SocketProvider';
import Container from '@/components/layout/columnLayout';
import Header from '@/components/game/gameHeader';
import GameBackGround from '@/components/game/background';
import GameFooter from '@/components/game/gameFooter';
import GameEndModal from '@/components/game/gameEndModal';
import { UserData } from 'next-auth/providers/42-school';

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
  const DummyUser = {
    id: 0,
    nickName: '',
    intraName: '',
    avatar: '',
  };
  const [countdown, setCountdown] = useState<number>(0);

  // canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [barHeight, setBarHeight] = useState<number>(0);
  const [barWidth, setBarWidth] = useState<number>(0);
  const [ballRadius, setBallRadius] = useState<number>(0);

  // game info
  const { gameId } = router.query as { gameId: string };
  const [gameType, setGameType] = useState<string>('');
  const [leftUser, setLeftUser] = useState<UserData>(DummyUser);
  const [rightUser, setRightUser] = useState<UserData>(DummyUser);
  const [leftScore, setLeftScore] = useState<number>(0);
  const [rightScore, setRightScore] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date>();
  const [endFlag, setEndFlag] = useState<boolean>(false);

  // pos
  const [ball, setBall] = useState<pos>({ x: 500, y: 250 });
  const [leftPlayer, setLeftPlayer] = useState<pos>({ x: 50, y: 200 });
  const [rightPlayer, setRrightPlayer] = useState<pos>({ x: 940, y: 200 });

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

            const calculatedheight = window.innerHeight * 0.7;
            if (response.body.gameInfo.type === 'HARD') {
              setBarHeight(calculatedheight / 10);
            } else {
              setBarHeight(calculatedheight / 5);
            }
          } else {
            console.log('game-info error', response);
            router.push('/404');
          }
        });

        gameSocket.emitWithAck('game-ready').then((response) => {
          if (response.status === 200) {
            console.log('game-ready');
          } else {
            console.log('game-ready error', response);
            router.push('/404');
          }
        });
      }

      const handleGameStart = () => {
        console.log('handleGameStart');
        setCountdown(3);
        const countdownInterval = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        setTimeout(() => {
          clearInterval(countdownInterval);
          setCountdown(0);
        }, 3000);
      };

      const handleGameEnd = () => {
        console.log('handleGameEnd');
        setCountdown(0);
        setEndFlag(true);
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

      const handleGameBall = (response: pos) => {
        console.log('handleGameBall', response);
        setBall(response);
      };

      const handleGamePlayer = (response: { left: pos; right: pos }) => {
        console.log('handleGamePlayer left', response.left);
        console.log('handleGamePlayer right', response.right);
        setLeftPlayer(response.left);
        setRrightPlayer(response.right);
      };

      const handleGameScore = (response: { left: number; right: number }) => {
        console.log('handleGameScore', response);
        setLeftScore(response.left);
        setRightScore(response.right);

        setCountdown(3);
        const countdownInterval = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        setTimeout(() => {
          clearInterval(countdownInterval);
          setCountdown(0);
        }, 3000);
      };

      gameSocket.on('game-start', handleGameStart);
      gameSocket.on('game-end', handleGameEnd);
      gameSocket.on('game-ball', handleGameBall);
      gameSocket.on('game-player', handleGamePlayer);
      gameSocket.on('game-score', handleGameScore);
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        gameSocket.off('game-start', handleGameStart);
        gameSocket.off('game-end', handleGameEnd);
        gameSocket.off('game-ball', handleGameBall);
        gameSocket.off('game-player', handleGamePlayer);
        gameSocket.off('game-score', handleGameScore);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [canvasRef, gameSocket]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;

      window.addEventListener('resize', handleResize);
      handleResize();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [gameType, width, height]);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

      context.fillStyle = '#f8f4e8';
      context.fillRect(0, 0, width, height);

      drawBall(context, normalizeCoordinates({ x: 500, y: 250 }));
      if (gameType == 'HARD') {
        drawPlayer(context, normalizeCoordinates({ x: 50, y: 225 }), '#889DF0');
        drawPlayer(context, normalizeCoordinates({ x: 940, y: 225 }), '#FC736D');
      } else {
        drawPlayer(context, normalizeCoordinates({ x: 50, y: 200 }), '#889DF0');
        drawPlayer(context, normalizeCoordinates({ x: 940, y: 200 }), '#FC736D');
      }
    }
  }, [gameType, leftScore, rightScore]);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

      context.fillStyle = '#f8f4e8';
      context.fillRect(0, 0, width, height);

      drawBall(context, normalizeCoordinates(ball));
      drawPlayer(context, normalizeCoordinates(leftPlayer), '#889DF0');
      drawPlayer(context, normalizeCoordinates(rightPlayer), '#FC736D');
    }
  }, [ball, leftPlayer, rightPlayer]);

  const drawBall = (context: CanvasRenderingContext2D, ballPos: pos) => {
    context.beginPath();
    context.arc(ballPos.x, ballPos.y, ballRadius, 0, ballRadius * Math.PI);
    context.fillStyle = '#8a7b66';
    context.fill();
  };

  const drawPlayer = (context: CanvasRenderingContext2D, playerPos: pos, color: string) => {
    context.beginPath();
    context.rect(playerPos.x, playerPos.y, barWidth, barHeight);
    context.fillStyle = color;
    context.fill();
  };

  const normalizeCoordinates = (position: pos): pos => {
    const normalizedX = (position.x / 1000) * width;
    const normalizedY = (position.y / 500) * height;
    return { x: normalizedX, y: normalizedY };
  };

  const handleResize = () => {
    const calculatedheight = window.innerHeight * 0.7;
    const calculatedWidth = calculatedheight * 2;
    setHeight(calculatedheight);
    setWidth(calculatedWidth);
    setBarWidth(calculatedheight / 50);
    setBallRadius(calculatedheight / 100);
    if (gameType === 'HARD') {
      setBarHeight(calculatedheight / 10);
    } else {
      setBarHeight(calculatedheight / 5);
    }
  };

  const handleHeaderTitle = (type: string) => {
    if (type === 'RANK') {
      return 'Rank Game';
    } else {
      return 'General Game';
    }
  };

  return (
    <Container>
      <Header title={handleHeaderTitle(gameType)} text={gameType} />
      <GameBackGround width={width} height={height} canvasRef={canvasRef} />
      <GameFooter
        leftUser={leftUser}
        rightUser={rightUser}
        leftScore={leftScore}
        rightScore={rightScore}
      />
      {countdown > 0 && <CountDown>{countdown}</CountDown>}
      {endFlag && <GameEndModal />}
    </Container>
  );
};

export default GamePage;

const CountDown = styled.div`
  position: absolute;
  font-size: 10vh;
  font-family: 'GiantsLight';
`;

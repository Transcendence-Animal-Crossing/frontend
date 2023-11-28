import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../../utils/SocketProvider';
import Container from '../../components/columnLayout';
import Header from '../../components/game/gameHeader';
import GameBackGround from '../../components/game/background';
import UserInfo from '../../components/userInfo';

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
  const DummyUser = {
    id: 0,
    nickName: '',
    intraName: '',
    avatar: '',
  };

  // canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [barHeight, setBarHeight] = useState<number>(0);
  const [barWidth, setBarWidth] = useState<number>(0);

  // game info
  const { gameId } = router.query as { gameId: string };
  const [gameType, setGameType] = useState<string>('');
  const [leftUser, setLeftUser] = useState<UserData>(DummyUser);
  const [rightUser, setRightUser] = useState<UserData>(DummyUser);
  const [leftScore, setLeftScore] = useState<number>(0);
  const [rightScore, setRightScore] = useState<number>(0);
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

  const handleAvatarPath = (avatar: string) => {
    const apiUrl = 'http://localhost:8080/';
    return apiUrl + avatar;
  };

  return (
    <Container>
      <Header title='General Game' text='일반 게임' />
      <GameBackGround width={width} height={height} canvasRef={canvasRef} />
      <GameContent>
        <UserInfoFrame sort='flex-start'>
          <UserImage
            src={handleAvatarPath(leftUser.avatar)}
            alt='Uploaded Image'
            width={300}
            height={300}
          />
          <UserTextFrame sort='flex-start'>
            <Text textsize='1.1vw'> {leftUser.nickName} </Text>
            <Text textsize='0.7vw'> {leftUser.intraName} </Text>
          </UserTextFrame>
        </UserInfoFrame>
        {/* <p>INGAME: {gameId}</p> */}
        <ScoreBoardFrame>
          <ScoreBoard color='1'> {leftScore} </ScoreBoard>
          <ScoreBoard color='2'> {rightScore} </ScoreBoard>
        </ScoreBoardFrame>
        <UserInfoFrame sort='flex-end'>
          <UserTextFrame sort='flex-end'>
            <Text textsize='1.1vw'> {rightUser.nickName} </Text>
            <Text textsize='0.7vw'> {rightUser.intraName} </Text>
          </UserTextFrame>
          <UserImage
            src={handleAvatarPath(rightUser.avatar)}
            alt='Uploaded Image'
            width={300}
            height={300}
          />
        </UserInfoFrame>
      </GameContent>
    </Container>
  );
};

export default GamePage;

const GameContent = styled.div`
  width: 70%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 1%;
`;

const ScoreBoardFrame = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ScoreBoard = styled.div<{ color: string }>`
  width: 40%;
  height: 100%;
  background-color: ${(props) => {
    switch (props.color) {
      case '1':
        return props.theme.colors.blue;
      case '2':
        return props.theme.colors.red;
    }
  }};
  color: ${(props) => props.theme.colors.cream};
  font-size: 3vh;
  font-family: 'GiantsLight';
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const UserInfoFrame = styled.div<{ sort: string }>`
  width: 20%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => props.sort};
  gap: 1vw;
`;

const UserImage = styled(Image)`
  width: 3vw;
  height: auto;
  border-radius: 50px;
`;

const UserTextFrame = styled.div<{ sort: string }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => props.sort};
  justify-content: center;
  gap: 0.5vw;
`;

const Text = styled.div<{ textsize: string }>`
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'GiantsLight';
  color: ${(props) => props.theme.colors.brown};
  font-size: ${(props) => props.textsize};
`;

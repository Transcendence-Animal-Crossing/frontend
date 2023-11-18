import styled from 'styled-components';
import { useState, useEffect } from 'react';
import UserInfo from '../userInfo';
import { getSession } from 'next-auth/react';

interface GameProps {
  game: {
    id: number;
    winnerScore: number;
    loserScore: number;
    playTime: number;
    loser: {
      id: number;
      nickName: string;
      intraName: string;
      avatar: string;
    };
    winner: {
      id: number;
      nickName: string;
      intraName: string;
      avatar: string;
    };
  };
}

const Game = (game: GameProps) => {
  const apiUrl = 'http://localhost:8080/';
  const [isWin, setIsWin] = useState(true);
  const [result, setResult] = useState('승' || '패');
  const [user1, setUser1] = useState({
    id: 0,
    nickName: '',
    intraName: '',
    score: 0,
    avatar: '',
  });

  const [user2, setUser2] = useState({
    id: 0,
    nickName: '',
    intraName: '',
    score: 0,
    avatar: '',
  });

  useEffect(() => {
    handleResult();
  }, []);

  const getUserId = async () => {
    const session = await getSession();
    const userId = session?.user.id;
    return userId;
  };

  const handleResult = async () => {
    const userId = (await getUserId()) || 0;
    await handleWinner(userId);
  };

  const handleWinner = async (userId: number) => {
    if (game.game.winner.id == userId) {
      setUser1({
        id: game.game.winner.id,
        nickName: game.game.winner.nickName,
        intraName: game.game.winner.intraName,
        score: game.game.winnerScore,
        avatar: apiUrl + game.game.winner.avatar,
      });
      setUser2({
        id: game.game.loser.id,
        nickName: game.game.loser.nickName,
        intraName: game.game.loser.intraName,
        score: game.game.loserScore,
        avatar: apiUrl + game.game.loser.avatar,
      });
      setIsWin(true);
      setResult('승');
    } else {
      setUser1({
        id: game.game.loser.id,
        nickName: game.game.loser.nickName,
        intraName: game.game.loser.intraName,
        score: game.game.loserScore,
        avatar: apiUrl + game.game.loser.avatar,
      });
      setUser2({
        id: game.game.winner.id,
        nickName: game.game.winner.nickName,
        intraName: game.game.winner.intraName,
        score: game.game.winnerScore,
        avatar: apiUrl + game.game.winner.avatar,
      });
      setIsWin(false);
      setResult('패');
    }
  };

  return (
    <GameFrame>
      <GameResult result={isWin}>{result}</GameResult>
      <GameBody>
        <UserInfo
          avatar={user1.avatar}
          nickName={user1.nickName}
          intraName={user1.intraName}
          width={30}
          height={4.5}
        />
        <ResultText result={isWin}>{user1.score}</ResultText>
        <VSText>VS</VSText>
        <ResultText result={!isWin}>{user2.score}</ResultText>
        <UserInfo
          avatar={user2.avatar}
          nickName={user2.nickName}
          intraName={user2.intraName}
          width={40}
          height={4.5}
        />
      </GameBody>
    </GameFrame>
  );
};

export default Game;

const GameFrame = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: 'GiantsLight';
  background-color: #fbf3e6;
  border-radius: 5px;
  margin-bottom: 1%;
  gap: 5%;
`;

const GameResult = styled.div<{ result: boolean }>`
  width: 9%;
  height: 100%;
  display: flex;
  flex-direction: col;
  align-items: center;
  justify-content: center;
  border-radius: 5px 0 0 5px;
  background-color: ${(props) =>
    props.result ? props.theme.colors.green : props.theme.colors.red};
  color: ${(props) => props.theme.colors.white};
`;

const GameBody = styled.div`
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 7%;
  background-color: #fbf3e6;
  border-radius: 5px;
  margin: 0 3%;
`;

const ResultText = styled.div<{ result: boolean }>`
  width: 5%;
  height: 100%;
  font-size: medium;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.result ? props.theme.colors.green : props.theme.colors.red};
`;

const VSText = styled.div`
  width: 5%;
  height: 100%;
  font-size: small;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.brown};
`;

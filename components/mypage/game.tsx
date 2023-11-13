import styled from "styled-components";
import { useState, useEffect } from "react";
import UserInfo from "./userInfo";
import { useSession } from "next-auth/react";

const Game: React.FC<{
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
  userId: number;
}> = (game, userId) => {
  const { data: session } = useSession();
  const [user1, setUser1] = useState({
    id: 0,
    nickName: "",
    intraName: "",
    score: 0,
    avatar: "",
  });

  const [user2, setUser2] = useState({
    id: 0,
    nickName: "",
    intraName: "",
    score: 0,
    avatar: "",
  });

  const apiUrl = "http://localhost:8080/";
  const [isWin, setIsWin] = useState(true);
  const [result, setResult] = useState("승" || "패");

  useEffect(() => {
    handleResult();
  });

  const handleResult = () => {
    console.log("handleResult()");
    console.log(game.game.winner.id);
    console.log(userId);
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
      setResult("승");
      console.log("승");
      console.log(userId, game.game.winner.id);
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
      setResult("패");
      console.log("패");
      console.log(userId, game.game.winner.id);
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
        />
        <ResultText result={isWin}>{user1.score}</ResultText>
        <VSText>VS</VSText>
        <ResultText result={!isWin}>{user2.score}</ResultText>
        <UserInfo
          avatar={user2.avatar}
          nickName={user2.nickName}
          intraName={user2.intraName}
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
  font-family: "GiantsLight";
  background-color: #fbf3e6;
  border-radius: 5px;
  margin-bottom: 1%;
  // overflow: "auto";
`;

const GameResult = styled.div<{ result: boolean }>`
  width: 10%;
  height: 100%;
  display: flex;
  flex-direction: col;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.result ? props.theme.colors.green : props.theme.colors.red};
`;

const GameBody = styled.div`
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5%;
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

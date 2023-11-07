import styled from "styled-components";
import css from "styled-jsx/css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import home from "../../../public/Icon/home.png";
import axiosInstance from "../../../utils/axiosInstance";
import InfiniteScroll from "react-infinite-scroll-component";
import Game from "./game";

const MatchHistoryContainer = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState("rank");
  const [hasMore, setHasMore] = useState(false);
  const [matchHistory, setMatchHistory] = useState({
    games: [
      {
        id: 5,
        winnerScore: 7,
        loserScore: 10,
        playTime: 8,
        loser: {
          id: 106932,
          nickName: "mkwon",
          intraName: "mkwon",
        },
        winner: {
          id: 107066,
          nickName: "sohlee",
          intraName: "sohlee",
        },
      },
      {
        id: 4,
        winnerScore: 7,
        loserScore: 10,
        playTime: 8,
        loser: {
          id: 106932,
          nickName: "mkwon",
          intraName: "mkwon",
        },
        winner: {
          id: 107066,
          nickName: "sohlee",
          intraName: "sohlee",
        },
      },
      {
        id: 3,
        winnerScore: 7,
        loserScore: 10,
        playTime: 10,
        loser: {
          id: 106932,
          nickName: "mkwon",
          intraName: "mkwon",
        },
        winner: {
          id: 107066,
          nickName: "sohlee",
          intraName: "sohlee",
        },
      },
      {
        id: 2,
        winnerScore: 7,
        loserScore: 10,
        playTime: 12,
        loser: {
          id: 106932,
          nickName: "mkwon",
          intraName: "mkwon",
        },
        winner: {
          id: 107066,
          nickName: "sohlee",
          intraName: "sohlee",
        },
      },
    ],
  });

  useEffect(() => {
    getMatchHistory();
  }, []);

  useEffect(() => {
    getMatchHistory();
  }, [mode]);

  const getMatchHistory = async () => {
    try {
      const userId = session?.user.user_id;
      const response = await axiosInstance.get("/games/" + mode, {
        params: {
          id: userId,
          offset: 0,
        },
      });
      console.log("getMatchHistory() response");
      console.log(response);
      setMatchHistory(response.data);
    } catch (error) {
      console.log("Error occured in getMatchHistory()");
      console.log(error);
    }
  };

  const handleRouteLobby = async () => {
    router.push("/");
  };

  // 임시로 더미데이터를 갖다 붙이는 함수
  const fetchMoreData = async () => {
    let copy = { ...matchHistory };
    copy.games = copy.games.concat(matchHistory.games);
    setMatchHistory(copy);
  };

  return (
    <MatchHistoryFrame>
      <MatchHistoryHeader>
        <Mode>
          <ModeButton onClick={() => setMode("general")}>
            <div className={`${mode === "general" ? "select" : "unselect"}`}>
              일반
            </div>
          </ModeButton>
          <ModeButton onClick={() => setMode("rank")}>
            <div className={`${mode === "rank" ? "select" : "unselect"}`}>
              랭크
            </div>
          </ModeButton>
        </Mode>
        <Button onClick={handleRouteLobby}>
          <InfoImage src={home} alt="home" />
        </Button>
      </MatchHistoryHeader>
      <MatchHistoryBody>
        <InfiniteScroll
          dataLength={matchHistory.games.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          {matchHistory.games.map((game) => (
            <Game game={game} />
          ))}
        </InfiniteScroll>
        <style jsx>{Scroller}</style>
      </MatchHistoryBody>
    </MatchHistoryFrame>
  );
};

export default MatchHistoryContainer;

const MatchHistoryFrame = styled.div`
  margin: 3%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1%;
`;

const MatchHistoryHeader = styled.div`
  width: 80%;
  height: 10%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Mode = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5%;
  gap: 10%;
`;

const ModeButton = styled.button`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.lightbrown};
  font-family: "GiantsLight";
  border-radius: 15px;
  border: none;
  cursor: pointer;
  .select {
    border-radius: 15px;
    background-color: ${(props) => props.theme.colors.lightgold};
    color: ${(props) => props.theme.colors.white};
  }
  .unselect {
    border-radius: 15px;
    background-color: ${(props) => props.theme.colors.cream};
    color: ${(props) => props.theme.colors.lightgold};
  }
`;

const Button = styled.div`
  height: 30%;
  width: auto;
  padding: 0.5vh 1.5vh;
  background-color: ${(props) => props.theme.colors.beige};
  border-radius: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 5%;
`;

const InfoImage = styled(Image)`
  height: 100%;
  width: auto;
  cursor: pointer;
`;

const MatchHistoryBody = styled.div`
  height: 90%;
  width: 100%;
  // background-color: skyblue;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1%;
  .infinite-scroll-component__outerdiv {
    height: 100%;
    width: 80%;
  }
  .infinite-scroll-component {
    height: 100%;
  }
`;

const Scroller = css`
  .infinite-scroll-component__outerdiv {
    height: 100%;
    width: 80%;
  }
  .infinite-scroll-component {
    height: 100%;
    back
  }
`;

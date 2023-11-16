import styled from "styled-components";
import { useState, useEffect } from "react";
import Image from "next/image";
import UserContainer from "../../components/mypage/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axiosInstance from "../../utils/axiosInstance";
import AchievementFrame from "../../components/mypage/achievement";
import home from "../../public/Icon/home.png";
import InfiniteScroll from "react-infinite-scroll-component";
import Container from "../../components/columnNevLayout";
import Game from "../../components/mypage/game";

const MyPage = () => {
  const { data: session } = useSession();
  console.log(session);
  const apiUrl = "http://localhost:8080/";
  const [nickname, setNickname] = useState("nickname");
  const [rankScore, setRankScore] = useState(0);
  const [tierIndex, setTierIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(1);
  const [winCount, setWinCount] = useState(1);
  const [winRate, setWinRate] = useState(100);
  const [avatarPath, setAvatarPath] = useState(
    "http://localhost:8080/original/profile2.png"
  );
  const [isRank, setIsRank] = useState(false);
  const router = useRouter();
  const [mode, setMode] = useState("rank");
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const matchPerPage = 10;
  const [matchHistory, setMatchHistory] = useState({
    games: [],
  });

  useEffect(() => {
    getUserInfo();
    getMatchHistory();
  }, []);

  useEffect(() => {
    getUserInfo();
  });

  useEffect(() => {
    getMatchHistory();
  }, [mode]);

  const handleRouteLobby = async () => {
    router.push("/");
  };

  const getUserId = async () => {
    const userId = session?.user.id;
    return userId;
  };

  const getUserInfo = async () => {
    try {
      const userId = await getUserId();
      // const userId = session?.user.id;
      const response = await axiosInstance.get("/users/detail", {
        params: { id: userId },
      });
      console.log("getUserInfo() response");
      console.log(response);
      setNickname(response.data.nickName);
      setAvatarPath(apiUrl + response.data.avatar);
      handleRank(response.data.rankScore);
    } catch (error) {
      console.log("Error occured in getUserInfo()");
      console.log(error);
    }

    try {
      const userId = await getUserId();
      // const userId = session?.user.id;
      const response = await axiosInstance.get("/record", {
        params: {
          id: userId,
          isRank: isRank,
        },
      });
      console.log("getRecord() response");
      console.log(response);
      handleRecord(response.data);
    } catch (error) {
      console.log("Error occured in getRecord()");
      console.log(error);
    }
  };

  const getMatchHistory = async () => {
    try {
      const userId = await getUserId();
      // const userId = session?.user.id;
      console.log("getMatchHistory() userId");
      console.log(userId);
      await getIsRank();
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

  const getIsRank = () => {
    if (mode === "rank") {
      setIsRank(true);
    } else if (mode === "general") {
      setIsRank(false);
    }
  };

  const handleRecord = async (data: any) => {
    if (isRank) {
      setTotalCount(data.rankTotalCount);
      setWinCount(data.rankWinCount);
      setWinRate(data.rankWinRate);
    } else if (!isRank) {
      setTotalCount(data.generalTotalCount);
      setWinCount(data.generalWinCount);
      setWinRate(data.generalWinRate);
      return;
    }
  };

  const handleRank = async (rankScore: number) => {
    setRankScore(rankScore);
    if (rankScore < 1000) {
      setTierIndex(0);
    } else {
      setTierIndex(1);
    }
  };

  const fetchMoreData = () => {
    if (matchHistory.games.length >= totalCount) {
      setHasMore(false);
      console.log("fetchMoreData() matchHistory.games.length");
      return;
    }
    setTimeout(async () => {
      const userId = await getUserId();
      // const userId = session?.user.id;
      const copy = { ...matchHistory };
      console.log("getMatchHistory() userId");
      console.log(userId);
      setOffset(offset + matchPerPage);
      await getIsRank();
      try {
        const response = await axiosInstance.get("/games/" + mode, {
          params: {
            id: userId,
            offset: offset,
          },
        });
        copy.games = copy.games.concat(response.data.games);
        setMatchHistory(copy);
        console.log("getMatchHistory() response");
        console.log(response);
      } catch (error) {
        console.log("Error occured in getMatchHistory()");
        console.log(error);
      }
    }, 500);
  };

  return (
    <Container>
      <MyPageFrame>
        <UserContainer
          avatar={avatarPath}
          nickname={nickname}
          tierIndex={tierIndex}
          totalCount={totalCount}
          winCount={winCount}
          winRate={winRate}
        />
        <InfoContainer>
          <MatchHistoryFrame>
            <MatchHistoryHeader>
              <Mode>
                <ModeButton onClick={() => setMode("general")}>
                  <div
                    className={`${mode === "general" ? "select" : "unselect"}`}
                  >
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
            <MatchHistory>
              <InfiniteScroll
                dataLength={matchHistory.games.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<div className="loader">Loading...</div>}
                height={300}
              >
                {matchHistory.games.map((game) => (
                  <Game game={game} />
                ))}
              </InfiniteScroll>
            </MatchHistory>
          </MatchHistoryFrame>
          <DivisionBar />
          <AchievementFrame></AchievementFrame>
        </InfoContainer>
      </MyPageFrame>
    </Container>
  );
};

export default MyPage;

const MyPageFrame = styled.div`
  width: 70%;
  height: 70%;
  display: flex;
  flex Direction: row;
`;

const InfoContainer = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DivisionBar = styled.div`
  width: 90%;
  height: 1.5px;
  background-color: ${(props) => props.theme.colors.brown};
`;

const MatchHistoryFrame = styled.div`
  margin: 3%;
  width: 100%;
  height: 50%;
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

const MatchHistory = styled.div`
  height: 90%;
  width: 100%;
  // background-color: skyblue;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1%;
  // overflow: "auto";
  .infinite-scroll-component__outerdiv {
    height: 100%;
    width: 80%;
  }

  .loader {
    color: ${(props) => props.theme.colors.brown};
    font-family: "GiantsLight";
    font-size: small;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

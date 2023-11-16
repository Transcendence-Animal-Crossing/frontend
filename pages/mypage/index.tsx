import styled from "styled-components";
import { useState, useEffect } from "react";
import Image from "next/image";
import UserContainer from "../../components/mypage/user";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import axiosInstance from "../../utils/axiosInstance";
import AchievementFrame from "../../components/mypage/achievement";
import home from "../../public/Icon/home.png";
import InfiniteScroll from "react-infinite-scroll-component";
import Container from "../../components/columnNevLayout";
import Game from "../../components/mypage/game";

const MyPage = () => {
  const apiUrl = "http://localhost:8080/";
  const [nickname, setNickname] = useState("nickname");
  const [tierIndex, setTierIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(1);
  const [winCount, setWinCount] = useState(1);
  const [winRate, setWinRate] = useState(100);
  const [avatarPath, setAvatarPath] = useState(
    "http://localhost:8080/original/profile2.png"
  );
  const router = useRouter();
  const [isRank, setIsRank] = useState(true);
  const [mode, setMode] = useState("rank");
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const matchPerPage = 8;
  const [matchHistory, setMatchHistory] = useState({
    games: [],
  });

  useEffect(() => {
    getUserInfo();
    getRecord();
    getMatchHistory();
  }, []);

  useEffect(() => {
    getRecord();
    getMatchHistory();
  }, [mode]);

  const handleRouteLobby = async () => {
    router.push("/");
  };

  const getUserId = async () => {
    const session = await getSession();
    const userId = session?.user.id;
    return userId;
  };

  const getUserInfo = async () => {
    try {
      const userId = await getUserId();
      const response = await axiosInstance.get("/users/detail", {
        params: { id: userId },
      });
      console.log("getUserInfo() response");
      console.log(response);
      await setNickname(response.data.nickName);
      await setAvatarPath(apiUrl + response.data.avatar);
      await handleRank(response.data.rankScore);
    } catch (error) {
      console.log("Error occured in getUserInfo()");
      console.log(error);
    }
  };

  const getRecord = async () => {
    try {
      const userId = await getUserId();
      const response = await axiosInstance.get("/record", {
        params: {
          id: userId,
          isRank: isRank,
        },
      });
      await handleRecord(response.data);
      await printRecord(response.data);
    } catch (error) {
      console.log("Error occured in getRecord()", error);
    }
  };

  const printRecord = async (data: any) => {
    console.log("getRecord() response", isRank, mode, data);
  };

  const getMatchHistory = async () => {
    try {
      const userId = await getUserId();
      await setMatchHistory({
        games: [],
      });
      await setHasMore(true);
      await setOffset(0);
      const response = await axiosInstance.get("/games/" + mode, {
        params: {
          id: userId,
          offset: 0,
        },
      });
      console.log("getMatchHistory() response first", isRank, mode);
      console.log(response);
      await setOffset(matchPerPage);
      await setMatchHistory(response.data);
    } catch (error) {
      console.log("Error occured in getMatchHistory()");
      console.log(error);
    }
  };

  const handleRecord = async (data: any) => {
    if (isRank) {
      await setTotalCount(data.rankTotalCount);
      setWinCount(data.rankWinCount);
      setWinRate(data.rankWinRate);
    } else if (!isRank) {
      setTotalCount(data.generalTotalCount);
      setWinCount(data.generalWinCount);
      setWinRate(data.generalWinRate);
    }
  };

  const handleRank = async (rankScore: number) => {
    if (rankScore < 1000) {
      setTierIndex(0);
    } else {
      setTierIndex(1);
    }
  };

  const handelMatchHistory = async (response: any) => {
    const copy = { ...matchHistory };
    copy.games = copy.games.concat(response.data.games);
    console.log("offset", offset);
    return copy;
  };

  const fetchMoreData = () => {
    console.log("fetchMoreData() start");
    console.log("offset", offset);
    console.log("totalCount", totalCount);
    console.log("matchHistory.games.length", matchHistory.games.length);
    if (offset >= totalCount) {
      setHasMore(false);
      console.log("fetchMoreData() end");
      return;
    }
    setTimeout(async () => {
      const userId = await getUserId();
      try {
        const response = await axiosInstance.get("/games/" + mode, {
          params: {
            id: userId,
            offset: offset,
          },
        });
        console.log("getMatchHistory() response", isRank, mode, offset);
        const copy = await handelMatchHistory(response);
        await setMatchHistory(copy);
        await setOffset(offset + matchPerPage);
        console.log(response);
      } catch (error) {
        console.log("Error occured in getMatchHistory()");
        console.log(error);
      }
    }, 500);
  };

  const handleMode = async (mode: string) => {
    if (mode === "rank") {
      setIsRank(true);
    } else if (mode === "general") {
      setIsRank(false);
    }
    setMode(mode);
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
                <ModeButton onClick={() => handleMode("general")}>
                  <div
                    className={`${mode === "general" ? "select" : "unselect"}`}
                  >
                    일반
                  </div>
                </ModeButton>
                <ModeButton onClick={() => handleMode("rank")}>
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

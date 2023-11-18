import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import UserContainer from '../../components/mypage/user';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axiosInstance';
import AchievementFrame from '../../components/mypage/achievement';
import home from '../../public/Icon/home.png';
import InfiniteScroll from 'react-infinite-scroll-component';
import Container from '../../components/columnNevLayout';
import Game from '../../components/mypage/game';

const UserPage = () => {
  const apiUrl = 'http://localhost:8080/';
  const router = useRouter();
  const { userId } = router.query as { userId: string };

  // userInfo
  const [intraname, setIntraname] = useState('intraname');
  const [nickname, setNickname] = useState('nickname');
  const [avatarPath, setAvatarPath] = useState(apiUrl + 'original/profile2.png');
  const [tierIndex, setTierIndex] = useState(0);

  // achievement
  const [achieveList, setAchieveList] = useState([0, 0, 0, 0, 0, 0, 0]);

  // record
  const [totalCount, setTotalCount] = useState(1);
  const [winCount, setWinCount] = useState(1);
  const [winRate, setWinRate] = useState(100);

  // matchHistory
  const [isRank, setIsRank] = useState(true);
  const [mode, setMode] = useState('rank');
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const matchPerPage = 8;
  const [matchHistory, setMatchHistory] = useState({
    games: [],
  });

  useEffect(() => {
    if (userId) {
      getUserInfo();
    }
  }, [userId]);

  useEffect(() => {
    getRecord();
    getMatchHistory();
  }, [userId, mode]);

  const handleRouteLobby = async () => {
    router.push('/');
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/users/detail', {
        params: { id: userId },
      });
      console.log('getUserInfo() response');
      console.log(response);
      await setIntraname(response.data.intraName);
      await setNickname(response.data.nickName);
      await setAvatarPath(apiUrl + response.data.avatar);
      await setAchieveList(response.data.achievements);
      await handleRank(response.data.rankScore);
    } catch (error) {
      console.log('Error occured in getUserInfo()');
      console.log(error);
    }
  };

  const getRecord = async () => {
    try {
      const response = await axiosInstance.get('/record', {
        params: {
          id: userId,
          isRank: isRank,
        },
      });
      await handleRecord(response.data);
    } catch (error) {
      console.log('Error occured in getRecord()', error);
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
    }
  };

  const getMatchHistory = async () => {
    try {
      await initMatchHistory();
      const response = await axiosInstance.get('/games/' + mode, {
        params: {
          id: userId,
          offset: 0,
        },
      });
      console.log('getMatchHistory() response first', isRank, mode);
      console.log(response);
      await afterMatchHistory(response.data, 0);
    } catch (error) {
      console.log('Error occured in getMatchHistory()');
      console.log(error);
    }
  };

  const initMatchHistory = async () => {
    await setMatchHistory({
      games: [],
    });
    await setOffset(0);
    await setHasMore(true);
  };

  const afterMatchHistory = async (data: any, offset: number) => {
    if (data.games.length == 0) {
      setHasMore(false);
      return;
    }
    setOffset(offset + matchPerPage);
    setMatchHistory(data);
  };

  const handleRank = async (rankScore: number) => {
    if (rankScore < 1000) {
      setTierIndex(0);
    } else if (rankScore < 3000) {
      setTierIndex(1);
    } else if (rankScore < 5000) {
      setTierIndex(2);
    } else if (rankScore < 7000) {
      setTierIndex(3);
    } else {
      setTierIndex(4);
    }
  };

  const handelMatchHistory = async (response: any) => {
    const copy = { ...matchHistory };
    copy.games = copy.games.concat(response.data.games);
    console.log('offset', offset);
    return copy;
  };

  const fetchMoreData = () => {
    console.log('fetchMoreData() start');
    if (offset >= totalCount) {
      setHasMore(false);
      console.log('fetchMoreData() end');
      return;
    }
    setTimeout(async () => {
      try {
        const response = await axiosInstance.get('/games/' + mode, {
          params: {
            id: userId,
            offset: offset,
          },
        });
        console.log('getMatchHistory() response', isRank, mode, offset);
        const copy = await handelMatchHistory(response);
        await afterMatchHistory(copy, offset);
        console.log(response);
      } catch (error) {
        console.log('Error occured in getMatchHistory()');
        console.log(error);
      }
    }, 500);
  };

  const handleMode = async (mode: string) => {
    if (mode === 'rank') {
      setIsRank(true);
    } else if (mode === 'general') {
      setIsRank(false);
    }
    setMode(mode);
  };

  return (
    <Container>
      <MyPageFrame>
        <UserContainer
          intraname={intraname}
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
                <ModeButton onClick={() => handleMode('general')}>
                  <div className={`${mode === 'general' ? 'select' : 'unselect'}`}>일반</div>
                </ModeButton>
                <ModeButton onClick={() => handleMode('rank')}>
                  <div className={`${mode === 'rank' ? 'select' : 'unselect'}`}>랭크</div>
                </ModeButton>
              </Mode>
              <Button onClick={handleRouteLobby}>
                <InfoImage src={home} alt='home' />
              </Button>
            </MatchHistoryHeader>
            <MatchHistory>
              <InfiniteScroll
                dataLength={matchHistory.games.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<div className='loader'>Loading...</div>}
                height={300}
              >
                {matchHistory.games.map((game) => (
                  <Game game={game} userId={Number(userId)} />
                ))}
              </InfiniteScroll>
            </MatchHistory>
          </MatchHistoryFrame>
          <DivisionBar />
          <AchievementFrame achieveList={achieveList} />
        </InfoContainer>
      </MyPageFrame>
    </Container>
  );
};

export default UserPage;

const MyPageFrame = styled.div`
  width: 70%;
  height: 70%;
  display: flex;
  flex-direction: row;
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
  font-family: 'GiantsLight';
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1%;
  .infinite-scroll-component__outerdiv {
    height: 100%;
    width: 80%;
  }

  .loader {
    color: ${(props) => props.theme.colors.brown};
    font-family: 'GiantsLight';
    font-size: small;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

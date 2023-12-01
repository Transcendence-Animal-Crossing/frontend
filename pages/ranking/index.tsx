import Container from '../../components/columnNevLayout';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import axiosInstance from '../../utils/axiosInstance';
import Header from '../../components/lobbyHeader';
import UserList from '../../components/ranking/userList';
import search from '../../public/Icon/search.png';
import prev from '../../public/Icon/prev.png';
import next from '../../public/Icon/next.png';
import { handleSetUserAvatar } from '../../utils/avatarUtils';

const Ranking = () => {
  const userPerPage = 8;
  const { data: session } = useSession();
  console.log(session);

  const [offset, setOffset] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getRankingList();
  }, []);

  useEffect(() => {
	if (!isSearch) {
		getRankingList();
	} else {
		getSearchList();
	}
  }, [offset]);

  const getRankingList = async () => {
    try {
      const response = await axiosInstance.get('/record/rank', {
        params: { offset: offset },
      });
      console.log('getRankingList() response');
      response.data.map((user: any) => {
        user.avatar = handleSetUserAvatar(user.avatar);
      });
      console.log(response.data);
      await printResponse(response.data);
      await setUserList(response.data);
    } catch (error: any) {
      console.log(error);
      handleError(error);
    }
  };

  const getSearchList = async () =>  {
	try {
		const response = await axiosInstance.post('/users/search', {
		  name: searchText,
		  offset: offset,
		});
		console.log('handleSearch() response');
		console.log(response.data);
		response.data.map((user: any) => {
		  user.avatar = handleSetUserAvatar(user.avatar);
		});
		await printResponse(response.data);
		await setUserList(response.data);
	  } catch (error: any) {
		console.log(error);
		handleError(error);
	  }
  }

  const printResponse = async (data: any) => {
    console.log('printResponse() data', data);
  };

  const handleSearch = async () => {
	setIsSearch(true);
	setOffset(0);
	await getSearchList();
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePrevButton = async () => {
    setOffset(offset - userPerPage);
  };

  const handlerNextButton = async () => {
    setOffset(offset + userPerPage);
  };

  const handleError = (error: any) => {
    if (error.response.status == 400) {
      console.log('handleSearch() error.response.data.message');
      if (error.response.data.message == '더이상 돌려줄 데이터 없음') {
        setOffset(offset - userPerPage);
      } else if (error.response.data.message == 'offset은 양수만 가능') {
        setOffset(0);
      }
    }
  };

  return (
    <Container>
      <Header title='Ranking' text='전체 랭킹' />
      <RankingFrame>
        <SearchFrame>
          <Button onClick={handleSearch}>
            <InfoImage src={search} alt='Search Button' />
          </Button>
          <Input
            type='text'
            placeholder='검색할 유저 이름을 입력해주세요'
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
            maxLength={10}
            required
          />
        </SearchFrame>
        <RankingListFrame>
          <UserList userList={userList}></UserList>
          <PageButton>
            <PageMoveImage src={prev} alt='Prev Button' onClick={handlePrevButton} />
            <PageMoveImage src={next} alt='Next Button' onClick={handlerNextButton} />
          </PageButton>
        </RankingListFrame>
      </RankingFrame>
    </Container>
  );
};

export default Ranking;

const RankingFrame = styled.div`
  width: 70%;
  height: 70%;
  display: flex;
  flex-direction: column;
`;

const SearchFrame = styled.div`
  width: 100%;
  height: 7%;
  display: flex;
  margin-bottom: 2vh;
  flex-direction: row;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.gold02};
`;

const Button = styled.div`
  width: auto;
  padding: 0.5vh 1.5vh;
  border-radius: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const InfoImage = styled(Image)`
  height: 2.5vh;
  width: auto;
  cursor: pointer;
`;

const PageButton = styled.div`
  height: 10%;
  width: auto;
  padding: 0.5vh 1.5vh;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-family: 'GiantsLight';
`;

const PageMoveImage = styled(Image)`
  height: 2.5vh;
  width: auto;
  cursor: pointer;
  margin: 0 1vh;
`;

const RankingListFrame = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input.attrs({ required: true })`
  width: 90%;
  height: 90%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.brown};
  font-family: 'BMHANNAAir';
  font-size: 2vh;
  &:focus {
    outline: none;
  }
`;

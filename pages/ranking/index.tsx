import styled from "styled-components";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axiosInstance from "../../utils/axiosInstance";
import { bronze, silver, gold, platinum, diamond } from "./components/tier";
import Header from "./components/rankingHeader";
import search from "../../public/Icon/search.png";
import UserList from "./components/userList";
import prev from "../../public/Icon/prev.png";
import next from "../../public/Icon/next.png";

import Container from "../../components/columnNevLayout";

const Ranking = () => {
  const apiUrl = "http://localhost:8080/";
  const { data: session } = useSession();
  console.log(session);

  const [offset, setOffset] = useState(0);
  const [searchText, setSearchText] = useState("");

  const [userList, setUserList] = useState([
    {
      id: 107066,
      nickName: "sohlee",
      intraName: "sohlee",
      rankScore: 1000,
      avatar: apiUrl + "original/profile2.png",
      rankGameTotalCount: 4,
      ranking: 1,
    },
    {
      id: 106932,
      nickName: "mkwon",
      intraName: "mkwon",
      rankScore: 333,
      avatar: apiUrl + "original/profile2.png",
      rankGameTotalCount: 11,
      ranking: 2,
    },
  ]);

  useEffect(() => {
    getRankingList();
  }, []);

  useEffect(() => {
    getRankingList();
  }, [offset]);

  const getRankingList = async () => {
    try {
      const response = await axiosInstance.get("/record/rank", {
        params: { offset: offset },
      });
      console.log("getRankingList() response");
      response.data.map((user: any) => {
        user.avatar = apiUrl + user.avatar;
      });
      console.log(response.data);
      await printResponse(response.data);
      // await setOffset(offset + response.data.length);
      await setUserList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const printResponse = async (data: any) => {
    console.log("printResponse() data");
    console.log(data);
  };

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.post("/users/search", {
        name: searchText,
      });
      console.log("handleSearch() response");
      console.log(response.data);
      response.data.map((user: any) => {
        user.avatar = apiUrl + user.avatar;
      });
      await setUserList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrevButton = async () => {
    setOffset(offset - 8);
  };

  const handlerNextButton = async () => {
    setOffset(offset + 8);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container>
      <RankingFrame>
        <Header />
        <SearchFrame>
          <Button onClick={handleSearch}>
            <InfoImage src={search} alt="Search Button" />
          </Button>
          <Input
            type="text"
            placeholder="검색할 유저 이름을 입력해주세요"
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
            maxLength={10}
            required
          />
        </SearchFrame>
        <RankingListFrame>
          <UserList userList={userList}></UserList>
          <PageButton>
            <PageMoveImage
              src={prev}
              alt="Prev Button"
              onClick={handlePrevButton}
            />
            <PageMoveImage
              src={next}
              alt="Next Button"
              onClick={handlerNextButton}
            />
          </PageButton>
        </RankingListFrame>
      </RankingFrame>
    </Container>
  );
};

export default Ranking;

// 모든 아이템 들어가는 네모 박스
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
  width: auto;
  padding: 0.5vh 1.5vh;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-family: "GiantsLight";
`;

const PageMoveImage = styled(Image)`
  height: 2.5vh;
  width: auto;
  cursor: pointer;
  margin: 0 1vh;
`;

const RankingListFrame = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  // background-color: ${(props) => props.theme.colors.beige};
`;

const Input = styled.input.attrs({ required: true })`
  width: 90%;
  height: 90%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.brown};
  font-family: "BMHANNAAir";
  font-size: 2vh;
  &:focus {
    outline: none;
  }
`;

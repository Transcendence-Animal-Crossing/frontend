import styled from "styled-components";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axiosInstance from "../../utils/axiosInstance";
import { bronze, silver, gold, platinum, diamond } from "./components/tier";
import Header from "./components/rankingHeader";
import search from "../../public/Icon/search.png";
import UserList from "./components/userList";

import Container from "../../components/columnNevLayout";

const Ranking = () => {
  const { data: session } = useSession();
  console.log(session);

  const [userList, setUserList] = useState([
    {
      id: 107066,
      ranking: 1,
      nickName: "반여동물주먹",
      intraName: "sohlee",
      avatar: "http://localhost:8080/original/profile2.png",
      rankScore: 1000,
      matchCount: 10,
    },
  ]);

  const handleSearch = async () => {};

  return (
    <Container>
      <RankingFrame>
        <Header />
        <SearchFrame>
          <Button onClick={handleSearch}>
            <InfoImage src={search} alt="Search Button" />
          </Button>
        </SearchFrame>
        <RankingListFrame>
          <UserList userList={userList}></UserList>
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
  background-color: ${(props) => props.theme.colors.gold};
  opacity: 0.2;
`;

const Button = styled.div`
  // height: 50%;
  width: auto;
  float: right;
  padding: 0.5vh 1.5vh;
  border-radius: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  // margin-left: 5%;
`;

const InfoImage = styled(Image)`
  height: 2.5vh;
  width: auto;
  cursor: pointer;
`;

const RankingListFrame = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.beige};
`;

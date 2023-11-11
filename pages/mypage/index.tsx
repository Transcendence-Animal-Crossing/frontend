import styled from "styled-components";
import { useState, useEffect } from "react";
import Image from "next/image";
import UserContainer from "./components/user";
import InfoContainer from "./components/info";
import { useSession } from "next-auth/react";
import { profile12, profile2 } from "./components/profile";
import axiosInstance from "../../utils/axiosInstance";
import { bronze, silver, gold, platinum, diamond } from "./components/tier";

import Container from "../../components/columnNevLayout";

const MyPage = () => {
  const { data: session } = useSession();
  console.log(session);
  const apiUrl = "http://localhost:8080/";
  const [nickname, setNickname] = useState("nickname");
  const [rankScore, setRankScore] = useState(0);
  const [tierIndex, setTierIndex] = useState(0);
  const [totalGames, setTotalGames] = useState(1);
  const [totalWins, setTotalWins] = useState(1);
  const [winRate, setWinRate] = useState(1);
  const [avatarPath, setAvatarPath] = useState(
    "http://localhost:8080/original/profile2.png"
  );

  useEffect(() => {
    console.log("rendering");
    getUserInfo();
  });

  const getUserInfo = async () => {
    try {
      const userId = session?.user.id;
      const response = await axiosInstance.get("/users/detail", {
        params: { id: userId },
      });
      console.log("getUserInfo() response");
      console.log(response);
      setNickname(response.data.nickName);
      handleRank(response.data.rankScore);
      setAvatarPath(apiUrl + response.data.avatar);
      // handleAvatarPath(response.data.avatar);
      // console.log(response.data.avatar);
    } catch (error) {
      console.log("Error occured in getUserInfo()");
      console.log(error);
    }

    try {
      const userId = session?.user.id;
      const response = await axiosInstance.get("/games/general/" + userId);
      console.log("getUserInfo() response");
      console.log(response);
      setTotalGames(response.data.stats.totalGames);
      setTotalWins(response.data.stats.totalWins);
      setWinRate(response.data.stats.winRate);
    } catch (error) {
      console.log("Error occured in getUserInfo()");
      console.log(error);
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

  return (
    <Container>
      <MyPageFrame>
        <UserContainer
          avatar={avatarPath}
          nickname={nickname}
          tierIndex={tierIndex}
          totalGames={totalGames}
          totalWins={totalWins}
          winRate={winRate}
        ></UserContainer>
        <InfoContainer></InfoContainer>
      </MyPageFrame>
    </Container>
  );
};

export default MyPage;

// 모든 아이템 들어가는 네모 박스
const MyPageFrame = styled.div`
  width: 70%;
  height: 70%;
  display: flex;
  flex Direction: row;
`;

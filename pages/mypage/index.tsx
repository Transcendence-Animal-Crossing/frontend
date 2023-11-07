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
  const [generalTotalCount, setTotalCount] = useState(1);
  const [generalWinCount, setWinCount] = useState(1);
  const [generalWinRate, setWinRate] = useState(100);
  const [avatarPath, setAvatarPath] = useState(
    "http://localhost:8080/original/profile2.png"
  );
  const [isRank, setIsRank] = useState(true);

  useEffect(() => {
    console.log("rendering");
    getUserInfo();
  });

  const getUserInfo = async () => {
    try {
      const userId = session?.user.user_id;
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
      const userId = session?.user.user_id;
      const response = await axiosInstance.get("/record", {
        params: {
          id: userId,
          isRank: { isRank },
        },
      });
      console.log("getRecord() response");
      console.log(response);
      setTotalCount(response.data.generalTotalCount);
      setWinCount(response.data.generalWinCount);
      setWinRate(response.data.generalWinRate);
    } catch (error) {
      console.log("Error occured in getRecord()");
      console.log(error);
    }
  };

  const handleRank = async (rankScore: number) => {
    console.log(rankScore);
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
          generalTotalCount={generalTotalCount}
          generalWinCount={generalWinCount}
          generalWinRate={generalWinRate}
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
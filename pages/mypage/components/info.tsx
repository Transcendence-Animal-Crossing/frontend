import styled from "styled-components";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MatchHistoryFrame from "./matchHistory";
import AchievementFrame from "./achievement";

const InfoContainer = () => {
  return (
    <InfoProfile>
      <MatchHistoryFrame></MatchHistoryFrame>
      <DivisionBar />
      <AchievementFrame></AchievementFrame>
    </InfoProfile>
  );
};

export default InfoContainer;

const InfoProfile = styled.div`
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

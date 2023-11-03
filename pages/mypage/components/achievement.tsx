import styled from "styled-components";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const AchievementContainer = () => {
  return (
    <AchievementFrame>
      <h1>hello</h1>
    </AchievementFrame>
  );
};

export default AchievementContainer;

const AchievementFrame = styled.div`
  margin: 3%;
  width: 100%;
  height: 35%;
  background-color: skyblue;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

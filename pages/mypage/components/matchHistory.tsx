import styled from "styled-components";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const MatchHistoryContainer = () => {
  return (
    <MatchHistoryFrame>
      <h1>hello</h1>
    </MatchHistoryFrame>
  );
};

export default MatchHistoryContainer;

const MatchHistoryFrame = styled.div`
  margin: 3%;
  width: 100%;
  height: 100%;
  background-color: skyblue;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

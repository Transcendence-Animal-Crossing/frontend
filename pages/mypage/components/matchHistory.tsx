import styled from "styled-components";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import home from "../../../public/Icon/home.png";

const MatchHistoryContainer = () => {
  const router = useRouter();

  const handleRouteLobby = async () => {
    router.push("/");
  };

  return (
    <MatchHistoryFrame>
      <MatchHistoryHeader>
        <Mode>
          <ModeButton> 일반 </ModeButton>
          <ModeButton> 랭크 </ModeButton>
        </Mode>
        <Button onClick={handleRouteLobby}>
          <InfoImage src={home} alt="home" />
        </Button>
      </MatchHistoryHeader>
      <MatchHistoryBody />
    </MatchHistoryFrame>
  );
};

export default MatchHistoryContainer;

const MatchHistoryFrame = styled.div`
  margin: 3%;
  width: 100%;
  height: 100%;
  // background-color: skyblue;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MatchHistoryHeader = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Mode = styled.div`
  width: 80%;
  height: 60%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10%;
  gap: 10%;
`;

const ModeButton = styled.button`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.cream};
  color: ${(props) => props.theme.colors.lightgold};
  font-family: "GiantsLight";
  border-radius: 15px;
  border: none;
  cursor: pointer;
  // background-color: ${(props) => props.theme.colors.lightgold};
  // color: ${(props) => props.theme.colors.white};
`;

const Button = styled.div`
  height: 50%;
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
  height: 70%;
  width: auto;
  cursor: pointer;
`;

const MatchHistoryBody = styled.div``;

import styled from "styled-components";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSocket } from "../../utils/SocketProvider";
import Container from "../../components/columnNevLayout";
import Header from "../../components/lobbyHeader";
import JoinRoomModal from "../../components/chat/joinRoomModal";
import NoticeModal from "../../components/noticeModal";

const GameLobby = () => {
  return (
    <Container>
      <GameLobbyFrame>
        <Header
          title="General Game"
          text="일반 게임"
          infoText="일반 게임 설명"
        />
      </GameLobbyFrame>
    </Container>
  );
};

export default GameLobby;

const GameLobbyFrame = styled.div`
  width: 70%;
  height: 70%;
  display: flex;
  flex-direction: column;
`;

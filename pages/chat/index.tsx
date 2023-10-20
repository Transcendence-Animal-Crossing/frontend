import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSocket } from "../../components/SocketProvider";
import Container from "../../components/columnNevLayout";
import Header from "./components/lobbyHeader";

const Chat = () => {
  const { socket } = useSocket();
  const [roomlist, setRoomlist] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (socket) {
      socket.emitWithAck("room-list").then((response) => {
        console.log(response);
        setRoomlist(response.body);
      });

      socket.on("room-list", (response) => {
        console.log(response);
        setRoomlist(response);
      });
    }
  }, [socket]);

  const handleRoomJoin = async (roomId: string) => {
    if (socket) {
      await socket
        .emitWithAck("room-join", {
          roomId: roomId,
          password: "0",
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("room-join : Success", response);
            const responseRoomId = response.body.id;
            router.push(`chat/${responseRoomId}`);
          } else {
            console.log("room-join : Failed", response);
            // Join 실패 모달
          }
        });
    }
  };

  return (
    <Container>
      <Header />
      <RoomListFrame>
        {roomlist.map((room, index) => (
          <Room key={index} onClick={() => handleRoomJoin(room.id)}>
            <RoomTitle> {room.title} </RoomTitle>
            <RoomInfo>
              <RoomInfoText>
                <ColoredText color="brown">방장:</ColoredText>
                <ColoredText color="Emerald">{room.owner.nickName}</ColoredText>
              </RoomInfoText>
              <RoomInfoText>
                <ColoredText color="brown">참여인원:</ColoredText>
                <ColoredText color="orange">{room.headCount}명</ColoredText>
              </RoomInfoText>
              {/* <p>Mode: {room.mode}</p> */}
            </RoomInfo>
          </Room>
        ))}
      </RoomListFrame>
    </Container>
  );
};

export default Chat;

const RoomListFrame = styled.div`
  width: 70%;
  height: 70%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`;

const Room = styled.div`
  width: 100%;
  height: auto;
  background-color: ${(props) => props.theme.colors.ivory};
  border-radius: 10px;
  margin: 1vh;
  padding: 3vh 3vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border: none;
  box-sizing: border-box;
`;

const RoomTitle = styled.div`
  color: ${(props) => props.theme.colors.brown};
  font-family: "BMHANNAPro";
  font-size: 2vw;
`;

const RoomInfo = styled.div`
  min-width: 15%;
  font-size: 1vw;
  display: flex;
  flex-direction: column;
`;

const RoomInfoText = styled.div`
  font-size: 1.1vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ColoredText = styled.p`
  color: ${(props) => props.theme.colors[props.color]};
  font-family: "BMHANNAPro";
`;

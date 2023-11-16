import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../../utils/SocketProvider';
import Container from '../../components/columnNevLayout';
import Header from '../../components/chat/lobbyHeader';
import JoinRoomModal from '../../components/chat/joinRoomModal';
import NoticeModal from '../../components/noticeModal';
import Lock from '../../public/Chat/lock_gold.png';

interface RoomOwnerData {
  id: number;
  nickName: string;
  intraName: string;
  avatar: string;
}

interface RoomListData {
  id: string;
  title: string;
  owner: RoomOwnerData;
  headCount: number;
  mode: string;
}

const ChatLobby = () => {
  const { socket } = useSocket();
  const [roomlist, setRoomlist] = useState<RoomListData[]>([]);
  const [openJoinModal, setOpenJoinModal] = useState<boolean>(false);
  const [isOpenNotice, setOpenNotice] = useState<boolean>(false);
  const [noticeMessage, setNoticeMessage] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (socket) {
      socket.emitWithAck('room-lobby').then((response) => {
        console.log(response);
        setRoomlist(response.body);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      const handleRoomCreate = (response: RoomListData) => {
        setRoomlist((prevRoomList) => [...prevRoomList, response]);
      };

      const handleRoomUpdate = (response: RoomListData) => {
        const targetRoom = roomlist.find((room) => room.id === response.id);
        if (targetRoom) {
          setRoomlist((prevRoomList) => {
            const updatedRoomlist = prevRoomList.map((room) => {
              if (room.id === response.id) {
                return response;
              }
              return room;
            });
            return updatedRoomlist;
          });
        }
      };

      socket.on('room-create', handleRoomCreate);
      socket.on('room-update', handleRoomUpdate);

      return () => {
        socket.off('room-create', handleRoomCreate);
        socket.off('room-update', handleRoomUpdate);
      };
    }
  }, [socket, roomlist]);

  const handleRoomJoin = async (roomId: string) => {
    if (socket) {
      const room = roomlist.find((room) => room.id === roomId);
      if (room?.mode == 'PROTECTED') {
        setJoinRoomId(roomId);
        setOpenJoinModal(true);
      } else {
        await socket
          .emitWithAck('room-join', {
            roomId: roomId,
          })
          .then((response) => {
            if (response.status === 200) {
              console.log('room-join : Success', response);
              const responseRoomId = response.body.id;
              router.push(`chat/${responseRoomId}`);
            } else {
              console.log('room-join : Failed', response);
              setNoticeMessage('채팅방에 입장하실 수 없어요!');
              setOpenNotice(true);
            }
          });
      }
    }
  };

  const handleFailModal = () => {
    setOpenJoinModal(false);
    setNoticeMessage('비밀번호를 틀리셨어요!');
    setOpenNotice(true);
  };

  const handleCloseJoinModal = () => {
    setOpenJoinModal(false);
  };

  const handleCloseNotice = () => {
    setOpenNotice(false);
  };

  return (
    <Container>
      <Header />
      <RoomListFrame>
        {roomlist.map((room, index) => (
          <Room key={index} onClick={() => handleRoomJoin(room.id)}>
            <RoomTitle>
              {room.title}
              <>{room.mode === 'PROTECTED' && <LockImage src={Lock} alt="Lock" />}</>
            </RoomTitle>
            <RoomInfo>
              <RoomInfoText>
                <ColoredText textColor="0">방장:</ColoredText>
                <ColoredText textColor="1">{room.owner.nickName}</ColoredText>
              </RoomInfoText>
              <RoomInfoText>
                <ColoredText textColor="0">참여인원:</ColoredText>
                <ColoredText textColor="2">{room.headCount}명</ColoredText>
              </RoomInfoText>
            </RoomInfo>
          </Room>
        ))}
      </RoomListFrame>
      {openJoinModal && (
        <JoinRoomModal
          handleCloseModal={handleCloseJoinModal}
          handleFailModal={handleFailModal}
          roomId={joinRoomId}
        />
      )}
      {isOpenNotice && (
        <NoticeModal handleCloseModal={handleCloseNotice} noticeMessage={noticeMessage} />
      )}
    </Container>
  );
};

export default ChatLobby;

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
  font-family: 'Giants';
  font-size: 2vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RoomInfo = styled.div`
  min-width: 15%;
  font-size: 1vw;
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

const RoomInfoText = styled.div`
  font-size: 1.1vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ColoredText = styled.p<{ textColor: string }>`
  color: ${(props) => {
    switch (props.textColor) {
      case '1':
        return props.theme.colors.Emerald;
      case '2':
        return props.theme.colors.orange;
      default:
        return props.theme.colors.brown;
    }
  }};
  font-family: 'GiantsLight';
`;

const LockImage = styled(Image)`
  height: 3vh;
  width: auto;
  cursor: pointer;
  margin-left: 1vh;
`;

import styled from 'styled-components';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../../utils/SocketProvider';
import UserListModal from './userListModal';
import users from '../../public/Icon/users.png';
import exit from '../../public/Icon/exit.png';

interface ParticipantData {
  id: number;
  nickName: string;
  intraName: string;
  avatar: string;
  grade: number;
  mute: boolean;
  joinTime: Date;
  adminTime: Date;
}

const Header: React.FC<{ roomTitle: string; roomId: string; userlist: ParticipantData[] }> = ({
  roomTitle,
  roomId,
  userlist,
}) => {
  const { socket } = useSocket();
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [createButtonRect, setCreateButtonRect] = useState<{
    top: number;
    right: number;
    height: number;
  }>({ top: 0, right: 0, height: 0 });
  const CreateButtonRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (CreateButtonRef.current) {
      const buttonRect = CreateButtonRef.current.getBoundingClientRect();
      setCreateButtonRect({
        top: buttonRect.top,
        right: buttonRect.right,
        height: buttonRect.height,
      });
    }
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRouteChatLobby = async () => {
    if (socket) {
      console.log(roomId);
      socket.emit('room-leave', roomId);
    }
    router.push('/chat');
  };

  return (
    <>
      <HeaderFrame>
        <InfoFrame>
          <TitleFrame> {roomTitle} </TitleFrame>
        </InfoFrame>
        <ButtonFrame>
          <Button onClick={handleOpenModal} ref={CreateButtonRef}>
            <InfoImage src={users} alt="users" />
          </Button>
          <Button onClick={handleRouteChatLobby}>
            <InfoImage src={exit} alt="exit" />
          </Button>
        </ButtonFrame>
      </HeaderFrame>
      {isOpenModal && (
        <UserListModal
          handleCloseModal={handleCloseModal}
          roomId={roomId}
          userlist={userlist}
          createButtonRect={createButtonRect}
        />
      )}
    </>
  );
};

export default Header;

const HeaderFrame = styled.div`
  width: 70%;
  height: auto;
  display: flex;
  flex-direction: row;
  margin-bottom: 2vh;
  align-items: center;
  justify-content: space-between;
`;

const InfoFrame = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
`;

const TitleFrame = styled.div`
  background-color: ${(props) => props.theme.colors.gold};
  border-radius: 0 20px 20px 0;
  padding: 1.5vh;
  padding-right: 1.5vw;
  align-items: center;
  color: ${(props) => props.theme.colors.ivory};
  font-family: 'Giants';
  font-size: 2.5vh;
`;

const InfoImage = styled(Image)`
  height: 3vh;
  width: auto;
  cursor: pointer;
`;

const ButtonFrame = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
`;

const Button = styled.div`
  padding: 1vh 3vh;
  background-color: ${(props) => props.theme.colors.beige};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

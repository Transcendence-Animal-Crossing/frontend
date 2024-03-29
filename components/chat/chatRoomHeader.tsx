import styled from 'styled-components';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '@/utils/SocketProvider';
import { useSession } from 'next-auth/react';
import UserListModal from './userListModal';
import UpdateRoomModal from './updateRoomModal';
import InviteUserModal from './inviteUserModal';
import users from '@/public/Icon/users.png';
import exit from '@/public/Icon/exit.png';
import invite from '@/public/Icon/invite.png';
import lock from '@/public/Chat/lock_gold.png';
import setting from '@/public/Icon/setting.png';
import { ParticipantData } from '@/types/ParticipantData';
import { UserData } from '@/types/UserData';

const Header: React.FC<{
  roomTitle: string;
  roomMode: string;
  roomId: string;
  userlist: ParticipantData[];
  banlist: UserData[];
}> = ({ roomTitle, roomMode, roomId, userlist, banlist }) => {
  const { chatSocket } = useSocket();
  const { data: session } = useSession();
  const [isOwner, setIsOwner] = useState(false);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [isOpenSetModal, setOpenSetModal] = useState<boolean>(false);
  const [isOpenInvite, setOpenInvite] = useState<boolean>(false);
  const [createButtonRect, setCreateButtonRect] = useState<{
    top: number;
    right: number;
    height: number;
  }>({ top: 0, right: 0, height: 0 });
  const CreateButtonRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = session?.user.id;
    const user = userlist.find((user) => user.id === userId);
    console.log('user', user);
    if (user && user.grade == 2) {
      setIsOwner(true);
    }
  }, [userlist]);

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

  const handleOpenSetModal = () => {
    setOpenSetModal(true);
  };

  const handleCloseSetModal = () => {
    setOpenSetModal(false);
  };

  const handleOpenInvite = () => {
    setOpenInvite(true);
  };

  const handleCloseInvite = () => {
    setOpenInvite(false);
  };

  const handleRouteChatLobby = async () => {
    if (chatSocket) {
      console.log(roomId);
      chatSocket.emit('room-leave', { roomId: roomId });
    }
    router.push('/chat');
  };

  return (
    <>
      <HeaderFrame>
        <InfoFrame>
          <TitleFrame> {roomTitle} </TitleFrame>
          {roomMode == 'PROTECTED' && <InfoImage src={lock} alt='lock' />}
        </InfoFrame>
        <ButtonFrame>
          {isOwner && (
            <Button onClick={handleOpenSetModal} ref={CreateButtonRef}>
              <InfoImage src={setting} alt='setting' />
            </Button>
          )}
          <Button onClick={handleOpenInvite} ref={CreateButtonRef}>
            <InfoImage src={invite} alt='invite' />
          </Button>
          <Button onClick={handleOpenModal} ref={CreateButtonRef}>
            <InfoImage src={users} alt='users' />
          </Button>
          <Button onClick={handleRouteChatLobby}>
            <InfoImage src={exit} alt='exit' />
          </Button>
        </ButtonFrame>
      </HeaderFrame>
      {isOpenModal && (
        <UserListModal
          handleCloseModal={handleCloseModal}
          roomId={roomId}
          userlist={userlist}
          banlist={banlist}
          createButtonRect={createButtonRect}
        />
      )}
      {isOpenSetModal && (
        <UpdateRoomModal
          handleCloseModal={handleCloseSetModal}
          createButtonRect={createButtonRect}
        />
      )}
      {isOpenInvite && <InviteUserModal handleCloseModal={handleCloseInvite} roomId={roomId} />}
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
  height: 2.5vh;
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

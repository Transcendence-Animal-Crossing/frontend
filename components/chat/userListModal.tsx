import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../../utils/SocketProvider';
import { useSession } from 'next-auth/react';
import exit from '../../public/Icon/exit.png';
import kick from '../../public/Chat/kick.png';
import ban from '../../public/Chat/ban.png';
import mute from '../../public/Chat/mute.png';

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

const userListModal: React.FC<{
  handleCloseModal: () => void;
  roomId: string;
  userlist: ParticipantData[];
  createButtonRect: { top: number; right: number; height: number };
}> = ({ handleCloseModal, roomId, userlist, createButtonRect }) => {
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { socket } = useSocket();
  const { data: session } = useSession();
  const overlayLeft = `${createButtonRect.right - window.innerWidth * 0.2}px`;
  const overlayTop = `${createButtonRect.top + createButtonRect.height * 1.5}px`;

  useEffect(() => {
    const userId = session?.user.user_id;
    const user = userlist.find((user) => user.id === userId);
    if (user && user.grade == 2) {
      setIsOwner(true);
      setIsAdmin(true);
    } else if (user && user.grade == 1) {
      setIsAdmin(true);
    }
  }, [userlist]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleSetUserAvatar = (avatar: string) => {
    const apiUrl = 'http://localhost:8080/';
    return apiUrl + avatar;
  };

  const handleUserKick = (targetId: number) => {
    if (socket) {
      socket.emit('room-kick', {
        roomId: roomId,
        targetId: targetId,
      });
    }
  };

  const handleUserBan = (targetId: number) => {
    if (socket) {
      socket.emit('room-ban', {
        roomId: roomId,
        targetId: targetId,
      });
    }
  };

  return (
    <>
      <Container onClick={handleOverlayClick}>
        <Content overlayTop={overlayTop} overlayLeft={overlayLeft}>
          <Header>
            참여중인 유저목록
            <ExitImage src={exit} alt="exit" onClick={handleOverlayClick} />
          </Header>
          <UsersFrame>
            {userlist.map((user, index) => (
              <UserFrame key={index}>
                <UserImage
                  src={handleSetUserAvatar(user.avatar)}
                  alt="Profle Image"
                  width={100}
                  height={100}
                />
                <Text fontSize="2vh">{user.nickName}</Text>
                <Text fontSize="1.2vh">{user.intraName}</Text>
                {isAdmin && (
                  <AdminFrame>
                    <AdminImage
                      src={kick}
                      alt="kick"
                      onClick={() => {
                        handleUserKick(user.id);
                      }}
                    />
                    <AdminImage
                      src={ban}
                      alt="ban"
                      onClick={() => {
                        handleUserBan(user.id);
                      }}
                    />
                    <AdminImage src={mute} alt="mute" />
                  </AdminFrame>
                )}
                {isOwner && <SetAdmin> Give admin </SetAdmin>}
              </UserFrame>
            ))}
          </UsersFrame>
        </Content>
      </Container>
    </>
  );
};

export default userListModal;

const Container = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div<{ overlayTop: string; overlayLeft: string }>`
  position: fixed;
  top: ${(props) => props.overlayTop};
  left: ${(props) => props.overlayLeft};
  min-width: 20vw;
  height: auto;
  background-color: ${(props) => props.theme.colors.craem};
  padding: 3vh 2vh;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vh;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: ${(props) => props.theme.colors.brown};
  font-family: 'GiantsLight';
  font-size: 2vh;
  padding: 0 1vw;
  box-sizing: border-box;
`;

const ExitImage = styled(Image)`
  width: 1.5vw;
  height: auto;
  cursor: pointer;
`;

const UsersFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  gap: 1vw;
`;

const UserFrame = styled.div`
  width: auto;
  min-width: 8vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1vh;
`;

const UserImage = styled(Image)`
  width: 5vw;
  height: auto;
  border-radius: 50px;
`;

const Text = styled.div<{ fontSize: string }>`
  color: ${(props) => props.theme.colors.brown};
  font-family: 'GiantsLight';
  font-size: ${(props) => props.fontSize};
`;

const AdminFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5vw;
`;

const AdminImage = styled(Image)`
  width: 1.5vw;
  height: auto;
  cursor: pointer;
`;

const SetAdmin = styled.div`
  color: ${(props) => props.theme.colors.ivory};
  font-family: 'GiantsLight';
  font-size: 0.7vw;
  background-color: ${(props) => props.theme.colors.brown05};
  border-radius: 5px;
  padding: 0.3vw 0.7vw;
  cursor: pointer;
`;

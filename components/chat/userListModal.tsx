import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../../utils/SocketProvider';
import { useSession } from 'next-auth/react';
import exit from '../../public/Icon/exit.png';
import kick from '../../public/Chat/kick.png';
import ban from '../../public/Chat/ban.png';
import mute from '../../public/Chat/mute.png';
import unmute from '../../public/Chat/unmute.png';
import slider from '../../public/Chat/slider.png';
import users from '../../public/Icon/users.png';
import crown from '../../public/Icon/crown.png';

interface ParticipantData {
  id: number;
  nickName: string;
  intraName: string;
  avatar: string;
  grade: number;
  mute: boolean;
  joinTime: Date;
  adminTime: Date;
  status: number;
}

interface UserData {
  id: number;
  nickName: string;
  intraName: string;
  avatar: string;
}

const userListModal: React.FC<{
  handleCloseModal: () => void;
  roomId: string;
  userlist: ParticipantData[];
  banlist: UserData[];
  createButtonRect: { top: number; right: number; height: number };
}> = ({ handleCloseModal, roomId, userlist, banlist, createButtonRect }) => {
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showBan, setShowBan] = useState(false);
  const [headerText, setHeaderText] = useState('참여중인 유저목록');
  const { chatSocket } = useSocket();
  const { data: session } = useSession();
  const overlayLeft = `${createButtonRect.right - window.innerWidth * 0.2}px`;
  const overlayTop = `${createButtonRect.top + createButtonRect.height * 1.5}px`;

  useEffect(() => {
    const userId = session?.user.id;
    const user = userlist.find((user) => user.id === userId);
    if (user && user.grade == 2) {
      setIsOwner(true);
      setIsAdmin(true);
    } else if (user && user.grade == 1) {
      setIsOwner(false);
      setIsAdmin(true);
    } else {
      setIsOwner(false);
      setIsAdmin(false);
    }
  }, [userlist]);

  useEffect(() => {
    console.log(userlist);
  });

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleSetUserAvatar = (avatar: string) => {
    const apiUrl = 'http://localhost:8080/';
    return apiUrl + avatar;
  };

  const handlShowBanList = () => {
    if (showBan) {
      setShowBan(false);
      setHeaderText('참여중인 유저목록');
    } else {
      setShowBan(true);
      setHeaderText('밴 유저목록');
    }
  };

  const handleUserKick = (targetId: number) => {
    if (chatSocket) {
      chatSocket.emit('room-kick', {
        roomId: roomId,
        targetId: targetId,
      });
    }
  };

  const handleUserBan = (targetId: number) => {
    if (chatSocket) {
      chatSocket.emit('room-ban', {
        roomId: roomId,
        targetId: targetId,
      });
    }
  };

  const handleUserUnban = (targetId: number) => {
    if (chatSocket) {
      chatSocket.emit('room-unban', {
        roomId: roomId,
        targetId: targetId,
      });
    }
  };

  const handleUserMute = (targetId: number) => {
    if (chatSocket) {
      chatSocket.emit('room-mute', {
        roomId: roomId,
        targetId: targetId,
      });
    }
  };

  const handleUserUnmute = (targetId: number) => {
    if (chatSocket) {
      chatSocket.emit('room-unmute', {
        roomId: roomId,
        targetId: targetId,
      });
    }
  };

  const handleUserAdmin = (targetId: number) => {
    const targetUser = userlist.find((user) => user.id === targetId);
    if (chatSocket && targetUser) {
      if (targetUser.grade == 1) {
        chatSocket.emit('remove-admin', {
          roomId: roomId,
          targetId: targetId,
        });
      } else {
        chatSocket.emit('add-admin', {
          roomId: roomId,
          targetId: targetId,
        });
      }
    }
  };

  const handleUserAdminText = (targetId: number) => {
    const targetUser = userlist.find((user) => user.id === targetId);
    if (targetUser) {
      if (targetUser.grade == 1) {
        return 'Remove Admin';
      } else {
        return 'Add Admin';
      }
    }
  };

  return (
    <>
      <Container onClick={handleOverlayClick}>
        <Content overlayTop={overlayTop} overlayLeft={overlayLeft}>
          <Header>
            {headerText}
            <HeaderImageFrame>
              {isAdmin && !showBan && (
                <HeaderImage src={slider} alt='slider' onClick={handlShowBanList} />
              )}
              {isAdmin && showBan && (
                <HeaderImage src={users} alt='users' onClick={handlShowBanList} />
              )}
              <HeaderImage src={exit} alt='exit' onClick={handleOverlayClick} />
            </HeaderImageFrame>
          </Header>
          {showBan && (
            <UsersFrame userCount={banlist.length}>
              {banlist.map((user, index) => (
                <UserFrame key={index}>
                  <UserImage
                    src={handleSetUserAvatar(user.avatar)}
                    alt='Profle Image'
                    width={100}
                    height={100}
                  />
                  <Text fontSize='2vh'>{user.nickName}</Text>
                  <Text fontSize='1.2vh'>{user.intraName}</Text>
                  <SetAdmin
                    onClick={() => {
                      handleUserUnban(user.id);
                    }}
                  >
                    Un Ban
                  </SetAdmin>
                </UserFrame>
              ))}
            </UsersFrame>
          )}
          {!showBan && (
            <UsersFrame userCount={userlist.length}>
              {userlist
                .filter((user) => user.status === 1)
                .map((user, index) => (
                  <UserFrame key={index}>
                    <UserImage
                      src={handleSetUserAvatar(user.avatar)}
                      alt='Profle Image'
                      width={100}
                      height={100}
                    />
                    <OwnerFrame>
                      <Text fontSize='2vh'>{user.nickName}</Text>
                      {user.grade === 2 && <OwnerImage src={crown} alt='crown' />}
                    </OwnerFrame>
                    <Text fontSize='1.2vh'>{user.intraName}</Text>
                    {isAdmin && (
                      <AdminFrame>
                        <AdminImage
                          src={kick}
                          alt='kick'
                          onClick={() => {
                            handleUserKick(user.id);
                          }}
                        />
                        <AdminImage
                          src={ban}
                          alt='ban'
                          onClick={() => {
                            handleUserBan(user.id);
                          }}
                        />
                        {user.mute && (
                          <AdminImage
                            src={unmute}
                            alt='unmute'
                            onClick={() => {
                              handleUserUnmute(user.id);
                            }}
                          />
                        )}
                        {!user.mute && (
                          <AdminImage
                            src={mute}
                            alt='mute'
                            onClick={() => {
                              handleUserMute(user.id);
                            }}
                          />
                        )}
                      </AdminFrame>
                    )}
                    {isOwner && (
                      <SetAdmin
                        onClick={() => {
                          handleUserAdmin(user.id);
                        }}
                      >
                        {handleUserAdminText(user.id)}
                      </SetAdmin>
                    )}
                  </UserFrame>
                ))}
            </UsersFrame>
          )}
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
  background-color: ${(props) => props.theme.colors.cream};
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

const HeaderImageFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 1vw;
`;

const HeaderImage = styled(Image)`
  width: 1.5vw;
  height: auto;
  cursor: pointer;
`;

const UsersFrame = styled.div<{ userCount: number }>`
  min-width: 26vw;
  max-width: 30vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => (props.userCount >= 4 ? 'flex-start' : 'space-around')};
  gap: 1vw;
  overflow: auto;
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

const OwnerFrame = styled.div`
  width: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.3vw;
`;

const OwnerImage = styled(Image)`
  width: 1.2vw;
  height: auto;
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

import styled from 'styled-components';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useSocket } from '@/utils/SocketProvider';
import exit from '@/public/Icon/exit.png';
import UserInfo from '@/components/userInfo';
import { handleSetUserAvatar } from '@/utils/avatarUtils';
import { FriendData } from '@/types/FriendData';

const InviteUserModal: React.FC<{
  handleCloseModal: () => void;
  roomId: string;
}> = ({ handleCloseModal, roomId }) => {
  const { chatSocket } = useSocket();
  const [friendsList, setFriendsList] = useState<FriendData[]>([]);
  const [chatSocketFlag, setSocketFlag] = useState<boolean>(true);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (chatSocket && chatSocketFlag) {
      chatSocket.emitWithAck('friend-list').then((response) => {
        if (response.status === 200) {
          const sortedFriendsList = response.body.sort((a: FriendData, b: FriendData) => {
            const statusOrder: Record<string, number> = {
              ONLINE: 0,
              IN_GAME: 1,
              WATCHING: 1,
              OFFLINE: 2,
            };
            const statusComparison = statusOrder[a.status] - statusOrder[b.status];
            if (statusComparison !== 0) {
              return statusComparison;
            }
            return 0;
          });
          setFriendsList(sortedFriendsList);
        }
      });
    }
  }, []);

  const handleInviteUser = (targetId: number) => {
    if (chatSocket) {
      chatSocket.emit('room-invite', {
        roomId: roomId,
        targetId: targetId,
      });
    }
  };

  const handlerTranslation = (status: string) => {
    if (status === 'OFFLINE') return '오프라인';
    if (status === 'ONLINE') return '온라인';
    if (status === 'IN_GAME') return '게임중';
    if (status === 'WATCHING') return '관전중';
  };

  return (
    <>
      <Container onClick={handleOverlayClick}>
        <ContentFrame onClick={handleOverlayClick}>
          <Content>
            <Header>
              유저 초대
              <HeaderImageFrame>
                <HeaderImage src={exit} alt='exit' onClick={handleOverlayClick} />
              </HeaderImageFrame>
            </Header>
            <UserList>
              {friendsList.map((friend, index) => (
                <UserFrame>
                  <UserInfo
                    key={index}
                    nickName={friend.nickName}
                    intraName={friend.intraName}
                    avatar={handleSetUserAvatar(friend.avatar)}
                    width={40}
                    height={5}
                  />
                  <Status textColor={friend.status}>
                    <p>⦁</p>
                    <p>&nbsp;{handlerTranslation(friend.status)}</p>
                  </Status>
                  <InviteButton
                    onClick={() => {
                      handleInviteUser(friend.id);
                    }}
                  >
                    {' '}
                    초대{' '}
                  </InviteButton>
                </UserFrame>
              ))}
            </UserList>
          </Content>
        </ContentFrame>
      </Container>
    </>
  );
};

export default InviteUserModal;

const Container = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ContentFrame = styled.div`
  width: 80%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  position: fixed;
  width: 30%;
  height: 50%;
  background-color: ${(props) => props.theme.colors.cream};
  padding: 2vh;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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
  margin-bottom: 3%;
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

const UserList = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto;
  color: ${(props) => props.theme.colors.brown};
`;

const UserFrame = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 2% 5%;
  box-sizing: border-box;
`;

const Status = styled.div<{ textColor: string }>`
  width: 24%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.8vw;
  font-family: 'GiantsLight';
  color: ${(props) => {
    switch (props.textColor) {
      case 'OFFLINE':
        return props.theme.colors.gray;
      case 'ONLINE':
        return props.theme.colors.green;
      case 'IN_GAME':
        return props.theme.colors.red;
      case 'WATCHING':
        return props.theme.colors.purple;
      default:
        return props.theme.colors.brown;
    }
  }};
`;

const InviteButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.8vw;
  font-family: 'GiantsLight';
  color: ${(props) => props.theme.colors.brown};
  padding: 2%;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.Emerald};
  }
`;

import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../../utils/SocketProvider';
import { useSession } from 'next-auth/react';
import axiosInstance from '../../utils/axiosInstance';
import exit from '../../public/Icon/exit.png';
import DMContainer from './renderDM';
import InputDmContainer from './inputDM';

interface DirectMessageDto {
  id: number;
  senderId: number;
  date: Date;
  text: string;
}

const DmModal: React.FC<{
  handleCloseModal: () => void;
  targetId: number;
}> = ({ handleCloseModal, targetId }) => {
  const { socket } = useSocket();
  const { data: session } = useSession();
  const [nickName, setNickName] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [messages, setMessages] = useState<DirectMessageDto[]>([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    getUserDetail();
  }, []);

  const sendMessage = () => {
    if (socket && messageText) {
      socket
        .emitWithAck('dm', {
          text: messageText,
          receiverId: targetId,
          senderId: session?.user.id,
        })
        .then((response: DirectMessageDto) => {
          console.log(response);
          setMessageText('');
        });
    }
  };

  const getUserDetail = async () => {
    await axiosInstance
      .get('/users/detail', {
        params: { id: targetId },
      })
      .then((response) => {
        const apiUrl = 'http://localhost:8080/';
        setNickName(response.data.nickName);
        setAvatar(apiUrl + response.data.avatar);
      });
  };

  const handleMessageTextChange = (newMessage: string) => {
    setMessageText(newMessage);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <>
      <Container>
        <Content>
          <Header>
            <UserInfo>
              <UserImage src={avatar} alt="profile" width={100} height={100} />
              {nickName}
            </UserInfo>
            <HeaderImage src={exit} alt="exit" onClick={handleOverlayClick} />
          </Header>
          <DmFrame>
            <DMContainer messages={messages} />
            <InputDmContainer
              messageText={messageText}
              setMessageText={handleMessageTextChange}
              handleKeyPress={handleKeyPress}
              sendMessage={sendMessage}
            />
          </DmFrame>
        </Content>
      </Container>
    </>
  );
};

export default DmModal;

const Container = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  position: fixed;
  bottom: 0;
  right: 20vw;
  width: 20%;
  height: 50%;
  background-color: ${(props) => props.theme.colors.cream};
  padding: 2vh 2vh 3vh 2vh;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2vh;
`;

const Header = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: ${(props) => props.theme.colors.brown};
  font-family: 'GiantsLight';
  font-size: 1.8vh;
  box-sizing: border-box;
`;

const HeaderImage = styled(Image)`
  width: 1.5vw;
  height: auto;
  cursor: pointer;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5vw;
`;

const UserImage = styled(Image)`
  width: 2vw;
  height: auto;
  cursor: pointer;
  border-radius: 20px;
`;

const DmFrame = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 2vh;
`;

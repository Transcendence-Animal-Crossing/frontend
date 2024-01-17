import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/utils/SocketProvider';
import { useEventEmitter } from '@/utils/EventEmitterProvider';
import { useSession } from 'next-auth/react';
import axiosInstance from '@/utils/axiosInstance';
import exit from '@/public/Icon/exit.png';
import DMContainer from './renderDM';
import InputDmContainer from './inputDM';
import { handleSetUserAvatar } from '@/utils/avatarUtils';
import { DmData } from '@/types/DmData';

const DmModal: React.FC<{
  handleCloseModal: () => void;
  targetId: number;
  setOpenNotice: (value: boolean) => void;
}> = ({ handleCloseModal, targetId, setOpenNotice }) => {
  const { chatSocket } = useSocket();
  const { data: session } = useSession();
  const emitter = useEventEmitter();
  const [nickName, setNickName] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [messages, setMessages] = useState<DmData[]>([]);
  const [messageText, setMessageText] = useState('');
  const [cursorId, setCursorId] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    getUserDetail();
    emitter.emit('openDM', targetId);
  }, []);

  useEffect(() => {
    const handleUnReadMessages = (unReadMessages: DmData[]) => {
      console.log('unReadMessages', unReadMessages);
      if (unReadMessages.length >= 20) {
        const sortedMessages = unReadMessages.sort((a, b) => b.id - a.id);
        setMessages(sortedMessages);
        const smallestId = Math.min(...unReadMessages.map((message: DmData) => message.id));
        setCursorId(smallestId);
      } else if (unReadMessages.length >= 1) {
        const smallestId = Math.min(...unReadMessages.map((message: DmData) => message.id));
        handleDmLoadConcat(smallestId);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, ...unReadMessages].sort((a, b) => b.id - a.id);
          return updatedMessages;
        });
      } else {
        handleDmLoadFirst();
      }
    };

    const handleNewMessage = (response: DmData) => {
      setMessages((prevMessages) => [response, ...prevMessages]);
    };

    emitter.on('unReadMessages', handleUnReadMessages);
    emitter.on('newMessage', handleNewMessage);

    return () => {
      emitter.removeListener('unReadMessages', handleUnReadMessages);
      emitter.removeListener('newMessage', handleNewMessage);
    };
  }, [emitter]);

  const handleDmLoad = () => {
    setTimeout(async () => {
      if (chatSocket) {
        await chatSocket
          .emitWithAck('dm-load', {
            targetId: targetId,
            cursorId: cursorId,
          })
          .then((response) => {
            const sortedMessages = response.body.sort((a: DmData, b: DmData) => b.id - a.id);
            setMessages((prevMessages) => {
              const updatedMessages = prevMessages.concat(sortedMessages);
              return updatedMessages;
            });
            if (response.body.length !== 0) {
              const smallestId = Math.min(...response.body.map((message: DmData) => message.id));
              setCursorId(smallestId);
              setHasMore(true);
            } else {
              setHasMore(false);
            }
          })
          .catch((error) => {
            console.log('handleDmLoad error', error);
          });
      }
    }, 500);
  };

  const handleDmLoadFirst = () => {
    if (chatSocket) {
      chatSocket
        .emitWithAck('dm-load', {
          targetId: targetId,
        })
        .then((response) => {
          const sortedMessages = response.body.sort((a: DmData, b: DmData) => b.id - a.id);
          setMessages(sortedMessages);
          if (response.body.length !== 0) {
            const smallestId = Math.min(...response.body.map((message: DmData) => message.id));
            setCursorId(smallestId);
            setHasMore(true);
          } else {
            setHasMore(false);
          }
        });
    }
  };

  const handleDmLoadConcat = (smallestId: number) => {
    if (chatSocket) {
      chatSocket
        .emitWithAck('dm-load', {
          targetId: targetId,
          cursorId: smallestId,
        })
        .then((response) => {
          const sortedMessages = response.body.sort((a: DmData, b: DmData) => b.id - a.id);
          setMessages((prevMessages) => {
            const updatedMessages = prevMessages.concat(sortedMessages);
            return updatedMessages;
          });
          if (response.body.length !== 0) {
            const smallestId = Math.min(...response.body.map((message: DmData) => message.id));
            setCursorId(smallestId);
            setHasMore(true);
          } else {
            setHasMore(false);
          }
        })
        .catch((error) => {
          console.log('handleDmLoad error', error);
        });
    }
  };

  const sendMessage = () => {
    if (chatSocket && messageText) {
      chatSocket
        .emitWithAck('dm', {
          text: messageText,
          receiverId: targetId,
          senderId: session?.user.id,
        })
        .then((response) => {
          if (response.status == 200) {
            console.log('dm responses', response);
            setMessages((prevMessages) => [response.body, ...prevMessages]);
            setMessageText('');
          } else {
            console.log('dm error', response);
            setOpenNotice(true);
          }
        });
    }
  };

  const getUserDetail = async () => {
    await axiosInstance
      .get('/users/detail', {
        params: { id: targetId },
      })
      .then((response) => {
        setNickName(response.data.nickName);
        setAvatar(handleSetUserAvatar(response.data.avatar));

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
      emitter.emit('closeDM');
      handleCloseModal();
    }
  };

  return (
    <>
      <Container>
        <Content>
          <Header>
            <UserInfo>
              <UserImage src={avatar} alt='profile' width={100} height={100} />
              {nickName}
            </UserInfo>
            <HeaderImage src={exit} alt='exit' onClick={handleOverlayClick} />
          </Header>
          <DmFrame>
            <DMContainer messages={messages} hasMore={hasMore} handleDmLoad={handleDmLoad} />
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

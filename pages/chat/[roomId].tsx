import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../../utils/SocketProvider';
import { useSession } from 'next-auth/react';
import Container from '../../components/columnNevLayout';
import Header from './components/chatRoomHeader';
import MessageContainer from './components/renderMessage';
import InputContainer from './components/inputMessage';

const Chat = () => {
  const { socket } = useSocket();
  const [userlist, setUserlist] = useState([]);
  const [roomTitle, setRoomTitle] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const { roomId } = router.query;

  useEffect(() => {
    if (socket) {
      console.log('Room ID:', roomId);

      if (!roomTitle) {
        if (socket) {
          console.log('roomId:', roomId);
          socket
            .emitWithAck('room-detail', {
              roomId: roomId,
            })
            .then((response) => {
              if (response.status === 200) {
                console.log(response);
                setUserlist(response.body);
                setRoomTitle(response.body.title);
              } else {
                console.log('room-detail : Failed', response);
              }
            });
        }
      }

      const handleRoomMessage = (response) => {
        const text = response.text;
        console.log('response.text : ' + text);
        setMessages((prevMessages) => [...prevMessages, response]);
      };
      socket.on('room-message', handleRoomMessage);

      return () => {
        socket.off('room-message', handleRoomMessage);
      };
    } else {
      router.push('http://localhost:3000/chat/');
    }
  }, [socket]);

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (socket && messageText) {
      socket.emit('room-message', {
        text: messageText,
        roomId,
        senderId: session?.user.user_id,
      });
      setMessageText('');
    }
  };

  const handleMessageTextChange = (newMessage: string) => {
    setMessageText(newMessage);
  };

  return (
    <Container>
      <Header roomTitle={roomTitle} />
      <ChatListFrame>
        <MessageContainer messages={messages} />
        <InputContainer
          messageText={messageText}
          setMessageText={handleMessageTextChange}
          handleKeyPress={handleKeyPress}
          sendMessage={sendMessage}
        />
      </ChatListFrame>
    </Container>
  );
};

export default Chat;

const ChatListFrame = styled.div`
  width: 70%;
  height: 70%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

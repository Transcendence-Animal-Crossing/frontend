import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../../utils/SocketProvider';
import { useSession } from 'next-auth/react';
import Container from '../../components/columnNevLayout';
import Header from './components/chatRoomHeader';
import send from '../../public/Chat/send.png';

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
        setMessages((prevMessages) => [...prevMessages, text]);
      };
      socket.on('room-message', handleRoomMessage);

      return () => {
        socket.off('room-message', handleRoomMessage);
      };
    } else {
      router.push('http://localhost:3000/chat/');
    }
  }, [socket]);

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

  return (
    <Container>
      <Header roomTitle={roomTitle} />
      <ChatListFrame>
        <MessageListFrame>
          {messages.map((message, index) => (
            <Message key={index}>{message}</Message>
          ))}
        </MessageListFrame>
        <InputFrame>
          <Input
            type="text"
            placeholder="메세지를 입력하세요"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <ButtonFrame onClick={sendMessage}>
            <ButtonImage src={send} alt="send" />
          </ButtonFrame>
        </InputFrame>
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

const MessageListFrame = styled.div`
  width: 70%;
  height: auto;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow-x: hidden;
`;

const Message = styled.div`
  background-color: ${(props) => props.theme.colors.ivory};
  color: ${(props) => props.theme.colors.brown};
  font-family: 'GiantsLight';
  font-size: 2vh;
  border-radius: 10px;
  padding: 2%;
  margin: 2% 0;
  width: 80%;
`;

const InputFrame = styled.div`
  width: 90%;
  height: auto;
  background-color: ${(props) => props.theme.colors.ivory};
  border-radius: 10px;
  padding: 2%;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Input = styled.input.attrs({ required: true })`
  width: 100%;
  height: auto;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.brown};
  font-family: 'BMHANNAAir';
  font-size: 2vh;
  &:focus {
    outline: none;
  }
`;

const ButtonFrame = styled.div`
  width: 3vw;
  height: 3.5vh;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonImage = styled(Image)`
  height: 3vh;
  width: auto;
  cursor: pointer;
`;

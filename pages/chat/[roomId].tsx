import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../../utils/SocketProvider';
import { useSession } from 'next-auth/react';
import Container from '../../components/columnNevLayout';
import Header from '../../components/chat/chatRoomHeader';
import MessageContainer from '../../components/chat/renderMessage';
import InputContainer from '../../components/chat/inputMessage';

interface RoomMessageDto {
  text: string;
  roomId: string;
  senderId: number;
}

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

const Chat = () => {
  const { socket } = useSocket();
  const [userlist, setUserlist] = useState<ParticipantData[]>([]);
  const [roomTitle, setRoomTitle] = useState('');
  const [messages, setMessages] = useState<RoomMessageDto[]>([]);
  const [messageText, setMessageText] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const { roomId } = router.query as { roomId: string };

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
                setUserlist(response.body.participants);
                setRoomTitle(response.body.title);
              } else {
                console.log('room-detail : Failed', response);
              }
            });
        }
      }

      const handleRoomMessage = (response: RoomMessageDto) => {
        const text = response.text;
        console.log('response.text : ' + text);
        setMessages((prevMessages) => [...prevMessages, response]);
      };

      const handleRoomJoin = (response: ParticipantData) => {
        console.log(response);
        setUserlist((prevMessages) => [...prevMessages, response]);
      };

      socket.on('room-message', handleRoomMessage);
      socket.on('room-join', handleRoomJoin);

      return () => {
        socket.off('room-message', handleRoomMessage);
        socket.off('room-join', handleRoomJoin);
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
      <Header roomTitle={roomTitle} roomId={roomId} userlist={userlist} />
      <ChatListFrame>
        <MessageContainer messages={messages} userlist={userlist} />
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

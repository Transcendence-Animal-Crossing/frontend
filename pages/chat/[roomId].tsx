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

interface UserData {
  id: number;
  nickName: string;
  intraName: string;
  avatar: string;
}

interface ActionRoomData {
  roomId: string;
  targetId: number;
}

const Chat = () => {
  const { socket } = useSocket();
  const [userlist, setUserlist] = useState<ParticipantData[]>([]);
  const [banlist, setBanlist] = useState<UserData[]>([]);
  const [roomTitle, setRoomTitle] = useState('');
  const [messages, setMessages] = useState<RoomMessageDto[]>([]);
  const [messageText, setMessageText] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const { roomId } = router.query as { roomId: string };

  useEffect(() => {
    if (socket) {
      if (!roomTitle) {
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

      const handleRoomMessage = (response: RoomMessageDto) => {
        const text = response.text;
        console.log('response.text : ' + text);
        setMessages((prevMessages) => [...prevMessages, response]);
      };

      const handleRoomJoin = (response: ParticipantData) => {
        console.log(response);
        setUserlist((prevMessages) => [...prevMessages, response]);
      };

      const handleRoomKick = (response: ActionRoomData) => {
        const { targetId } = response;
        const userId = session?.user.user_id;
        if (targetId == userId) {
          router.push('http://localhost:3000/chat/');
        }
        setUserlist((prevUserlist) => prevUserlist.filter((user) => user.id !== targetId));
      };

      const handleRoomBan = (response: ActionRoomData) => {
        const { targetId } = response;
        console.log(targetId);
        console.log(userlist);
        const userId = session?.user.user_id;
        const targetUser = userlist.find((user) => user.id === targetId);
        console.log(targetUser);
        if (targetId == userId) {
          router.push('http://localhost:3000/chat/');
        }
        if (targetUser) {
          setUserlist((prevUserlist) => prevUserlist.filter((user) => user.id !== targetId));
          const banUserData: UserData = {
            id: targetUser.id,
            nickName: targetUser.nickName,
            intraName: targetUser.intraName,
            avatar: targetUser.avatar,
          };
          setBanlist((prevMessages) => [...prevMessages, banUserData]);
        }
      };

      socket.on('room-message', handleRoomMessage);
      socket.on('room-join', handleRoomJoin);
      socket.on('room-kick', handleRoomKick);
      socket.on('room-ban', handleRoomBan);

      return () => {
        socket.off('room-message', handleRoomMessage);
        socket.off('room-join', handleRoomJoin);
        socket.off('room-kick', handleRoomKick);
        socket.off('room-ban', handleRoomBan);
      };
    } else {
      router.push('http://localhost:3000/chat/');
    }
  }, [socket, userlist, banlist, roomTitle, roomId, router]);

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

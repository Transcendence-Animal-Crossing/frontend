import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

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

const MessageContainer: React.FC<{ messages: RoomMessageDto[]; userlist: ParticipantData[] }> = ({
  messages,
  userlist,
}) => {
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFindUser = (userId: number) => {
    if (userId == session?.user.user_id) {
      return false;
    }

    const user = userlist.find((user) => user.id === userId);
    if (user) {
      return true;
    }
  };

  const handleUserNick = (userId: number) => {
    const user = userlist.find((user) => user.id === userId);
    if (user) {
      return user.nickName;
    }
  };

  const handleSetUserAvatar = (userId: number) => {
    const user = userlist.find((user) => user.id === userId);
    if (user) {
      const apiUrl = 'http://localhost:8080/';
      return apiUrl + user.avatar;
    } else {
      return 'http://localhost:8080/original/profile2.png';
    }
  };

  return (
    <MessageListFrame ref={messageListRef}>
      {messages.map((message, index) => (
        <Frame key={index}>
          {handleFindUser(message.senderId) && (
            <UserFrame senderId={message.senderId} currentUser={session?.user.user_id}>
              <UserImage
                src={handleSetUserAvatar(message.senderId)}
                alt="Profle Image"
                width={100}
                height={100}
              />
              {handleUserNick(message.senderId)}
            </UserFrame>
          )}

          <MessageFrame senderId={message.senderId} currentUser={session?.user.user_id}>
            <Message key={index} senderId={message.senderId} currentUser={session?.user.user_id}>
              {message.text}
            </Message>
          </MessageFrame>
        </Frame>
      ))}
    </MessageListFrame>
  );
};

export default MessageContainer;

const MessageListFrame = styled.div`
  width: 90%;
  height: auto;
  padding: 2%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
`;

const Frame = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  margin: 1% 0;
`;

const MessageFrame = styled.div<{ senderId: number; currentUser?: number }>`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: ${(props) => (props.senderId === props.currentUser ? 'row-reverse' : 'row')};
  align-items: center;
  padding: 0 1vw;
  box-sizing: border-box;
`;

const Message = styled.div<{ senderId: number; currentUser?: number }>`
  width: auto;
  max-width: 50%;
  word-wrap: break-word;
  height: auto;
  background-color: ${(props) =>
    props.senderId === props.currentUser ? props.theme.colors.brown : props.theme.colors.ivory};
  color: ${(props) =>
    props.senderId === props.currentUser ? props.theme.colors.ivory : props.theme.colors.brown};
  font-family: 'GiantsLight';
  font-size: 2vh;
  border-radius: 10px;
  padding: 2%;
`;

const UserFrame = styled.div<{ senderId: number; currentUser?: number }>`
  width: auto;
  display: flex;
  flex-direction: ${(props) => (props.senderId === props.currentUser ? 'row-reverse' : 'row')};
  color: ${(props) => props.theme.colors.brown};
  font-family: 'GiantsLight';
  font-size: 2vh;
  margin-bottom: 1%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5vw;
`;

const UserImage = styled(Image)`
  width: 2vw;
  height: 2vw;
  border-radius: 20px;
`;

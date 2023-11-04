import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

const MessageContainer: React.FC<{ messages: array; userlist: array }> = ({
  messages,
  userlist,
}) => {
  const { data: session } = useSession();

  useEffect(() => {
    console.log(userlist);
  }, [userlist]);

  const handleFindUser = (userId: string) => {
    if (userId == session?.user.user_id) {
      return false;
    }

    const user = userlist.find((user) => user.id === userId);
    if (user) {
      return true;
    }
  };

  const handleUserNick = (userId: string) => {
    const user = userlist.find((user) => user.id === userId);
    if (user) {
      return user.nickName;
    }
  };

  const handleUserAvatar = (userId: string) => {
    const user = userlist.find((user) => user.id === userId);
    if (user) {
      return user.avatar;
    }
  };

  return (
    <MessageListFrame>
      {messages.map((message, index) => (
        <Frame key={message.id}>
          {handleFindUser(message.senderId) && (
            <UserFrame senderId={message.senderId} currentUser={session?.user.user_id}>
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
  overflow-x: hidden;
`;

const Frame = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  margin: 1% 0;
`;

const MessageFrame = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: ${(props) => (props.senderId === props.currentUser ? 'row-reverse' : 'row')};
  align-items: center;
`;

const Message = styled.div`
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

const UserFrame = styled.div`
  width: auto;
  display: flex;
  flex-direction: ${(props) => (props.senderId === props.currentUser ? 'row-reverse' : 'row')};
  color: ${(props) => props.theme.colors.brown};
  font-family: 'GiantsLight';
  font-size: 2vh;
  margin-bottom: 1%;
`;

import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect, useRef } from 'react';

interface DirectMessageDto {
  id: number;
  senderId: number;
  date: Date;
  text: string;
}

const DMContainer: React.FC<{ messages: DirectMessageDto[] }> = ({ messages }) => {
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <MessageListFrame ref={messageListRef}>
      {messages.map((message, index) => (
        <Frame key={index}>
          <MessageFrame senderId={message.senderId} currentUser={session?.user.id}>
            <Message key={index} senderId={message.senderId} currentUser={session?.user.id}>
              {message.text}
            </Message>
          </MessageFrame>
        </Frame>
      ))}
    </MessageListFrame>
  );
};

export default DMContainer;

const MessageListFrame = styled.div`
  width: 100%;
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
  justify-content: ${(props) => (props.senderId === 0 ? 'center' : 'flex-start')};
  align-items: center;
  box-sizing: border-box;
`;

const Message = styled.div<{ senderId: number; currentUser?: number }>`
  width: auto;
  max-width: 50%;
  word-wrap: break-word;
  height: auto;
  background-color: ${(props) =>
    props.senderId === props.currentUser ? props.theme.colors.brown08 : props.theme.colors.ivory};
  color: ${(props) =>
    props.senderId === props.currentUser ? props.theme.colors.ivory : props.theme.colors.brown};
  font-family: 'GiantsLight';
  font-size: 1.5vh;
  border-radius: 10px;
  padding: 3%;
`;

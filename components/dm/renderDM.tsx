import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DmData } from '@/types/DmData';

const DMContainer: React.FC<{
  messages: DmData[];
  hasMore: boolean;
  handleDmLoad: () => void;
}> = ({ messages, hasMore, handleDmLoad }) => {
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <MessageListFrame ref={messageListRef}>
      <InfiniteScroll
        dataLength={messages.length}
        style={{ display: 'flex', flexDirection: 'column-reverse' }}
        next={handleDmLoad}
        hasMore={hasMore}
        loader={<div className='loader'>Loading...</div>}
        height={'100%'}
        inverse={true}
      >
        {messages.map((message, index) => (
          <Frame key={index}>
            <MessageFrame senderId={message.senderId} currentUser={session?.user.id}>
              <Message key={index} senderId={message.senderId} currentUser={session?.user.id}>
                {message.text}
              </Message>
            </MessageFrame>
          </Frame>
        ))}
      </InfiniteScroll>
    </MessageListFrame>
  );
};

export default DMContainer;

const MessageListFrame = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  .infinite-scroll-component__outerdiv {
    height: 100%;
    width: 100%;
  }
  .loader {
    color: ${(props) => props.theme.colors.brown};
    font-family: 'GiantsLight';
    font-size: small;
    display: flex;
    align-items: center;
    justify-content: center;
  }
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
  justify-content: flex-start;
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

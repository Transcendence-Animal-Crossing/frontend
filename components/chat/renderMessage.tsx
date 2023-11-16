import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import UserModal from '../userModal';

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
  const [userId, setUserId] = useState<number>(0);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [userRect, setUserRect] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });
  const userRefs: React.MutableRefObject<HTMLDivElement | null>[] = [];

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFindUser = (userId: number) => {
    if (userId == session?.user.id) {
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

  const updateUserRect = (index: number) => {
    const clickedUserRef = userRefs[index];
    console.log('updateUserRect', userRefs);
    console.log(userRefs[index]);

    if (clickedUserRef && clickedUserRef.current) {
      console.log('test');
      const buttonRect = clickedUserRef.current.getBoundingClientRect();
      setUserRect({
        top: buttonRect.top,
        left: buttonRect.left,
        width: buttonRect.width,
      });
    }
  };

  const handleClickUser = (senderId: number, index: number) => {
    console.log('handleClickUser', senderId, index);
    updateUserRect(index);
    setUserId(senderId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <MessageListFrame ref={messageListRef}>
      {messages.map((message, index) => {
        userRefs[index] = userRefs[index] || React.createRef<HTMLDivElement>();
        return (
          <Frame key={index}>
            {handleFindUser(message.senderId) && (
              <UserFrame senderId={message.senderId} currentUser={session?.user.id}>
                <UserInfoFrame
                  onClick={() => handleClickUser(message.senderId, index)}
                  ref={userRefs[index]}
                >
                  <UserImage
                    src={handleSetUserAvatar(message.senderId)}
                    alt="Profle Image"
                    width={100}
                    height={100}
                  />
                  {handleUserNick(message.senderId)}
                </UserInfoFrame>
              </UserFrame>
            )}

            <MessageFrame senderId={message.senderId} currentUser={session?.user.id}>
              {message.senderId != 0 && (
                <Message key={index} senderId={message.senderId} currentUser={session?.user.id}>
                  {message.text}
                </Message>
              )}
              {message.senderId == 0 && <ActionMessage key={index}> {message.text} </ActionMessage>}
            </MessageFrame>
          </Frame>
        );
      })}
      {isOpenModal ? (
        <UserModal handleCloseModal={handleCloseModal} userId={userId} userRect={userRect} />
      ) : null}
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
  justify-content: ${(props) => (props.senderId === 0 ? 'center' : 'flex-start')};
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

const ActionMessage = styled.div`
  width: auto;
  max-width: 50%;
  word-wrap: break-word;
  height: auto;
  background-color: rgba(190, 167, 69, 0.2);
  color: ${(props) => props.theme.colors.brown};
  font-family: 'GiantsLight';
  font-size: 1.5vh;
  border-radius: 10px;
  padding: 1%;
`;

const UserFrame = styled.div<{ senderId: number; currentUser?: number }>`
  width: auto;
  display: flex;
  flex-direction: ${(props) => (props.senderId === props.currentUser ? 'row-reverse' : 'row')};
  color: ${(props) => props.theme.colors.brown};
  font-family: 'GiantsLight';
`;

const UserInfoFrame = styled.div`
  min-width: 12vw;
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

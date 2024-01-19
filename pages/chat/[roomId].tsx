import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '@/utils/SocketProvider';
import { useSession } from 'next-auth/react';
import Container from '@/components/layout/columnNevLayout';
import Header from '@/components/chat/chatRoomHeader';
import MessageContainer from '@/components/chat/renderMessage';
import InputContainer from '@/components/chat/inputMessage';
import NoticeModal from '@/components/modal/noticeModal';
import { RoomMessageData } from '@/types/RoomMessageData';
import { ParticipantData } from '@/types/ParticipantData';
import { UserData } from '@/types/UserData';
import { ActionRoomData } from '@/types/ActionRoomData';

const Chat = () => {
  const { chatSocket } = useSocket();
  const [userlist, setUserlist] = useState<ParticipantData[]>([]);
  const [banlist, setBanlist] = useState<UserData[]>([]);
  const [roomTitle, setRoomTitle] = useState('');
  const [roomMode, setRoomMode] = useState('');
  const [messages, setMessages] = useState<RoomMessageData[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isOpenNotice, setOpenNotice] = useState<boolean>(false);
  const [noticeMessage, setNoticeMessage] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const { roomId } = router.query as { roomId: string };

  useEffect(() => {
    if (chatSocket) {
      if (!roomTitle) {
        chatSocket
          .emitWithAck('room-detail', {
            roomId: roomId,
          })
          .then((response) => {
            if (response.status === 200) {
              console.log(response);
              setUserlist(
                response.body.participants.map((user: ParticipantData) => ({ ...user, status: 1 }))
              );
              setRoomTitle(response.body.title);
              setRoomMode(response.body.mode);
            } else {
              console.log('room-detail : Failed', response);
            }
          });
      }

      const handleRoomMessage = (response: RoomMessageData) => {
        const text = response.text;
        console.log('room-message response : ' + response.senderId);
        console.log('room-message response : ' + response.text);
        setMessages((prevMessages) => [...prevMessages, response]);
      };

      const handleUserActionMessage = (text: string) => {
        console.log('userAction : ' + text);
        const userActionMessage: RoomMessageData = {
          text: text,
          roomId: roomId,
          senderId: 0,
        };
        setMessages((prevMessages) => [...prevMessages, userActionMessage]);
      };

      const handleRoomJoin = (response: ParticipantData) => {
        console.log('handleRoomJoin', response);
        const existingUser = userlist.find((user) => user.id === response.id);
        let updatedUserlist;
        if (existingUser) {
          updatedUserlist = userlist.filter((user) => user.id !== response.id);
        } else {
          updatedUserlist = [...userlist];
        }
        updatedUserlist.push({ ...response, status: 1 });
        updatedUserlist.sort((a, b) => b.grade - a.grade);
        setUserlist(updatedUserlist);
        handleUserActionMessage(`${response.nickName}님이 들어왔습니다.`);
      };

      const handleRoomLeave = (response: ParticipantData) => {
        const targetId = response.id;
        console.log(targetId);
        setUserlist((prevUserlist) =>
          prevUserlist.map((user) =>
            user.id === targetId ? { ...user, grade: 0, status: 0 } : user
          )
        );
        handleUserActionMessage(`${response.nickName}님이 나갔습니다.`);
      };

      const handleRoomKick = (response: ActionRoomData) => {
        const { targetId } = response;
        const userId = session?.user.id;
        const targetUser = userlist.find((user) => user.id === targetId);
        if (targetUser) {
          if (targetId == userId) {
            router.push('/chat');
          }
          setUserlist((prevUserlist) =>
            prevUserlist.map((user) => (user.id === targetId ? { ...user, status: 0 } : user))
          );
          handleUserActionMessage(`${targetUser.nickName}님이 추방당했습니다.`);
        }
      };

      const handleRoomBan = (response: ActionRoomData) => {
        const { targetId } = response;
        const userId = session?.user.id;
        const targetUser = userlist.find((user) => user.id === targetId);
        if (targetUser) {
          if (targetId == userId) {
            router.push('/chat');
          }
          setUserlist((prevUserlist) =>
            prevUserlist.map((user) => (user.id === targetId ? { ...user, status: 0 } : user))
          );
          const banUserData: UserData = {
            id: targetUser.id,
            nickName: targetUser.nickName,
            intraName: targetUser.intraName,
            avatar: targetUser.avatar,
          };
          setBanlist((prevMessages) => [...prevMessages, banUserData]);
          handleUserActionMessage(`${targetUser.nickName}님이 차단당했습니다.`);
        }
      };

      const handleRoomMute = (response: ActionRoomData) => {
        console.log('handleRoomMute', response);
        const { targetId } = response;
        const userId = session?.user.id;
        const targetUser = userlist.find((user) => user.id === targetId);
        if (targetUser) {
          console.log('handleRoomMute2', response);
          if (targetId == userId) {
            setNoticeMessage('10분간 뮤트당하셨어요!');
            setOpenNotice(true);
          }
          setUserlist((prevUserlist) =>
            prevUserlist.map((user) => (user.id === targetId ? { ...user, mute: true } : user))
          );
          handleUserActionMessage(`${targetUser.nickName}님이 채팅 금지 상태입니다.`);
        }
      };

      const handleRoomUnban = (response: ActionRoomData) => {
        const { targetId } = response;
        setBanlist((prevBanlist) => prevBanlist.filter((user) => user.id !== targetId));
      };

      const handleRoomUnmute = (response: ActionRoomData) => {
        console.log('handleRoomUnmute', response);
        const { targetId } = response;
        const targetUser = userlist.find((user) => user.id === targetId);
        if (targetUser) {
          console.log('handleRoomUnmute2', response);
          setUserlist((prevUserlist) =>
            prevUserlist.map((user) => (user.id === targetId ? { ...user, mute: false } : user))
          );
        }
      };

      const handleAddAdmin = (response: ActionRoomData) => {
        const { targetId } = response;
        const targetUser = userlist.find((user) => user.id === targetId);
        if (targetUser) {
          setUserlist((prevUserlist) =>
            prevUserlist.map((user) => (user.id === targetId ? { ...user, grade: 1 } : user))
          );
          handleUserActionMessage(`${targetUser.nickName}님이 관리자 권한을 얻었습니다.`);
        }
      };

      const handleRemoveAdmin = (response: ActionRoomData) => {
        const { targetId } = response;
        const targetUser = userlist.find((user) => user.id === targetId);
        if (targetUser) {
          setUserlist((prevUserlist) =>
            prevUserlist.map((user) => (user.id === targetId ? { ...user, grade: 0 } : user))
          );
          handleUserActionMessage(`${targetUser.nickName}님의 관리자 권한이 해제되었습니다.`);
        }
      };

      const handleRoomMode = (response: { mode: string } & object) => {
        setRoomMode(response.mode);
      };

      const handleChangeOwner = (response: { id: number } & object) => {
        const targetUser = userlist.find((user) => user.id === response.id);
        if (targetUser) {
          setUserlist((prevUserlist) =>
            prevUserlist.map((user) => (user.id === response.id ? { ...user, grade: 2 } : user))
          );
          handleUserActionMessage(`${targetUser.nickName}님이 방장 권한을 얻었습니다.`);
        }
      };

      const handleUserUpdate = (response: any) => {
        console.log('handleUserUpdate', response);
        const targetUser = userlist.find((user) => user.id === response.id);
        if (targetUser) {
          setUserlist((prevUserlist) =>
            prevUserlist.map((user) =>
              user.id === response.id
                ? { ...user, nickName: response.nickName, avatar: response.avatar }
                : user
            )
          );
        }
      };

      chatSocket.on('room-message', handleRoomMessage);
      chatSocket.on('room-join', handleRoomJoin);
      chatSocket.on('room-leave', handleRoomLeave);
      chatSocket.on('room-kick', handleRoomKick);
      chatSocket.on('room-ban', handleRoomBan);
      chatSocket.on('room-mute', handleRoomMute);
      chatSocket.on('room-unban', handleRoomUnban);
      chatSocket.on('room-unmute', handleRoomUnmute);
      chatSocket.on('add-admin', handleAddAdmin);
      chatSocket.on('remove-admin', handleRemoveAdmin);
      chatSocket.on('room-mode', handleRoomMode);
      chatSocket.on('change-owner', handleChangeOwner);
      chatSocket.on('room-user-update', handleUserUpdate);

      return () => {
        chatSocket.off('room-message', handleRoomMessage);
        chatSocket.off('room-join', handleRoomJoin);
        chatSocket.off('room-leave', handleRoomLeave);
        chatSocket.off('room-kick', handleRoomKick);
        chatSocket.off('room-ban', handleRoomBan);
        chatSocket.off('room-mute', handleRoomMute);
        chatSocket.off('room-unban', handleRoomUnban);
        chatSocket.off('room-unmute', handleRoomUnmute);
        chatSocket.off('add-admin', handleAddAdmin);
        chatSocket.off('remove-admin', handleRemoveAdmin);
        chatSocket.off('room-mode', handleRoomMode);
        chatSocket.off('change-owner', handleChangeOwner);
        chatSocket.off('room-user-update', handleUserUpdate);
      };
    } else {
      router.push('/chat');
    }
  }, [chatSocket, userlist, banlist, roomTitle, roomId, router]);

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const sortUserList = () => {
    const sortedUserlist = [...userlist].sort((a, b) => b.grade - a.grade);
    setUserlist(sortedUserlist);
    console.log('sortUserList', userlist);
  };

  const sendMessage = () => {
    if (chatSocket && messageText) {
      chatSocket
        .emitWithAck('room-message', {
          text: messageText,
          roomId: roomId,
          senderId: session?.user.id,
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            setMessageText('');
          } else {
            setNoticeMessage('뮤트 상태에서는 메세지를 보낼 수 없어요!');
            setOpenNotice(true);
          }
        });
    }
  };

  const handleMessageTextChange = (newMessage: string) => {
    setMessageText(newMessage);
  };

  const handleCloseNotice = () => {
    setOpenNotice(false);
  };

  return (
    <Container>
      <Header
        roomTitle={roomTitle}
        roomMode={roomMode}
        roomId={roomId}
        userlist={userlist}
        banlist={banlist}
      />
      <ChatListFrame>
        <MessageContainer messages={messages} userlist={userlist} />
        <InputContainer
          messageText={messageText}
          setMessageText={handleMessageTextChange}
          handleKeyPress={handleKeyPress}
          sendMessage={sendMessage}
        />
      </ChatListFrame>
      {isOpenNotice && (
        <NoticeModal handleCloseModal={handleCloseNotice} noticeMessage={noticeMessage} />
      )}
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

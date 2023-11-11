import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../../utils/SocketProvider';
import { useSession } from 'next-auth/react';
import Container from '../../components/columnNevLayout';
import Header from '../../components/chat/chatRoomHeader';
import MessageContainer from '../../components/chat/renderMessage';
import InputContainer from '../../components/chat/inputMessage';
import NoticeModal from '../../components/noticeModal';

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
  const [roomMode, setRoomMode] = useState('');
  const [messages, setMessages] = useState<RoomMessageDto[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isOpenNotice, setOpenNotice] = useState<boolean>(false);
  const [noticeMessage, setNoticeMessage] = useState('');
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
              setRoomMode(response.body.mode);
            } else {
              console.log('room-detail : Failed', response);
            }
          });
      }

      const handleRoomMessage = (response: RoomMessageDto) => {
        const text = response.text;
        console.log('room-message response : ' + response.senderId);
        console.log('room-message response : ' + response.text);
        setMessages((prevMessages) => [...prevMessages, response]);
      };

      const handleUserActionMessage = (text: string) => {
        console.log('userAction : ' + text);
        const userActionMessage: RoomMessageDto = {
          text: text,
          roomId: roomId,
          senderId: 0,
        };
        setMessages((prevMessages) => [...prevMessages, userActionMessage]);
      };

      const handleRoomJoin = (response: ParticipantData) => {
        console.log(response);
        setUserlist((prevMessages) => [...prevMessages, response]);
        handleUserActionMessage(`${response.nickName}님이 들어왔습니다.`);
      };

      const handleRoomLeave = (response: ParticipantData) => {
        const targetId = response.id;
        console.log(targetId);
        setUserlist((prevUserlist) => prevUserlist.filter((user) => user.id !== targetId));
        handleUserActionMessage(`${response.nickName}님이 나갔습니다.`);
      };

      const handleRoomKick = (response: ActionRoomData) => {
        const { targetId } = response;
        const userId = session?.user.id;
        const targetUser = userlist.find((user) => user.id === targetId);
        if (targetUser) {
          if (targetId == userId) {
            router.push('http://localhost:3000/chat/');
          }
          setUserlist((prevUserlist) => prevUserlist.filter((user) => user.id !== targetId));
          handleUserActionMessage(`${targetUser.nickName}님이 추방당했습니다.`);
        }
      };

      const handleRoomBan = (response: ActionRoomData) => {
        const { targetId } = response;
        const userId = session?.user.id;
        const targetUser = userlist.find((user) => user.id === targetId);
        if (targetUser) {
          if (targetId == userId) {
            router.push('http://localhost:3000/chat/');
          }
          setUserlist((prevUserlist) => prevUserlist.filter((user) => user.id !== targetId));
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
        const { targetId } = response;
        const userId = session?.user.id;
        const targetUser = userlist.find((user) => user.id === targetId);
        if (targetUser) {
          if (targetId == userId) {
            setNoticeMessage('30분간 뮤트당하셨어요!');
            setOpenNotice(true);
          }
          setUserlist((prevUserlist) => {
            const updatedUserlist = prevUserlist.map((user) => {
              if (user.id === targetId) {
                return { ...user, mute: true };
              }
              return user;
            });
            return updatedUserlist;
          });
          handleUserActionMessage(`${targetUser.nickName}님이 채팅 금지 상태입니다.`);
        }
      };

      const handleRoomUnban = (response: ActionRoomData) => {
        const { targetId } = response;
        setBanlist((prevBanlist) => prevBanlist.filter((user) => user.id !== targetId));
      };

      const handleRoomUnmute = (response: ActionRoomData) => {
        const { targetId } = response;
        const targetUser = userlist.find((user) => user.id === targetId);
        if (targetUser) {
          setUserlist((prevUserlist) => {
            const updatedUserlist = prevUserlist.map((user) => {
              if (user.id === targetId) {
                return { ...user, mute: false };
              }
              return user;
            });
            return updatedUserlist;
          });
        }
      };

      const handleAddAdmin = (response: ActionRoomData) => {
        const { targetId } = response;
        const targetUser = userlist.find((user) => user.id === targetId);
        if (targetUser) {
          setUserlist((prevUserlist) => {
            const updatedUserlist = prevUserlist.map((user) => {
              if (user.id === targetId) {
                return { ...user, grade: 1 };
              }
              return user;
            });
            return updatedUserlist;
          });
          handleUserActionMessage(`${targetUser.nickName}님이 관리자 권한을 얻었습니다.`);
        }
      };

      const handleRemoveAdmin = (response: ActionRoomData) => {
        const { targetId } = response;
        const targetUser = userlist.find((user) => user.id === targetId);
        if (targetUser) {
          setUserlist((prevUserlist) => {
            const updatedUserlist = prevUserlist.map((user) => {
              if (user.id === targetId) {
                return { ...user, grade: 0 };
              }
              return user;
            });
            return updatedUserlist;
          });
          handleUserActionMessage(`${targetUser.nickName}님의 관리자 권한이 해제되었습니다.`);
        }
      };

      socket.on('room-message', handleRoomMessage);
      socket.on('room-join', handleRoomJoin);
      socket.on('room-leave', handleRoomLeave);
      socket.on('room-kick', handleRoomKick);
      socket.on('room-ban', handleRoomBan);
      socket.on('room-mute', handleRoomMute);
      socket.on('room-unban', handleRoomUnban);
      socket.on('room-unmute', handleRoomUnmute);
      socket.on('add-admin', handleAddAdmin);
      socket.on('remove-admin', handleRemoveAdmin);

      return () => {
        socket.off('room-message', handleRoomMessage);
        socket.off('room-join', handleRoomJoin);
        socket.off('room-leave', handleRoomLeave);
        socket.off('room-kick', handleRoomKick);
        socket.off('room-ban', handleRoomBan);
        socket.off('room-mute', handleRoomMute);
        socket.off('room-unban', handleRoomUnban);
        socket.off('room-unmute', handleRoomUnmute);
        socket.off('add-admin', handleAddAdmin);
        socket.off('remove-admin', handleRemoveAdmin);
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
      socket
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

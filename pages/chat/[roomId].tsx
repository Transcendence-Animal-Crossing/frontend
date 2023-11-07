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
        console.log('response.text : ' + text);
        setMessages((prevMessages) => [...prevMessages, response]);
      };

      const handleRoomJoin = (response: ParticipantData) => {
        console.log(response);
        setUserlist((prevMessages) => [...prevMessages, response]);
      };

      const handleRoomLeave = (response: ParticipantData) => {
        const targetId = response.id;
        console.log(targetId);
        setUserlist((prevUserlist) => prevUserlist.filter((user) => user.id !== targetId));
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
        const userId = session?.user.user_id;
        const targetUser = userlist.find((user) => user.id === targetId);
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

      const handleRoomMute = (response: ActionRoomData) => {
        const { targetId } = response;
        const userId = session?.user.user_id;
        setUserlist((prevUserlist) => {
          const updatedUserlist = prevUserlist.map((user) => {
            if (user.id === targetId) {
              return { ...user, mute: true };
            }
            return user;
          });
          return updatedUserlist;
        });
        if (targetId == userId) {
          setNoticeMessage('30분간 뮤트당하셨어요!');
          setOpenNotice(true);
        } else {
          console.log('뮤트당한사람있음');
        }
      };

      const handleRoomUnban = (response: ActionRoomData) => {
        const { targetId } = response;
        setBanlist((prevBanlist) => prevBanlist.filter((user) => user.id !== targetId));
      };

      const handleRoomUnmute = (response: ActionRoomData) => {
        const { targetId } = response;
        const userId = session?.user.user_id;
        setUserlist((prevUserlist) => {
          const updatedUserlist = prevUserlist.map((user) => {
            if (user.id === targetId) {
              return { ...user, mute: false };
            }
            return user;
          });
          return updatedUserlist;
        });
      };

      const handleAddAdmin = (response: ActionRoomData) => {
        const { targetId } = response;
        setUserlist((prevUserlist) => {
          const updatedUserlist = prevUserlist.map((user) => {
            if (user.id === targetId) {
              return { ...user, grade: 1 };
            }
            return user;
          });
          return updatedUserlist;
        });
      };

      const handleRemoveAdmin = (response: ActionRoomData) => {
        const { targetId } = response;
        setUserlist((prevUserlist) => {
          const updatedUserlist = prevUserlist.map((user) => {
            if (user.id === targetId) {
              return { ...user, grade: 0 };
            }
            return user;
          });
          return updatedUserlist;
        });
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
          senderId: session?.user.user_id,
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

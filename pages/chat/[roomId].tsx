import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../../utils/SocketProvider';

const Chat = () => {
  const { socket } = useSocket();
  const [userlist, setUserlist] = useState([]);
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const { roomId } = router.query;

  useEffect(() => {
    if (socket) {
      console.log('Room ID:', roomId);

      socket.on('room-join', (response) => {
        console.log(response);
      });

      socket.on('room-detail', (response) => {
        console.log('room-detail :', response);
        setUserlist(response.ParticipantData);
      });
    } else {
      router.push('http://localhost:3000/chat/');
    }
  }, []);

  return (
    <div>
      <h1>Chat Room</h1>
    </div>
  );
};

export default Chat;

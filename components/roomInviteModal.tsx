import styled from 'styled-components';
import Image from 'next/image';
import Isabelle from '../public/Login/Isabelle.png';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../utils/SocketProvider';
import NoticeModal from './noticeModal';

interface friendData {
  id: number;
  nickName: string;
  intraName: string;
  avatar: string;
  status: string;
}

interface InviteRoomData {
  id: string;
  title: string;
  sendBy: friendData;
}

const RoomInviteModal: React.FC<{ roomInfo: InviteRoomData; handleCloseModal: () => void }> = ({
  roomInfo,
  handleCloseModal,
}) => {
  const { chatSocket } = useSocket();
  const router = useRouter();
  const [isOpenNotice, setOpenNotice] = useState<boolean>(false);
  const [noticeMessage, setNoticeMessage] = useState('');

  const handleRoomInvite = () => {
    if (chatSocket) {
      chatSocket
        .emitWithAck('room-join', {
          roomId: roomInfo.id,
        })
        .then((response) => {
          if (response.status === 200) {
            console.log('room-join : Success', response);
            const responseRoomId = response.body.id;
            router.push(`/chat/${responseRoomId}`);
          } else {
            console.log('room-join : Failed', response);
            setNoticeMessage('채팅방에 입장하실 수 없어요!');
            setOpenNotice(true);
          }
        });
    }
  };

  const handleCloseNotice = () => {
    setOpenNotice(false);
    handleCloseModal();
  };

  return (
    <>
      <Container>
        <Content>
          <GuriImage src={Isabelle} alt='Isabelle' />
          <Text>
            <span className='nickName'>{roomInfo.sendBy.nickName}</span>
            <span className='intraName'> ({roomInfo.sendBy.intraName}) </span>님께서{' '}
            <span className='roomTitle'>{roomInfo.title}</span> 방으로 초대하셨어요 !
          </Text>
          <CompleteButtonFrame>
            <CompleteButton onClick={handleCloseModal}> 닫기 </CompleteButton>
            <CompleteButton onClick={handleRoomInvite}> 참여하기 </CompleteButton>
          </CompleteButtonFrame>
        </Content>
        {isOpenNotice && (
          <NoticeModal handleCloseModal={handleCloseNotice} noticeMessage={noticeMessage} />
        )}
      </Container>
    </>
  );
};

export default RoomInviteModal;

const Container = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  position: fixed;
  width: 20vw;
  height: auto;
  background-color: ${(props) => props.theme.colors.cream};
  padding: 2vh;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GuriImage = styled(Image)`
  width: 20%;
  height: auto;
  cursor: pointer;
`;

const Text = styled.p`
  width: 90%;
  height: auto;
  padding: 5%;
  font-family: 'GiantsLight';
  font-size: 1vw;
  line-height: normal;
  white-space: pre-wrap;

  color: ${(props) => props.theme.colors.brown};
  span.nickName {
    color: ${(props) => props.theme.colors.Emerald};
  }
  span.intraName {
    color: ${(props) => props.theme.colors.brown05};
  }
  span.roomTitle {
    font-family: 'Giants';
    color: ${(props) => props.theme.colors.orange};
  }
`;

const CompleteButtonFrame = styled.div`
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CompleteButton = styled.div`
  width: auto;
  height: auto;
  font-family: 'GiantsLight';
  background-color: #f7cd67;
  color: #7a5025;
  padding: 0.5vw 1vw;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 1vw;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

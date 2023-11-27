import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../../utils/SocketProvider';
import { useRouter } from 'next/router';
import pen from '../../public/Icon/pen.png';

const JoinRoomModal: React.FC<{
  handleCloseModal: () => void;
  handleFailModal: () => void;
  roomId: string;
}> = ({ handleCloseModal, handleFailModal, roomId }) => {
  const { chatSocket } = useSocket();
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRoomJoin = async (roomId: string) => {
    if (chatSocket) {
      await chatSocket
        .emitWithAck('room-join', {
          roomId: roomId,
          password: password,
        })
        .then((response) => {
          if (response.status === 200) {
            console.log('room-join : Success', response);
            const responseRoomId = response.body.id;
            router.push(`chat/${responseRoomId}`);
          } else {
            console.log('room-join : Failed', response);
            handleFailModal();
          }
        });
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handlePasswprdChange = (newPassword: string) => {
    setPassword(newPassword);
  };

  return (
    <>
      <Container onClick={handleOverlayClick}>
        <ContentFrame onClick={handleOverlayClick}>
          <Content>
            <InputFrame>
              <PenFrame>
                <PenImage src={pen} alt="pen" />
              </PenFrame>
              <Input
                type="text"
                placeholder="채팅방 비밀번호를 입력해주세요"
                onChange={(e) => handlePasswprdChange(e.target.value)}
                maxLength={4}
                required
              />
            </InputFrame>

            <CompleteButtonFrame>
              <CompleteButton onClick={() => handleRoomJoin(roomId)}> 참여 </CompleteButton>
            </CompleteButtonFrame>
          </Content>
        </ContentFrame>
      </Container>
    </>
  );
};

export default JoinRoomModal;

const Container = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ContentFrame = styled.div`
  width: 80%;
  height: 100%;
  top: 0;
  left: 0;
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
  gap: 2vh;
`;

const InputFrame = styled.div`
  width: 90%;
  height: auto;
  background-color: ${(props) => props.theme.colors.ivory};
  border-radius: 10px;
  padding: 5%;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PenFrame = styled.div`
  width: 1.5vw;
  margin-right: 3%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const PenImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Input = styled.input.attrs({ required: true })`
  width: 100%;
  height: auto;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.brown};
  font-family: 'BMHANNAAir';
  font-size: 2vh;
  &:focus {
    outline: none;
  }
`;

const CompleteButtonFrame = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
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

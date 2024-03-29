import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/utils/SocketProvider';
import { useRouter } from 'next/router';
import exit from '@/public/Icon/exit.png';
import info from '@/public/Icon/info.png';
import unlock from '@/public/Chat/unlock.png';
import lock from '@/public/Chat/lock.png';
import secret from '@/public/Chat/secret.png';

const UpdateRoomModal: React.FC<{
  handleCloseModal: () => void;
  createButtonRect: { top: number; right: number; height: number };
}> = ({ handleCloseModal, createButtonRect }) => {
  const { chatSocket } = useSocket();
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('PUBLIC');
  const [isUnlockButtonPressed, setIsUnlockButtonPressed] = useState(true);
  const [isLockButtonPressed, setIsLockButtonPressed] = useState(false);
  const [isSecretButtonPressed, setIsSecretButtonPressed] = useState(false);
  const overlayLeft = `${createButtonRect.right - window.innerWidth * 0.2}px`;
  const overlayTop = `${createButtonRect.top + createButtonRect.height * 1.5}px`;

  const handleUpdateRoom = async () => {
    if (chatSocket) {
      await chatSocket
        .emitWithAck('room-mode', {
          mode: mode,
          password: password,
        })
        .then((response) => {
          console.log('room-mode : ', response);
          handleCloseModal();
        });
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
  };

  const handleUnlockButton = () => {
    setIsUnlockButtonPressed(true);
    setIsLockButtonPressed(false);
    setIsSecretButtonPressed(false);
    setMode('PUBLIC');
  };

  const handleLockButton = () => {
    setIsUnlockButtonPressed(false);
    setIsLockButtonPressed(true);
    setIsSecretButtonPressed(false);
    setMode('PROTECTED');
  };

  const handleSecretButton = () => {
    setIsUnlockButtonPressed(false);
    setIsLockButtonPressed(false);
    setIsSecretButtonPressed(true);
    setMode('PRIVATE');
  };

  return (
    <>
      <Container onClick={handleOverlayClick}>
        <Content overlayTop={overlayTop} overlayLeft={overlayLeft}>
          <Header>
            채팅방 모드 설정
            <HeaderImage src={exit} alt="exit" onClick={handleOverlayClick} />
          </Header>
          <ButtonRowFrame>
            <ButtonFrame onClick={handleUnlockButton} isPressed={isUnlockButtonPressed}>
              <ButtonImage src={unlock} alt="unlock" />
            </ButtonFrame>
            <ButtonFrame onClick={handleLockButton} isPressed={isLockButtonPressed}>
              <ButtonImage src={lock} alt="lock" />
            </ButtonFrame>
            <ButtonFrame onClick={handleSecretButton} isPressed={isSecretButtonPressed}>
              <ButtonImage src={secret} alt="secret" />
            </ButtonFrame>
          </ButtonRowFrame>
          <>
            {isLockButtonPressed && (
              <InputFrame>
                <Input
                  type="text"
                  placeholder="비밀번호를 입력해주세요"
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  maxLength={4}
                  required
                />
              </InputFrame>
            )}
            {isSecretButtonPressed && (
              <TextFrame>
                <TextImage src={info} alt="info" />
                <Text>
                  시크릿 방은 채팅 로비에 보이지 않습니다. <br />
                  오로지 초대로만 유저를 초대 할 수 있습니다.
                </Text>
              </TextFrame>
            )}
          </>
          <CompleteButtonFrame>
            <CompleteButton onClick={handleUpdateRoom}>모드 변경</CompleteButton>
          </CompleteButtonFrame>
        </Content>
      </Container>
    </>
  );
};

export default UpdateRoomModal;

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

const Content = styled.div<{ overlayTop: string; overlayLeft: string }>`
  position: fixed;
  top: ${(props) => props.overlayTop};
  left: ${(props) => props.overlayLeft};
  width: 20.5vw;
  height: auto;
  background-color: ${(props) => props.theme.colors.cream};
  padding: 3vh 2vh;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vh;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: ${(props) => props.theme.colors.brown};
  font-family: 'GiantsLight';
  font-size: 2vh;
  padding: 0 1vw;
  box-sizing: border-box;
`;

const HeaderImage = styled(Image)`
  width: 1.5vw;
  height: auto;
  cursor: pointer;
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
  box-sizing: border-box;
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

const ButtonRowFrame = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 1vw;
  box-sizing: border-box;
`;

const ButtonFrame = styled.div<{ isPressed: boolean }>`
  width: 3vw;
  height: 3.5vh;
  background-color: ${(props) =>
    props.isPressed ? props.theme.colors.brown : props.theme.colors.brown05};
  border-radius: 20px;
  margin-right: 1vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonImage = styled(Image)`
  height: 3vh;
  width: auto;
  cursor: pointer;
`;

const CompleteButtonFrame = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 1vw;
  box-sizing: border-box;
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

const Text = styled.p`
  font-family: 'BMHANNAAir';
  font-size: 1vw;
  color: ${(props) => props.theme.colors.brown};
`;

const TextFrame = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 0.5vw;
  padding: 0 1vw;
  box-sizing: border-box;
`;

const TextImage = styled(Image)`
  height: 2vh;
  width: auto;
`;

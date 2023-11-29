import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import styled from 'styled-components';
import pen from '../../public/Icon/pen.png';
import Image from 'next/image';

const PasswordModal: React.FC<{
  handleCloseModal: () => void;
}> = ({ handleCloseModal }) => {
  const [message, setMessage] = useState(
    '변경할 비밀번호를 입력해주세요(10자 이하)'
  );
  const [password, setPassword] = useState('');

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
  };

  const handleSubmit = async () => {
    try {
      if (!password || password.length > 10) {
        setMessage('비밀번호는 1~10글자여야 합니다.');
        return;
      }
      await axiosInstance.patch('/users/password', {
        password: password,
      });
      console.log('password updated');
      handleCloseModal();
    } catch (error) {
      console.log('Error occured in handlePasswordUpdate');
      console.log(error);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Container onClick={handleOverlayClick}>
      <Content>
        <PasswordFrame>
          <InputFrame>
            <PenFrame>
              <PenImage src={pen} alt='pen' />
            </PenFrame>
            <Input
              type='password'
              onChange={(e) => handlePasswordChange(e.target.value)}
              maxLength={10}
              onKeyDown={(e) => handleKeyPress(e)}
              required
            />
          </InputFrame>
          <Text>{message}</Text>
        </PasswordFrame>
        <CompleteButtonFrame>
          <CompleteButton onClick={handleSubmit}>완료</CompleteButton>
        </CompleteButtonFrame>
      </Content>
    </Container>
  );
};

export default PasswordModal;

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
  width: 30vw;
  height: auto;
  background-color: ${(props) => props.theme.colors.cream};
  padding: 2vh;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
`;

const PasswordFrame = styled.div`
  width: 100%;
  height: 30%;
  gap: 1.5vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const InputFrame = styled.div`
  width: 100%;
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
  height: 100%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.brown};
  &::placeholder {
    font-family: 'BMHANNAAir';
  }
  font-size: 2vh;
  &:focus {
    outline: none;
  }
`;

const Text = styled.div`
  height: 1.5vw;
  color: #fc736d;
  font-family: 'GiantsLight';
  font-size: 1.3vh;
`;

const CompleteButtonFrame = styled.div`
  width: 100%;
  height: 40%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
`;

const CompleteButton = styled.div`
  width: 10%;
  height: 100%;
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

const PenFrame = styled.div`
  width: 2vw;
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

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import ProfileModal from './profileModal';
import PasswordModal from './passwordModal';
import { signOut } from 'next-auth/react';

const settingModal: React.FC<{
  handleCloseModal: () => void;
  SettingButtonRect: { top: number; left: number };
  userId: number | undefined;
}> = ({ handleCloseModal, SettingButtonRect, userId }) => {
  const overlayTop = `${SettingButtonRect.top * 2}px`;
  const overlayLeft = `${SettingButtonRect.left * 0.92}px`;

  const [twofactor, setTwofactor] = useState(false);
  const [isOpenProfile, setOpenProfile] = useState<boolean>(false);
  const [isOpenPassword, setOpenPassword] = useState<boolean>(false);

  useEffect(() => {
    get2fa();
  }, []);

  const get2fa = async () => {
    try {
      const response = await axiosInstance.get('/users/2fa');
      if (response.data == true) {
        setTwofactor(true);
      } else {
        setTwofactor(false);
      }
    } catch (error) {
      console.log('Error occured in get2fa');
      console.log(error);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleProfileModal = () => {
    setOpenProfile(true);
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
    handleCloseModal();
  };

  const handleTwoFactor = async () => {
    try {
      if (twofactor == false) {
        await setTwofactor(true);
        await axiosInstance.patch('/users/2fa-setup', {
          params: {
            id: userId,
          },
        });
        console.log('2fa setup');
      } else {
        await setTwofactor(false);
        await axiosInstance.patch('users/2fa-cancel');
        console.log('2fa cancel');
      }
    } catch (error) {
      console.log('Error occured in 2fa setup');
      console.log(error);
    }
  };

  const handlePasswordModal = () => {
    setOpenPassword(true);
  };

  const handleClosePassword = () => {
    setOpenPassword(false);
    handleCloseModal();
  };

  return (
    <>
      <Container onClick={handleOverlayClick}>
        <Content overlayTop={overlayTop} overlayLeft={overlayLeft}>
          <ButtonFrame>
            <Button onClick={handleProfileModal}> 프로필 설정 </Button>
            <Button onClick={handleTwoFactor}>
              {twofactor ? '이중인증 해제' : '이중인증 설정'}
            </Button>
            <Button onClick={handlePasswordModal}> 비밀번호 설정 </Button>
            <Button onClick={() => signOut()}> 로그아웃 </Button>
          </ButtonFrame>
        </Content>
        {isOpenProfile && (
          <ProfileModal handleCloseModal={handleCloseProfile} />
        )}
        {isOpenPassword && (
          <PasswordModal handleCloseModal={handleClosePassword} />
        )}
      </Container>
    </>
  );
};

export default settingModal;

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
  width: 10vw;
  height: auto;
  background-color: ${(props) => props.theme.colors.cream};
  padding: 1.3vh 0;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ButtonFrame = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1vh;
`;

const Button = styled.div`
  width: 60%;
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

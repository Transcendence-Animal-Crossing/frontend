import { useState } from 'react';
import { useSession } from 'next-auth/react';
import InfoContainer from '../join/info';
import PreviewContainer from '../join/preview';
import axiosInstance from '../../utils/axiosInstance';
import styled from 'styled-components';

const ProfileModal: React.FC<{
  handleCloseModal: () => void;
}> = ({ handleCloseModal }) => {
  const [message, setMessage] = useState('변경할 닉네임을 입력해주세요!');
  const [checknick, setChecknick] = useState(false);
  const [profile, setProfile] = useState(1);
  const [profilePath, setProfilePath] = useState('profile2.png');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const { data: session, update } = useSession();
  const [nickname, setNickname] = useState(
    session?.user.nickName ? session.user.nickName : ''
  );

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname);
    setChecknick(false);
  };

  const handleImageChange = (newIndex: number, e: any) => {
    setProfile(newIndex);
    if (newIndex === 0) {
      const fileInput = document.getElementById('file-input');
      if (fileInput) {
        fileInput.click();
      }
      console.log(fileInput);
    } else {
      setProfilePath(`profile${newIndex + 1}.png`);
    }
  };

  const handleFileInputChange = (e: any) => {
    const file = e.target.files[0];
    setUploadedImage(file);
  };

  const handleCheckNick = async (newNickname: string) => {
    try {
      if (!newNickname || newNickname.length < 2) {
        setMessage('닉네임은 2글자 이상이어야 합니다.');
        setChecknick(false);
        return;
      }
      
      const response = await axiosInstance.post('/users/nickname', {
        nickName: newNickname,
      });
      console.log(response);
      setChecknick(true);
      setMessage(' ');
    } catch (error) {
      console.log('join err', error);
      setChecknick(false);
      setMessage('중복된 닉네임입니다.');
    }
  };

  const handleComplete = async (newNickname: string, profile: number) => {
    let response;
    try {
      if (!newNickname) {
        newNickname = nickname;
      }
      if (profile === 0) {
        if (uploadedImage) {
          const formData = new FormData();
          formData.append('avatar', uploadedImage);
          formData.append('nickName', newNickname);
          response = await axiosInstance.patch('/users/profile', formData);
        }
      } else {
        response = await axiosInstance.patch('/users/profileWithUrl', {
          nickName: newNickname,
          avatar: profilePath,
        });
      }
      if (response) {
        console.log(response);
        await update({
          ...session,
          user: {
            ...session?.user,
            nickName: response.data.nickName,
            avatar: response.data.avatar,
          },
        });
      }
      handleCloseModal();
    } catch (error) {
      console.log('join err', error);
      setChecknick(false);
      setMessage('중복된 닉네임입니다.');
    }
  };

  return (
    <>
      <Container onClick={handleOverlayClick}>
        <Content>
          <InfoContainer
            message={message}
            onNicknameChange={handleNicknameChange}
            handleImageChange={handleImageChange}
            handleFileInputChange={handleFileInputChange}
          />
          <PreviewContainer
            nickname={nickname}
            profile={profile}
            checknick={checknick}
            uploadedImage={uploadedImage}
            handleCheckNick={handleCheckNick}
            handleComplete={handleComplete}
          />
        </Content>
      </Container>
    </>
  );
};

export default ProfileModal;

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
  width: 70vw;
  height: 80vh;
  background-color: ${(props) => props.theme.colors.cream};
  padding: 2vh;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

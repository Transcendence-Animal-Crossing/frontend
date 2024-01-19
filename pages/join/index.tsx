import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Container from '@/components/layout/rowLayout';
import InfoContainer from '@/components/join/info';
import PreviewContainer from '@/components/join/preview';
import axiosInstance from '@/utils/axiosInstance';

const JoinPage: React.FC = () => {
  const { data: session, update } = useSession();
  const [nickname, setNickname] = useState(session?.user.nickName || '');
  const [message, setMessage] = useState('닉네임은 비어있을 수 없습니다.');
  const [checknick, setChecknick] = useState(false);
  const [profile, setProfile] = useState(1);
  const [profilePath, setProfilePath] = useState('profile2.png');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const router = useRouter();

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
      if (response.status === 200) {
        setChecknick(true);
        setMessage(' ');
      }
    } catch (error) {
      console.log('join err', error);
      setChecknick(false);
      setMessage('중복된 닉네임입니다.');
    }
  };

  const handleComplete = async (newNickname: string, profile: number) => {
    let response;
    try {
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
      router.push('/');
    } catch (error) {
      console.log('join err', error);
      setChecknick(false);
      setMessage('중복된 닉네임입니다.');
    }
  };

  return (
    <>
      <Container>
        <InfoContainer
          message={message}
          nickname={nickname}
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
      </Container>
    </>
  );
};

export default JoinPage;

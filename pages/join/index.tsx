import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Container from '../../components/rowLayout';
import InfoContainer from './components/info';
import PreviewContainer from './components/preview';
import axiosInstance from '../../utils/axiosInstance';

const JoinPage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('닉네임은 비어있을 수 없습니다.');
  const [checknick, setChecknick] = useState(false);
  const [profile, setProfile] = useState(1);
  const router = useRouter();

  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname);
    setChecknick(false);
  };

  const handleImageChange = (newIndex: number) => {
    setProfile(newIndex);
  };

  const handleCheckNick = async (newNickname: string) => {
    try {
      if (!newNickname || newNickname.length < 2) {
        setMessage('닉네임은 2글자 이상이어야 합니다.');
        setChecknick(false);
        return;
      }

      const response = await axiosInstance.post('/users/nickname', {
        nickname: newNickname,
      });
      console.log(response);
      setChecknick(true);
      setMessage(' ');
    } catch (error) {
      console.log('join err', error);
      setChecknick(false);
      setMessage('중복된 닉네임입니다. ');
    }
  };

  return (
    <>
      <Container>
        <InfoContainer
          message={message}
          onNicknameChange={handleNicknameChange}
          handleImageChange={handleImageChange}
        />
        <PreviewContainer
          nickname={nickname}
          profile={profile}
          checknick={checknick}
          handleCheckNick={handleCheckNick}
        />
      </Container>
    </>
  );
};

export default JoinPage;

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Container from '../../components/rowLayout';
import InfoContainer from './components/info';
import PreviewContainer from './components/preview';

const JoinPage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [checknick, setChecknick] = useState(false);
  const [profile, setProfile] = useState(1);
  const { data: session } = useSession();
  const router = useRouter();

  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname);
  };

  const handleImageChange = (newIndex: number) => {
    setProfile(newIndex);
  };

  const handleCheckNick = async (newNickname: string) => {
    try {
      const apiUrl = 'http://localhost:8080/users/nickname';
      const response = await axios.post(apiUrl, {
        nickName: nickname,
      });
      console.log(response);
      setChecknick(true);
    } catch (error) {
      console.error('join error:', error);
    }
    setChecknick(true);
  };

  return (
    <>
      <Container>
        <InfoContainer
          checknick={checknick}
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

'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import styled from 'styled-components';
import Timmy from '../../../public/Login/Timmy.png';
import Image from 'next/image';
import router, { useRouter } from 'next/router';
import Container from '../../../components/columnLayout';
import TwoFactAuth from '../../../components/login/twofactorInput';

const Twofactor = () => {
  const router = useRouter();
  const [token, setToken] = useState<string>('');

  const handleSubmit = async () => {
    const intraName = router.query.intraName as string;
    console.log('router: ', router.query);
    console.log('intraName: ', intraName);
    console.log('token: ', token);
    const result = await signIn('two-factor', {
      intraName: intraName,
      token: token,
      redirect: true,
      callbackUrl: '/',
    });
  };

  const handleRouteLobby = async () => {
    router.push('/');
  };

  return (
    <Container>
      <TwoFactorFrame>
        <LogoImage src={Timmy} alt='logo' />
        <Title>이중인증 페이지에 오셨습니다.</Title>
        <Description>
          이메일로 보내 드린 코드 7자리를 입력해 주세요-!
        </Description>
        <LoginInput>
          <TwoFactAuth value={token} onChange={(val) => setToken(val)} />
          <DivisionBar />
          <ButtonFrame>
            <Button id='cancel' onClick={handleRouteLobby}>
              취소
            </Button>
            <Button id='submit' onClick={handleSubmit}>
              입력 완료
            </Button>
          </ButtonFrame>
        </LoginInput>
      </TwoFactorFrame>
    </Container>
  );
};

export default Twofactor;

const TwoFactorFrame = styled.div`
  width: 30%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3%;
`;

const LogoImage = styled(Image)`
  width: auto;
  height: 25%;
`;

const Title = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.brown};
  font-family: 'GiantsLight';
  font-size: 3vmin;
`;

const Description = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'GiantsLight';
  font-size: 1.5vmin;
  color: ${(props) => props.theme.colors.brown05};
`;

const LoginInput = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10%;
`;

const ButtonFrame = styled.div`
  width: 90%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 5%;
`;

const Button = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-family: 'GiantsLight';
  font-size: 2vmin;
  padding: 0 1vw;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: ${(props) => props.theme.colors.brown};
  background-color: ${(props) =>
    props.id == 'submit' ? props.theme.colors.yellow : '#EEE9CA'};
`;

const DivisionBar = styled.div`
  width: 90%;
  height: 1.5px;
  background-color: ${(props) => props.theme.colors.brown};
`;

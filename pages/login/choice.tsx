import styled from 'styled-components';
import Image from 'next/image';
import Logo from '@/public/Login/Isabelle.png';
import FTLoginButton from '@/public/Login/42loginButton.png';
import CommonLoginButton from '@/public/Login/LoginButton.png';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Container from '@/components/columnLayout';

const ChoicePage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (session.responseCode === 200) {
        router.push('/');
      } else if (session.responseCode === 201) {
        router.push('/join');
      }
    }
  });

  return (
    <>
      <Container>
        <LogoImage src={Logo} alt="Login" />
        <LoginButton onClick={() => signIn('42-school')}>
          <LoginButtonImg src={FTLoginButton} alt="42 Login" />
        </LoginButton>
        <LoginButton onClick={() => signIn('Credentials')}>
          <LoginButtonImg src={CommonLoginButton} alt="Common Login" />
        </LoginButton>
      </Container>
    </>
  );
};

export default ChoicePage;

const LogoImage = styled(Image)`
  width: 6%;
  height: auto;
  margin: 10px 10px;
`;

const LoginButton = styled.div`
  width: 15%;
  height: auto;
  margin: 0.5%;
  cursor: pointer;
  border: none;
`;

const LoginButtonImg = styled(Image)`
  width: 100%;
  height: auto;
`;

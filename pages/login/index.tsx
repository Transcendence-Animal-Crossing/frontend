import styled from 'styled-components';
import Image from 'next/image';
import Logo from '@/public/Login/logo.png';
import ButtonImage from '@/public/Login/loginplz.png';
import OverlayImage from '@/public/Login/overlay.png';
import SelectLoginImage from '@/public/Login/selectLogin.png';
import SelectNoImage from '@/public/Login/selectNo.png';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Container from '@/components/layout/columnLayout';

const LoginPage: React.FC = () => {
  const [clickState, setClickState] = useState(false);
  const [loginButtonRect, setLoginButtonRect] = useState<DOMRect | null>(null);
  const loginButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loginButtonRef.current) {
      const loginButtonRect = loginButtonRef.current.getBoundingClientRect();
      setLoginButtonRect(loginButtonRect);
    }
  }, [clickState]);

  const handleLoginView = async () => {
    if (clickState) setClickState(false);
    else setClickState(true);
  };

  return (
    <>
      <Container>
        <LogoImage src={Logo} alt='Login' />
        <LoginButton onClick={handleLoginView} ref={loginButtonRef}>
          <LoginButtonImg src={ButtonImage} alt='Login Plz' />
        </LoginButton>
      </Container>
      {clickState && loginButtonRect && (
        <OverlayWindow loginButtonRect={loginButtonRect} handleLoginView={handleLoginView} />
      )}
    </>
  );
};

export default LoginPage;

const LogoImage = styled(Image)`
  width: 6%;
  height: auto;
  margin: 10px 10px;
`;

const LoginButton = styled.div`
  width: 60%;
  height: auto;
  margin: 0px 0px;
  cursor: pointer;
  border: none;
`;

const LoginButtonImg = styled(Image)`
  width: 100%;
  height: auto;
`;

const OverlayWindow = ({
  loginButtonRect,
  handleLoginView,
}: {
  loginButtonRect: DOMRect;
  handleLoginView: () => void;
}) => {
  const router = useRouter();
  const overlayRight = `${loginButtonRect.right - loginButtonRect.width * 0.2}px`;
  const overlayTop = `${loginButtonRect.top - loginButtonRect.height * 0.3}px`;

  const handleLoginChoice = async () => {
    router.push('/login/choice');
  };

  return (
    <Overlay style={{ top: overlayTop, left: overlayRight }}>
      <OverlayBackImage src={OverlayImage} alt='Overlay' />
      <OverlayButtonFrame>
        <OverlayButton onClick={handleLoginChoice}>
          <OverlayButtonImg src={SelectLoginImage} alt='SelectLogin' />
        </OverlayButton>
        <OverlayButton onClick={handleLoginView}>
          <OverlayButtonImg src={SelectNoImage} alt='SelectLogin' />
        </OverlayButton>
      </OverlayButtonFrame>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  width: 20%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
`;

const OverlayBackImage = styled(Image)`
  width: 100%;
  height: auto;
  position: relative;
`;

const OverlayButtonFrame = styled.div`
  width: 100%;
  height: 100%;
  border: none;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10%;
`;

const OverlayButton = styled.div`
  width: auto;
  height: 25%;
  cursor: pointer;
  border: none;
`;

const OverlayButtonImg = styled(Image)`
  width: auto;
  height: 100%;
`;

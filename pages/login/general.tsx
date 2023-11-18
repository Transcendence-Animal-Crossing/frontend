'use client';
import { useRef } from 'react';
import { signIn } from 'next-auth/react';
import styled from 'styled-components';
import Logo from '../../public/Login/TimmyNook.png';
import Image from 'next/image';
import Container from '../../components/columnLayout';

const general = () => {
  const idRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async () => {
    const result = await signIn('credentials', {
      intraname: idRef.current,
      password: passwordRef.current,
      redirect: true,
      callbackUrl: '/',
    });
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Container>
      <GeneralLogin>
        <LogoImage src={Logo} alt='Login' />
        <Text>로그인을 부탁드려요 -!</Text>
        <LoginInput>
          <InputBox
            type='text'
            placeholder='아이디'
            onChange={(e: any) => (idRef.current = e.target.value)}
            autoFocus={true}
          />
          <InputBox
            type='password'
            placeholder='비밀번호'
            onChange={(e: any) => (passwordRef.current = e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
          />
          <DivisionBar />
          <Button onClick={handleSubmit}>입력 완료</Button>
        </LoginInput>
      </GeneralLogin>
    </Container>
  );
};

export default general;

const GeneralLogin = styled.div`
  width: 20%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3%;
`;

const LogoImage = styled(Image)`
  width: 30%;
  height: auto;
`;

const Text = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.brown};
  font-family: 'GiantsLight';
  font-size: 3vmin;
`;

const LoginInput = styled.div`
  width: 100%;
  height: 60%;
  margin: 3%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10%;
`;

const InputBox = styled.input.attrs({ required: true })`
  width: 90%;
  height: 20%;
  color: ${(props) => props.theme.colors.brown};
  background-color: ${(props) => props.theme.colors.ivory};
  border-radius: 10px;
  &::placeholder {
    font-family: 'BMHANNAAir';
  }
  font-size: 2vmin;
  padding: 0 1vw;
  border: none;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  &:focus {
    outline: none;
  }
`;

const Button = styled.div`
  width: 90%;
  height: 20%;
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
  background-color: ${(props) => props.theme.colors.yellow};
`;

const DivisionBar = styled.div`
  width: 90%;
  height: 1.5px;
  background-color: ${(props) => props.theme.colors.brown};
`;

import styled from "styled-components";
import Image from "next/image";
import Logo from "../../public/Login/Isabelle.png";
import FTLoginButton from "../../public/Login/42loginButton.png";
import CommonLoginButton from "../../public/Login/LoginButton.png";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";

const ChoicePage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      console.log(session);
      router.push("http://localhost:3000/");
    }
  });

  const handleCommonLogin = async () => {
    // 일반로그인
    // router.push("http://localhost:3000/");
  };

  return (
    <>
      <Container>
        <LogoImage src={Logo} alt="Login" />
        <LoginButton onClick={() => signIn("42-school")}>
          <LoginButtonImg src={FTLoginButton} alt="42 Login" />
        </LoginButton>
        <LoginButton onClick={handleCommonLogin}>
          <LoginButtonImg src={CommonLoginButton} alt="Common Login" />
        </LoginButton>
      </Container>
    </>
  );
};

export default ChoicePage;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #e9e2c7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

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

import styled from "styled-components";
import Image from "next/image";
import Logo from "../public/logo.png";
import ButtonImage from "../public/Login/loginplz.png";

const LoginPage: React.FC = () => {
  return (
    <>
      <Container>
        <LogoImage src={Logo} alt="Login" />
        <LoginButton>
          <LoginButtonImg src={ButtonImage} alt="Login Plz" />
        </LoginButton>
      </Container>
    </>
  );
};

export default LoginPage;

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
  cursor: pointer;
  border: none;
  margin: 0px 0px;
  width: 60%;
  height: auto;
`;

const LoginButtonImg = styled(Image)`
  width: 100%;
  height: auto;
`;

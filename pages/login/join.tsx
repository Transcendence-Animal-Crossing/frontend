import styled from "styled-components";
import Image from "next/image";
import Logo from "../../public/Login/Isabelle.png";
import FTLoginButton from "../../public/Login/42loginButton.png";
import CommonLoginButton from "../../public/Login/LoginButton.png";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import Container from "../../components/Layout";

const ChoicePage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      <Container>
        <p> join </p>
      </Container>
    </>
  );
};

export default ChoicePage;

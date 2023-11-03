import styled from "styled-components";
import Image from "next/image";
import UserContainer from "./components/user";
import InfoContainer from "./components/info";
import { useSession } from "next-auth/react";
import { profile12 } from "./components/profile";

import Container from "../../components/columnNevLayout";

const MyPage = () => {
  // const profile = profile12;
  return (
    <Container>
      <MyPageFrame>
        <UserContainer nickname="yeselee"></UserContainer>
        <InfoContainer></InfoContainer>
      </MyPageFrame>
    </Container>
  );
};

export default MyPage;

// 모든 아이템 들어가는 네모 박스
const MyPageFrame = styled.div`
  width: 70%;
  height: 70%;
  display: flex;
  flex Direction: row;
`;

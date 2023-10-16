import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Container from "../../components/rowLayout";
import InfoContainer from "./components/info";
import PreviewContainer from "./components/preview";

const JoinPage: React.FC = () => {
  const [nickname, setNickname] = useState("");
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

  return (
    <>
      <Container>
        <InfoContainer
          checknick={checknick}
          onNicknameChange={handleNicknameChange}
          handleImageChange={handleImageChange}
        />
        <PreviewContainer nickname={nickname} profile={profile} />
      </Container>
    </>
  );
};

export default JoinPage;

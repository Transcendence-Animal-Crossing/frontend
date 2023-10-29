import styled from 'styled-components';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12 } from './profile';

const PreviewContainer: React.FC<{
  nickname: string;
  profile: number;
  checknick: boolean;
  handleCheckNick: (newNickname: string) => void;
}> = ({ nickname, profile, checknick, handleCheckNick }) => {
  const imagePaths = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12];
  const { data: session } = useSession();

  return (
    <>
      <PreviewFrame>
        <TitleText> [Preview] </TitleText>
        <ProfileImage src={imagePaths[profile]} alt="Profile Image" />
        <NameFrame>
          <NicknameFrame>
            {nickname ? (
              <NicknameText> {nickname} </NicknameText>
            ) : (
              <NicknameText> NickName </NicknameText>
            )}
          </NicknameFrame>
          {session ? <IntraText> {session.user.login} </IntraText> : null}
        </NameFrame>
        <DivisionBar />
        {!checknick ? (
          <NicknameButton onClick={() => handleCheckNick(nickname)}>
            Check <br /> Nickname
          </NicknameButton>
        ) : (
          <CompleteButton> COMPLETE! </CompleteButton>
        )}
      </PreviewFrame>
    </>
  );
};

export default PreviewContainer;

const PreviewFrame = styled.div`
  width: 20%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5%;
`;

const TitleText = styled.div`
  color: ${(props) => props.theme.colors.brown};
  font-family: 'BMHANNAPro';
  text-align: center;
  font-size: 3vw;
`;

const ProfileImage = styled(Image)`
  width: 40%;
  height: auto;
  margin: 10px;
  gap: 1%;
`;

const NameFrame = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const NicknameFrame = styled.div`
  width: auto;
  background-color: ${(props) => props.theme.colors.pink};
  border-radius: 20px;
  padding: 5%;
`;

const NicknameText = styled.div`
  color: ${(props) => props.theme.colors.white};
  font-family: 'BMHANNAPro';
  text-align: center;
  font-size: large;
`;

const IntraText = styled.div`
  color: ${(props) => props.theme.colors.brown};
  font-family: 'BMHANNAPro';
  text-align: center;
  font-size: medium;
`;

const DivisionBar = styled.div`
  width: 80%;
  height: 1.5px;
  background-color: ${(props) => props.theme.colors.brown};
`;

const NicknameButton = styled.div`
  width: 60%;
  height: 10%;
  font-family: 'BMHANNAPro';
  background-color: #f7cd67;
  color: #7a5025;
  padding: 0.5vw 1vw;
  border-radius: 50px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 2vw;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CompleteButton = styled.div`
  width: 60%;
  height: 10%;
  font-family: 'BMHANNAPro';
  background-color: #f7cd67;
  color: #7a5025;
  padding: 0.5vw 1vw;
  border-radius: 50px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 2vw;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

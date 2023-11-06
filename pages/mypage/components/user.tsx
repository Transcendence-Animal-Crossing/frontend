import styled from "styled-components";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { profile12 } from "./profile";
import { bronze, silver, gold, platinum, diamond } from "./tier";
import info from "../../../public/Icon/info.png";

const UserContainer: React.FC<{
  nickname: string;
  tierIndex: number;
  totalCount: number;
  winCount: number;
  winRate: number;
  avatar: string;
}> = ({ nickname, tierIndex, totalCount, winCount, winRate, avatar }) => {
  const { data: session } = useSession();

  const tierImages = [bronze, silver, gold, platinum, diamond];
  const tierTexts = ["브론즈", "실버", "골드", "플래티넘", "다이아몬드"];

  return (
    <UserProfile>
      <ProfileImage src={avatar} alt="Profle Image" width={100} height={100} />
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
      <TierFrame>
        {session ? (
          <TierImage
            src={tierImages[tierIndex]}
            alt="Tier Image"
            width={30}
            height={30}
          />
        ) : (
          <TierImage src={tierImages[tierIndex]} alt="default Image" />
        )}
        <TierText> {tierTexts[tierIndex]} </TierText>
        <InfoImage src={info} alt="info" />
      </TierFrame>
      <DivisionBar />
      <MatchStatFrame>
        <MatchStatText>
          <MatchStatName> 경기 수 </MatchStatName>
          <MatchStatNumber> {totalCount} </MatchStatNumber>
        </MatchStatText>
        <MatchStatText>
          <MatchStatName> 승리 </MatchStatName>
          <MatchStatNumber> {winCount} </MatchStatNumber>
        </MatchStatText>
        <MatchStatText>
          <MatchStatName> 승률 </MatchStatName>
          <MatchStatNumber> {winRate}% </MatchStatNumber>
        </MatchStatText>
      </MatchStatFrame>
      <DivisionBar />
    </UserProfile>
  );
};

export default UserContainer;

const UserProfile = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3%;
`;

const ProfileImage = styled(Image)`
  padding: 5%;
  width: 55%;
  height: auto;
  margin: 10px;
  gap: 1%;
  border-radius: 50px;
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
  font-family: "GiantsLight";
  text-align: center;
  font-size: x-large;
`;

const IntraText = styled.div`
  padding: 3%;
  color: ${(props) => props.theme.colors.brown};
  font-family: "GiantsLight";
  text-align: center;
  font-size: large;
`;

const DivisionBar = styled.div`
  width: 80%;
  height: 1.5px;
  background-color: ${(props) => props.theme.colors.brown};
`;

const TierFrame = styled.div`
  width: 80%;
  height: auto;
  display: flex;
  flex-direction: row;
`;

const TierImage = styled(Image)`
  width: 20%;
  height: auto;
  padding-left: 5%;
  margin: auto 0;
`;

const TierText = styled.div`
  color: ${(props) => props.theme.colors.brown};
  width: 60%;
  font-family: "GiantsLight";
  vertical-align: middle;
  text-align: center;
  font-size: large;
  margin: auto 0;
`;

const InfoImage = styled(Image)`
  height: 2vh;
  width: auto;
  cursor: pointer;
  margin: auto 0;
`;

const MatchStatFrame = styled.div`
  width: 80%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1vh;
`;

const MatchStatText = styled.div`
  color: ${(props) => props.theme.colors.brown};
  width: 90%;
  height: auto;
  font-family: "GiantsLight";
  display: flex;
  flex-direction: row;
  font-size: large;
`;

const MatchStatName = styled.div`
  width: 50%;
  text-align: left;
`;

const MatchStatNumber = styled.div`
  width: 50%;
  text-align: right;
`;

import styled from "styled-components";
import Image from "next/image";
import { useState, useEffect } from "react";
import { bronze, silver, gold, platinum, diamond } from "./tier";

const UserFrame: React.FC<{
  ranking: number;
  nickName: string;
  intraName: string;
  avatar: string;
  rankScore: number;
  rankGameTotalCount: number;
}> = ({
  ranking,
  nickName,
  intraName,
  avatar,
  rankScore,
  rankGameTotalCount,
}) => {
  const tierImages = [bronze, silver, gold, platinum, diamond];
  const [tierIndex, setTierIndex] = useState(0);

  useEffect(() => {
    handleRank(rankScore);
  });

  const handleRank = async (rankScore: number) => {
    if (rankScore < 1000) {
      setTierIndex(0);
    } else if (rankScore < 3000) {
      setTierIndex(1);
    } else if (rankScore < 5000) {
      setTierIndex(2);
    } else if (rankScore < 7000) {
      setTierIndex(3);
    } else {
      setTierIndex(4);
    }
  };

  return (
    <UserRankFrame>
      <LeftFrame>
        <RankingFrame> {ranking} </RankingFrame>
        <TierImage
          src={tierImages[tierIndex]}
          alt="Tier Image"
          width={30}
          height={30}
        />
        <UserInfoFrame>
          <ProfileImage
            src={avatar}
            alt="Profle Image"
            width={100}
            height={100}
          />
          <NameFrame>
            <NickNameFrame> {nickName} </NickNameFrame>
            <IntraNameFrame> {intraName} </IntraNameFrame>
          </NameFrame>
        </UserInfoFrame>
      </LeftFrame>
      <MatchCountFrame> 경기 횟수: {rankGameTotalCount}회</MatchCountFrame>
    </UserRankFrame>
  );
};

export default UserFrame;

const UserRankFrame = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.cream};
  font-family: "GiantsLight";
`;

const LeftFrame = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10%;
`;

const RankingFrame = styled.div`
  width: 15%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.indigo};
  color: ${(props) => props.theme.colors.white};
`;

const TierImage = styled(Image)`
  width: 10%;
  height: auto;
`;

const UserInfoFrame = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7%;
`;

const ProfileImage = styled(Image)`
  width: 15%;
  height: auto;
  border-radius: 50px;
`;

const NameFrame = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "GiantsLight";
  color: ${(props) => props.theme.colors.brown};
`;

const NickNameFrame = styled.div`
  width: 100%;
  font-size: small;
`;

const IntraNameFrame = styled.div`
  width: 100%;
  font-size: x-small;
  margin-top: 3%;
`;

const MatchCountFrame = styled.div`
  width: 50%;
  height: 100%;
  margin-right: 5%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: small;
  color: ${(props) => props.theme.colors.brown};
`;
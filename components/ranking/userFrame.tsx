import styled from 'styled-components';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { bronze, silver, gold, platinum, diamond } from './tier';
import UserInfo from '@/components/layout/userInfo';
import UserModal from '@/components/modal/userModal';

const UserFrame: React.FC<{
  id: number;
  ranking: number;
  nickName: string;
  intraName: string;
  avatar: string;
  rankScore: number;
  rankGameTotalCount: number;
}> = ({ id, ranking, nickName, intraName, avatar, rankScore, rankGameTotalCount }) => {
  const tierImages = [bronze, silver, gold, platinum, diamond];
  const [tierIndex, setTierIndex] = useState(0);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [userRect, setUserRect] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });
  const userRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    handleRank(rankScore);
  });

  const handleRank = async (rankScore: number) => {
    if (rankScore < 1000) {
      setTierIndex(0);
    } else if (rankScore < 1100) {
      setTierIndex(1);
    } else if (rankScore < 1500) {
      setTierIndex(2);
    } else if (rankScore < 2000) {
      setTierIndex(3);
    } else {
      setTierIndex(4);
    }
  };

  const handleClickUser = () => {
    if (userRef.current) {
      const rect = userRef.current.getBoundingClientRect();
      setUserRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <UserRankFrame>
      <LeftFrame>
        <RankingFrame> {ranking} </RankingFrame>
        <TierFrame>
          <TierImage src={tierImages[tierIndex]} alt='Tier Image' width={30} height={30} />
          <RankScore>{rankScore}점</RankScore>
        </TierFrame>
        <UserTouchFrame onClick={handleClickUser} ref={userRef}>
          <UserInfo
            nickName={nickName}
            intraName={intraName}
            avatar={avatar}
            width={50}
            height={4.5}
          />
        </UserTouchFrame>
      </LeftFrame>
      <MatchCountFrame> 경기 횟수: {rankGameTotalCount}회</MatchCountFrame>
      {isOpenModal ? (
        <UserModal handleCloseModal={handleCloseModal} userId={id} userRect={userRect} />
      ) : null}
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
  font-family: 'GiantsLight';
`;

const LeftFrame = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10%;
`;

const UserTouchFrame = styled.div`
  width: 50%;
`;

const RankingFrame = styled.div`
  width: 15%;
  height: 100%;
  border-radius: 10px 0px 0px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.indigo};
  color: ${(props) => props.theme.colors.white};
`;

const TierFrame = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const TierImage = styled(Image)`
  width: 25%;
  height: auto;
`;

const RankScore = styled.div`
  width: 55%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4vh;
  color: ${(props) => props.theme.colors.brown};
`;

const MatchCountFrame = styled.div`
  width: 50%;
  height: 100%;
  margin-right: 5%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 1.4vh;
  color: ${(props) => props.theme.colors.brown};
`;

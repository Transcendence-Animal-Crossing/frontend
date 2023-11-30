import styled from 'styled-components';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { bronze, silver, gold, platinum, diamond } from './tier';
import info from '../../public/Icon/info.png';
import TierModal from './tierModal';

const UserContainer: React.FC<{
  intraname: string;
  nickname: string;
  rankScore: number;
  tierIndex: number;
  totalCount: number;
  winCount: number;
  winRate: number;
  avatar: string;
}> = ({
  intraname,
  nickname,
  rankScore,
  tierIndex,
  totalCount,
  winCount,
  winRate,
  avatar,
}) => {
  const tierImages = [bronze, silver, gold, platinum, diamond];
  const tierTexts = ['브론즈', '실버', '골드', '플래티넘', '다이아몬드'];

  const [isOpenTierModal, setOpenTierModal] = useState<boolean>(false);
  const [InfoButtonRect, setInfoButtonRect] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const InfoButtonRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (InfoButtonRef.current) {
      const buttonRect = InfoButtonRef.current.getBoundingClientRect();
      setInfoButtonRect({
        top: buttonRect.top,
        left: buttonRect.left,
      });
    }
  }, []);

  const handleOpenTierInfo = () => {
    setOpenTierModal(true);
  };

  const handleCloseTierInfo = () => {
    setOpenTierModal(false);
  };

  return (
    <UserProfile>
      <ProfileImage src={avatar} alt='Profile Image' width={100} height={100} />
      <NameFrame>
        <NicknameText> {nickname} </NicknameText>
        <IntraText> {intraname} </IntraText>
      </NameFrame>
      <DivisionBar />
      <TierFrame>
        <TierImage
          src={tierImages[tierIndex]}
          alt='Tier Image'
          width={30}
          height={30}
        />
        <TierTextFrame>
          <TierText> {tierTexts[tierIndex]} </TierText>
          <TierScore>{rankScore}점</TierScore>
        </TierTextFrame>
        <InfoImage
          src={info}
          alt='info'
          onClick={handleOpenTierInfo}
          ref={InfoButtonRef}
        />
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
      {isOpenTierModal && (
        <TierModal
          handleCloseModal={handleCloseTierInfo}
          InfoButtonRect={InfoButtonRect}
        />
      )}
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
  padding-top: 5%;
  gap: 4%;
`;

const ProfileImage = styled(Image)`
  width: 55%;
  height: auto;
  border-radius: 50px;
`;

const NameFrame = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1vh;
`;

const NicknameText = styled.div`
  background-color: ${(props) => props.theme.colors.pink};
  border-radius: 20px;
  padding: 5%;
  color: ${(props) => props.theme.colors.white};
  font-family: 'GiantsLight';
  text-align: center;
  font-size: 3.5vh;
`;

const IntraText = styled.div`
  padding: 3%;
  color: ${(props) => props.theme.colors.brown};
  font-family: 'GiantsLight';
  text-align: center;
  font-size: 2vh;
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

const TierTextFrame = styled.div`
  color: ${(props) => props.theme.colors.brown};
  width: 60%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'GiantsLight';
  gap: 20%;
`;

const TierText = styled.div`
  width: 100%;
  height: 50%;
  text-align: center;
  font-size: 2.5vh;
`;

const TierScore = styled.div`
  width: 100%;
  height: 30%;
  text-align: center;
  font-size: 1.5vh;
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
  gap: 2vh;
`;

const MatchStatText = styled.div`
  color: ${(props) => props.theme.colors.brown};
  width: 90%;
  height: auto;
  font-family: 'GiantsLight';
  display: flex;
  flex-direction: row;
  font-size: 2.5vh;
`;

const MatchStatName = styled.div`
  width: 50%;
  text-align: left;
`;

const MatchStatNumber = styled.div`
  width: 50%;
  text-align: right;
`;

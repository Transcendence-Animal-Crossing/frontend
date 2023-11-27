import styled from 'styled-components';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import InfoModal from '../infoModal';
import info from '../../public/Icon/info.png';
import home from '../../public/Icon/home.png';

const Header = (props: { title: string; text: string }) => {
  const router = useRouter();
  const [isOpenInfo, setOpenInfo] = useState<boolean>(false);
  const [InfoButtonRect, setInfoButtonRect] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const InfoButtonRef = useRef<HTMLImageElement | null>(null);
  const [infoText, setInfoText] = useState<string>('');

  useEffect(() => {
    if (InfoButtonRef.current) {
      const buttonRect = InfoButtonRef.current.getBoundingClientRect();
      setInfoButtonRect({
        top: buttonRect.top,
        left: buttonRect.left,
      });
    }
    if (props.title === 'Ranking') {
      setInfoText('여기서는 유저 검색도 할 수 있어구리! 닉네임 또는 인트라명으로 검색해봐구리!');
    } else if (props.title === 'General Game') {
      setInfoText(
        "일반 게임에서는 'Normal' 과 'Hard' , 두 가지 모드를 선택 할 수 있어구리. 진행중인 게임도 관전할 수 있으니 구경해봐구리!"
      );
    } else if (props.title === 'Rank Game') {
      setInfoText(
        '랭크게임에선 실력이 비슷한 유저와 게임을 할 수 있어구리. 너의 실력을 세상에 보여줘 구리!!'
      );
    }
  }, []);

  const handleOpenInfo = () => {
    setOpenInfo(true);
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
  };

  const handleRouteLobby = async () => {
    router.push('/');
  };

  return (
    <>
      <HeaderFrame>
        <InfoFrame>
          <TitleFrame>{props.title}</TitleFrame>
          <SubText>{props.text}</SubText>
          <InfoImage src={info} alt='info' onClick={handleOpenInfo} ref={InfoButtonRef} />
        </InfoFrame>
        <ButtonFrame>
          <Button onClick={handleRouteLobby}>
            <InfoImage src={home} alt='home' />
          </Button>
        </ButtonFrame>
      </HeaderFrame>
      {isOpenInfo && (
        <InfoModal
          handleCloseModal={handleCloseInfo}
          infoText={infoText}
          InfoButtonRect={InfoButtonRect}
        />
      )}
    </>
  );
};

export default Header;

const HeaderFrame = styled.div`
  width: 80%;
  height: auto;
  display: flex;
  flex-direction: row;
  margin-bottom: 2vh;
  align-items: center;
  justify-content: space-between;
`;

const InfoFrame = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
`;

const TitleFrame = styled.div`
  background-color: ${(props) => props.theme.colors.gold};
  border-radius: 0 20px 20px 0;
  padding: 1.5vh;
  padding-right: 1.5vw;
  align-items: center;
  color: ${(props) => props.theme.colors.ivory};
  font-family: 'Giants';
  font-size: 2.5vh;
`;

const SubText = styled.p`
  color: ${(props) => props.theme.colors.brown05};
  font-family: 'GiantsLight';
  font-size: 2vh;
`;

const InfoImage = styled(Image)`
  height: 2.5vh;
  width: auto;
  cursor: pointer;
`;

const ButtonFrame = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
`;

const Button = styled.div`
  padding: 1vh 3vh;
  background-color: ${(props) => props.theme.colors.beige};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

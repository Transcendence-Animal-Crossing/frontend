import styled from 'styled-components';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import CreateRoomModal from './createRoomModal';
import InfoModal from '../infoModal';
import info from '../../public/Icon/info.png';
import plus from '../../public/Icon/plus.png';
import home from '../../public/Icon/home.png';

const Header = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [isOpenInfo, setOpenInfo] = useState<boolean>(false);
  const [createButtonRect, setCreateButtonRect] = useState<{
    top: number;
    right: number;
    height: number;
  }>({ top: 0, right: 0, height: 0 });
  const [InfoButtonRect, setInfoButtonRect] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const infoText =
    '단체 채팅이 가능한 채팅방이다구리. 채탕방을 생성 하고싶다면 오른쪽 위 + 버튼을 누르면 된다구리.';

  const CreateButtonRef = useRef<HTMLDivElement | null>(null);
  const InfoButtonRef = useRef<HTMLImageElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (CreateButtonRef.current) {
      const buttonRect = CreateButtonRef.current.getBoundingClientRect();
      setCreateButtonRect({
        top: buttonRect.top,
        right: buttonRect.right,
        height: buttonRect.height,
      });
    }

    if (InfoButtonRef.current) {
      const buttonRect = InfoButtonRef.current.getBoundingClientRect();
      setInfoButtonRect({
        top: buttonRect.top,
        left: buttonRect.left,
      });
    }
  }, []);

  const handleOpenCreate = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
          <TitleFrame>Chatting Room</TitleFrame>
          <SubText> 단체채팅 </SubText>
          <InfoImage src={info} alt="info" onClick={handleOpenInfo} ref={InfoButtonRef} />
        </InfoFrame>
        <ButtonFrame>
          <Button onClick={handleOpenCreate} ref={CreateButtonRef}>
            <InfoImage src={plus} alt="plus" />
          </Button>
          <Button onClick={handleRouteLobby}>
            <InfoImage src={home} alt="home" />
          </Button>
        </ButtonFrame>
      </HeaderFrame>
      {isOpenModal && (
        <CreateRoomModal handleCloseModal={handleCloseModal} createButtonRect={createButtonRect} />
      )}
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
  width: 70%;
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
  font-size: 3vh;
`;

const SubText = styled.p`
  color: ${(props) => props.theme.colors.brown05};
  font-family: 'GiantsLight';
  font-size: 2vh;
`;

const InfoImage = styled(Image)`
  height: 3vh;
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

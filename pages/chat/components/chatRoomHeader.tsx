import styled from 'styled-components';
import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import CreateRoomModal from './createRoomModal';
import info from '../../../public/Icon/info.png';
import plus from '../../../public/Icon/plus.png';
import home from '../../../public/Icon/home.png';

const Header: React.FC<{ roomTitle: string }> = ({ roomTitle }) => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [createButtonRect, setCreateButtonRect] = useState<DOMRect | null>(null);
  const CreateButtonRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleOpenCreate = () => {
    if (CreateButtonRef.current) {
      const createButtonRect = CreateButtonRef.current.getBoundingClientRect();
      setCreateButtonRect(createButtonRect);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleRouteLobby = async () => {
    router.push('/');
  };

  return (
    <>
      <HeaderFrame>
        <InfoFrame>
          <TitleFrame> {roomTitle} </TitleFrame>
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

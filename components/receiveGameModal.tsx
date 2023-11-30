import styled from 'styled-components';
import Image from 'next/image';
import Isabelle from '../public/Login/Isabelle.png';
import React, { useEffect, useState } from 'react';

interface friendData {
  id: number;
  nickName: string;
  intraName: string;
  avatar: string;
  status: string;
}

const ReceiveGameModal: React.FC<{
  userInfo: friendData;
  handleCloseModal: () => void;
  setInviteResponse: (arg0: string) => void;
}> = ({ userInfo, handleCloseModal, setInviteResponse }) => {
  
  const handleGameAccept = () => {
    setInviteResponse('ACCEPT');
    handleCloseModal();
  };

  const handleGameDeny = () => {
    setInviteResponse('DENIED');
    handleCloseModal();
  };

  return (
    <>
      <Container>
        <ContentFrame>
          <Content>
            <GuriImage src={Isabelle} alt='Isabelle' />
            <Text>
              <span className='nickName'>{userInfo.nickName}</span>
              <span className='intraName'> ({userInfo.intraName}) </span>님께서 도전장을 보내셨어요!
            </Text>
            <CompleteButtonFrame>
              <CompleteButton onClick={handleGameDeny}> 거절하기 </CompleteButton>
              <CompleteButton onClick={handleGameAccept}> 수락하기 </CompleteButton>
            </CompleteButtonFrame>
          </Content>
        </ContentFrame>
      </Container>
    </>
  );
};

export default ReceiveGameModal;

const Container = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ContentFrame = styled.div`
  width: 80%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Content = styled.div`
  position: fixed;
  width: 20vw;
  height: auto;
  background-color: ${(props) => props.theme.colors.cream};
  padding: 2vh;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GuriImage = styled(Image)`
  width: 20%;
  height: auto;
  cursor: pointer;
`;

const Text = styled.p`
  width: 90%;
  height: auto;
  padding: 5%;
  font-family: 'GiantsLight';
  font-size: 1vw;
  line-height: normal;
  white-space: pre-wrap;

  color: ${(props) => props.theme.colors.brown};
  span.nickName {
    color: ${(props) => props.theme.colors.Emerald};
  }
  span.intraName {
    color: ${(props) => props.theme.colors.brown05};
  }
  span.roomTitle {
    font-family: 'Giants';
    color: ${(props) => props.theme.colors.orange};
  }
`;

const CompleteButtonFrame = styled.div`
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CompleteButton = styled.div`
  width: auto;
  height: auto;
  font-family: 'GiantsLight';
  background-color: #f7cd67;
  color: #7a5025;
  padding: 0.5vw 1vw;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 1vw;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

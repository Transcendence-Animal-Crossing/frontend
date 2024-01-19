import styled from 'styled-components';
import Image from 'next/image';
import Isabelle from '@/public/Login/Isabelle.png';
import React, { useEffect, useState } from 'react';

const RequestGameModal: React.FC<{}> = ({}) => {
  return (
    <>
      <Container>
        <ContentFrame>
          <Content>
            <GuriImage src={Isabelle} alt='Isabelle' />
            <Text> 상대방의 수락을 기다리는 중이에요 ! </Text>
          </Content>
        </ContentFrame>
      </Container>
    </>
  );
};

export default RequestGameModal;

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

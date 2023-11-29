import styled from 'styled-components';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

const Header = (props: { title: string; text: string }) => {
  const [isRank, setIsRank] = useState<boolean>(false);

  useEffect(() => {
    if (props.text == 'RANK') setIsRank(true);
    else setIsRank(false);
  });

  return (
    <>
      <HeaderFrame>
        <InfoFrame>
          <TtileText>{props.title} </TtileText>
          {!isRank && <InfoText> &nbsp; - {props.text} MODE</InfoText>}
        </InfoFrame>
      </HeaderFrame>
    </>
  );
};

export default Header;

const HeaderFrame = styled.div`
  width: 80%;
  height: auto;
  display: flex;
  flex-direction: row;
  margin-bottom: 3vh;
  align-items: center;
  justify-content: center;
`;

const InfoFrame = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: ${(props) => props.theme.colors.gold};
  color: ${(props) => props.theme.colors.ivory};
  border-radius: 20px;
  padding: 1vh 3vh;
`;

const TtileText = styled.div`
  font-family: 'Giants';
  font-size: 2.5vh;
`;

const InfoText = styled.div`
  font-family: 'Giants';
  font-size: 1.5vh;
  padding-top: 0.5vh;
`;

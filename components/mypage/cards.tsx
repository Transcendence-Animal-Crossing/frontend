import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const Cards = ({ cards }) => {
  return (
    <CardsFrame>
      {cards.map((card) => (
        <CardImage src={card} alt='Card Image' width={100} height={100} />
      ))}
    </CardsFrame>
  );
};

export default Cards;

const CardsFrame = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10%;
`;

const CardImage = styled(Image)`
  width: 20%;
  height: 100%;
`;

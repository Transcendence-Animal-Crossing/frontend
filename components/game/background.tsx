import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const GameBackGround: React.FC<{
  canvasRef: React.RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
}> = ({ canvasRef, width, height }) => {
  return (
    <GameFrame width={width} height={height} ref={canvasRef}>
      {/* <DivisionBar height={height} /> */}
    </GameFrame>
  );
};

export default GameBackGround;

const GameFrame = styled.canvas<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background-color: ${(props) => props.theme.colors.ivory};
  border: 1vh solid ${(props) => props.theme.colors.brown05};
  display: flex;
  align-items: center;
  justify-content: center;
`;

// const DivisionBar = styled.div<{ height: number }>`
//   width: 1vh;
//   height: ${(props) => props.height}px;
//   background-color: ${(props) => props.theme.colors.brown05};
// `;

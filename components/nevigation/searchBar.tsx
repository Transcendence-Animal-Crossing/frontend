import styled from 'styled-components';
import Image from 'next/image';
import react, { useEffect, useState, useRef } from 'react';
import bell from '../../public/Icon/bell.png';
import bellon from '../../public/Icon/bellon.png';
import search from '../../public/Icon/search.png';
import React from 'react';

const searchBar: React.FC<{
  handleClickBell: () => void;
  setRequestRect: (rect: { top: number; left: number; height: number }) => void;
  requestListLen: number;
}> = ({ handleClickBell, setRequestRect, requestListLen }) => {
  const [searchText, setSearchText] = useState('');
  const requestRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (requestRef.current) {
      const requestRect = requestRef.current.getBoundingClientRect();
      setRequestRect({
        top: requestRect.top,
        left: requestRect.left,
        height: requestRect.height,
      });
    }
  }, []);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      //
    }
  };

  return (
    <SearchBarFrame>
      <BellFrame onClick={handleClickBell} ref={requestRef}>
        {requestListLen == 0 ? (
          <ImageFrame src={bell} alt="bell" />
        ) : (
          <ImageFrame src={bellon} alt="bell" />
        )}
      </BellFrame>
      <SearchFrame>
        <Input
          type="text"
          placeholder=""
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          maxLength={10}
          required
        />
        <ImageFrame src={search} alt="search" />
      </SearchFrame>
    </SearchBarFrame>
  );
};

export default searchBar;

const SearchBarFrame = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 3%;
  box-sizing: border-box;
  gap: 3%;
`;

const BellFrame = styled.div`
  width: 15%;
  height: auto;
  background-color: #e9e2c7;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2%;
  cursor: pointer;
`;

const SearchFrame = styled.div`
  width: 85%;
  height: auto;
  background-color: #e9e2c7;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 2%;
`;

const ImageFrame = styled(Image)`
  width: 1.5vw;
  height: 1.5vw;
`;

const Input = styled.input.attrs({ required: true })`
  width: 90%;
  height: 90%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.brown};
  font-family: 'GiantsLight';
  &:focus {
    outline: none;
  }
`;

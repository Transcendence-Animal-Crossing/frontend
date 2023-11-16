import styled from 'styled-components';
import Image from 'next/image';
import react, { useEffect, useState } from 'react';
import bell from '../../public/Icon/bell.png';
import search from '../../public/Icon/search.png';

const searchBar = () => {
  const [searchText, setSearchText] = useState('');

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      //
    }
  };

  return (
    <SearchBarFrame>
      <BellFrame>
        <ImageFrame src={bell} alt="bell" />
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

import Pagination from "react-js-pagination";
import React, { useState, useEffect } from "react";
import Cards from "./cards";
import styled from "styled-components";
import {
  achieveDark1,
  achieveDark2,
  achieveDark3,
  achieveDark4,
  achieveDark5,
  achieveDark6,
  achieveDark7,
} from "./achieveDark";
import {
  achieveLight1,
  achieveLight2,
  achieveLight3,
  achieveLight4,
  achieveLight5,
  achieveLight6,
  achieveLight7,
} from "./achieveLight";

const Paging = ({ achieveList }: { achieveList: number[] }) => {
  const achieveDark = [
    achieveDark1,
    achieveDark2,
    achieveDark3,
    achieveDark4,
    achieveDark5,
    achieveDark6,
    achieveDark7,
  ];

  const achieveLight = [
    achieveLight1,
    achieveLight2,
    achieveLight3,
    achieveLight4,
    achieveLight5,
    achieveLight6,
    achieveLight7,
  ];

  const [achievements, setAchievements] = useState([
    achieveDark1,
    achieveDark2,
    achieveDark3,
    achieveDark4,
    achieveDark5,
    achieveDark6,
    achieveDark7,
  ]);

  const [page, setPage] = useState(1);

  const cardPerPage = 3;
  const totalItemsCount = achievements.length;
  const indexOfLastCard = page * cardPerPage;
  const indexOfFirstCard = indexOfLastCard - cardPerPage;
  const currentCards = achievements.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    handleAchievements();
  }, [page]);

  const handleAchievements = () => {
    console.log("handleAchievements() achieveList", achieveList);
    let newAchievements = [...achievements];
    achieveList.map((achieve, index) => {
      if (achieve === 1) {
        newAchievements[index] = achieveLight[index];
      } else {
        newAchievements[index] = achieveDark[index];
      }
    });
    setAchievements(newAchievements);
  };

  return (
    <PagingFrame>
      <Cards cards={currentCards} />
      <StyledPagination>
        <Pagination
          activePage={page}
          itemsCountPerPage={cardPerPage}
          totalItemsCount={totalItemsCount}
          prevPageText={"‹"}
          nextPageText={"›"}
          onChange={handlePageChange}
          hideFirstLastPages={true}
        />
      </StyledPagination>
    </PagingFrame>
  );
};

export default Paging;

const PagingFrame = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledPagination = styled.div`
  .pagination { 
    display: flex; 
    justify-content: center; 
    margin-top: 15px; 
    font-family: "GiantsLight";
    gap: 0.5%;
  }
  ul.pagination li {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem; 
  }
  ul.pagination li a { 
    text-decoration: none; color: white; font-size: 1rem;
    color: ${(props) => props.theme.colors.lightgold}}
  ul.pagination li.active a { color: white; }
  ul.pagination li.active {
      background-color: ${(props) => props.theme.colors.brown} }
  }
`;

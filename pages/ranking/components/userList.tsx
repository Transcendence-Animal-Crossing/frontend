import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { useState, useEffect } from "react";
import UserFrame from "./userFrame";

const UserList: React.FC<{
  userList: {
    ranking: number;
    nickName: string;
    intraName: string;
    avatar: string;
    rankScore: number;
    rankGameTotalCount: number;
  }[];
}> = ({ userList }) => {
  return (
    <UserListFrame>
      {userList.map((user) => {
        return (
          <UserFrame
            ranking={user.ranking}
            nickName={user.nickName}
            intraName={user.intraName}
            avatar={user.avatar}
            rankScore={user.rankScore}
            rankGameTotalCount={user.rankGameTotalCount}
          ></UserFrame>
        );
      })}
    </UserListFrame>
  );
};

export default UserList;

const UserListFrame = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2%;
`;

import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../utils/SocketProvider';
import axiosInstance from '../utils/axiosInstance';
import DmModal from './dm/dmModal';

const UserModal: React.FC<{
  handleCloseModal: () => void;
  userId: number;
  userRect: { top: number; left: number; width: number };
}> = ({ handleCloseModal, userId, userRect }) => {
  const { socket } = useSocket();
  const [followStatus, setFollowStatus] = useState<number>(0);
  const [blockStatus, setBlockStatus] = useState<number>(0);
  const [IsOpenDm, setIsOpenDm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const overlayLeft = `${userRect.left + userRect.width * 0.4}px`;
  const overlayTop = `${userRect.top}px`;

  useEffect(() => {
    handleFriendInfo();
  }, [userId]);

  const handleFriendInfo = async () => {
    try {
      const response = await axiosInstance.get(`/users/user`, {
        params: { targetId: userId },
      });
      console.log(response);
      setFollowStatus(response.data.followStatus);
      setBlockStatus(response.data.blockStatus);
    } catch (error) {
      console.error('Error fetching friend info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDM = async () => {
    setIsOpenDm(true);
    // if (socket) {
    //   socket
    //     .emitWithAck('dm-focus', {
    //       targetId: userId,
    //     })
    //     .then((response) => {
    //       console.log(response);
    //     });
    // }
  };

  const handleCloseDM = async () => {
    setIsOpenDm(false);
    // if (socket) {
    //   socket
    //     .emitWithAck('dm-focus', {
    //       targetId: null,
    //     })
    //     .then((response) => {
    //       console.log(response);
    //     });
    // }
  };

  const handleAddFriend = async () => {
    await axiosInstance.post(`/follow/request`, {
      sendTo: userId,
    });
    setFollowStatus(1);
  };

  const handleFriendRequest = async () => {
    await axiosInstance.delete(`/follow/request`, {
      data: { sendTo: userId },
    });
    setFollowStatus(0);
  };

  const handleRemoveFriend = async () => {
    await axiosInstance.delete(`/follow`, {
      data: { sendTo: userId },
    });
    setFollowStatus(0);
  };

  const handleBlock = async () => {
    await axiosInstance.patch(`/users/block`, {
      id: userId,
    });
    setBlockStatus(1);
  };

  const handleUnblock = async () => {
    await axiosInstance.patch(`/users/unblock`, {
      id: userId,
    });
    setBlockStatus(0);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <>
      <Container onClick={handleOverlayClick}>
        <Content overlayTop={overlayTop} overlayLeft={overlayLeft}>
          {loading ? (
            <Item> Loading... </Item>
          ) : (
            <>
              <Item>프로필 보기</Item>
              {followStatus === 2 && <Item onClick={handleOpenDM}>DM</Item>}
              {followStatus !== 2 && <NonItem>DM</NonItem>}
              <Item>게임 초대</Item>
              {followStatus === 0 && <Item onClick={handleAddFriend}>친구 추가</Item>}
              {followStatus === 1 && <Item onClick={handleFriendRequest}>친구요청 취소</Item>}
              {followStatus === 2 && <Item onClick={handleRemoveFriend}>친구 삭제</Item>}
              {blockStatus === 0 && <Item onClick={handleBlock}>차단</Item>}
              {blockStatus === 1 && <Item onClick={handleUnblock}>차단 해제</Item>}
            </>
          )}
        </Content>
      </Container>
      {IsOpenDm && <DmModal handleCloseModal={handleCloseDM} targetId={userId} />}
    </>
  );
};

export default UserModal;

const Container = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div<{ overlayTop: string; overlayLeft: string }>`
  position: fixed;
  top: ${(props) => props.overlayTop};
  left: ${(props) => props.overlayLeft};
  width: auto;
  height: auto;
  background-color: #ffeea0;
  padding: 2vh;
  gap: 1vh;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #725d42;
  font-size: 1.5vh;
  font-family: 'GiantsLight';
  &:hover {
    color: #988368;
  }
`;

const NonItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.brown05};
  font-size: 1.5vh;
  font-family: 'GiantsLight';
`;

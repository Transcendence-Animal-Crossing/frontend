import styled from 'styled-components';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSocket } from '../utils/SocketProvider';
import axiosInstance from '../utils/axiosInstance';
import DmModal from './dm/dmModal';
import NoticeModal from './noticeModal';
import RequestGameModal from './requestGameModal';

const UserModal: React.FC<{
  handleCloseModal: () => void;
  userId: number;
  userRect: { top: number; left: number; width: number };
}> = ({ handleCloseModal, userId, userRect }) => {
  const { chatSocket } = useSocket();
  const [followStatus, setFollowStatus] = useState<number>(0);
  const [blockStatus, setBlockStatus] = useState<number>(0);
  const [IsOpenDm, setIsOpenDm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpenNotice, setOpenNotice] = useState<boolean>(false);
  const [noticeMessage, setNoticeMessage] = useState<string>('유효하지않은 요청입니다.');
  const router = useRouter();
  const overlayLeft = `${userRect.left + userRect.width * 0.4}px`;
  const overlayTop = `${userRect.top}px`;

  // game invite
  const [isOpenInvite, setIsOpenInvite] = useState<boolean>(false);

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

  const handleUserPage = () => {
    router.push(`http://localhost:3000/profile/${userId}`);
  };

  const handleOpenDM = async () => {
    setIsOpenDm(true);
    if (chatSocket) {
      chatSocket
        .emitWithAck('dm-focus', {
          targetId: userId,
        })
        .then((response) => {
          console.log(response);
        });
    }
  };

  const handleCloseDM = async () => {
    setIsOpenDm(false);
    if (chatSocket) {
      chatSocket
        .emitWithAck('dm-focus', {
          targetId: null,
        })
        .then((response) => {
          console.log(response);
        });
    }
  };

  const handleInviteGame = async () => {
    if (chatSocket) {
      setIsOpenInvite(true);
      await chatSocket
        .emitWithAck('game-invite', {
          targetId: userId,
        })
        .then((response) => {
          if (response.status === 200) {
            console.log('handleInviteGame response ', response);
            if (response.body === 'DENIED') {
              setNoticeMessage('친구분이 초대 요청을 거절하셨어요!');
              setOpenNotice(true);
              setIsOpenInvite(false);
            } else if (response.body === 'ACCEPT') {
              setIsOpenInvite(false);
            }
          } else {
            console.log('game-join : invite', response);
          }
        });
    }
  };

  const handleAddFriend = async () => {
    try {
      await axiosInstance.post(`/follow/request`, {
        sendTo: userId,
      });
      setFollowStatus(1);
    } catch (error) {
      setNoticeMessage('유효하지않은 요청입니다.');
      setOpenNotice(true);
    }
  };

  const handleFriendRequest = async () => {
    try {
      await axiosInstance.delete(`/follow/request`, {
        data: { sendTo: userId },
      });
      setFollowStatus(0);
    } catch (error) {
      setNoticeMessage('유효하지않은 요청입니다.');
      setOpenNotice(true);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await axiosInstance.delete(`/follow`, {
        data: { sendTo: userId },
      });
      setFollowStatus(0);
    } catch (error) {
      setNoticeMessage('유효하지않은 요청입니다.');
      setOpenNotice(true);
    }
  };

  const handleBlock = async () => {
    try {
      await axiosInstance.patch(`/users/block`, {
        id: userId,
      });
      setBlockStatus(1);
    } catch (error) {
      setNoticeMessage('유효하지않은 요청입니다.');
      setOpenNotice(true);
    }
  };

  const handleUnblock = async () => {
    try {
      await axiosInstance.patch(`/users/unblock`, {
        id: userId,
      });
      setBlockStatus(0);
    } catch (error) {
      setNoticeMessage('유효하지않은 요청입니다.');
      setOpenNotice(true);
    }
  };

  const handleCloseNotice = () => {
    setOpenNotice(false);
    handleCloseModal();
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
              <Item onClick={handleUserPage}>프로필 보기</Item>
              {followStatus === 2 && <Item onClick={handleOpenDM}>DM</Item>}
              {followStatus !== 2 && <NonItem>DM</NonItem>}
              <Item onClick={handleInviteGame}>게임 초대</Item>
              {followStatus === 0 && <Item onClick={handleAddFriend}>친구 추가</Item>}
              {followStatus === 1 && <Item onClick={handleFriendRequest}>친구요청 취소</Item>}
              {followStatus === 2 && <Item onClick={handleRemoveFriend}>친구 삭제</Item>}
              {blockStatus === 0 && <Item onClick={handleBlock}>차단</Item>}
              {blockStatus === 1 && <Item onClick={handleUnblock}>차단 해제</Item>}
            </>
          )}
        </Content>
      </Container>
      {IsOpenDm && (
        <DmModal handleCloseModal={handleCloseDM} targetId={userId} setOpenNotice={setOpenNotice} />
      )}
      {isOpenNotice && (
        <NoticeModal handleCloseModal={handleCloseNotice} noticeMessage={noticeMessage} />
      )}
      {isOpenInvite && <RequestGameModal />}
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

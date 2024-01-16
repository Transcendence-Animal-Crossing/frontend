import styled from 'styled-components';
import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '@/utils/axiosInstance';

interface RequestData {
  sendBy: number;
  nickName: string;
  intraName: string;
}

const AlarmModal: React.FC<{
  handleCloseModal: () => void;
  requestList: RequestData[];
  setRequestList: React.Dispatch<React.SetStateAction<RequestData[]>>;
  requestRect: { top: number; left: number; height: number };
}> = ({ handleCloseModal, requestList, setRequestList, requestRect }) => {
  const [intraName, setIntraName] = useState<string>('');
  const [showIntraName, setShowIntraName] = useState<boolean>(false);
  const [intraOverlayTop, setIntraOverlayTop] = useState<string>('');
  const intraRefs: React.MutableRefObject<HTMLDivElement | null>[] = [];
  const overlayLeft = `${requestRect.left * 0.8}px`;
  const overlayTop = `${requestRect.top + requestRect.height * 1.2}px`;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleShowIntraName = (intraName: string, index: number) => {
    const intraRef = intraRefs[index];
    if (intraRef.current) {
      const intraRect = intraRef.current.getBoundingClientRect();
      const overlayTop = `${intraRect.top - 35}px`;
      setIntraOverlayTop(overlayTop);
      setIntraName(intraName);
      setShowIntraName(true);
    }
  };

  const handleAcceptRequest = async (sendBy: number) => {
    await axiosInstance.post(`/follow/request`, {
      sendTo: sendBy,
    });
    setRequestList((prevRequestList) =>
      prevRequestList.filter((list: { sendBy: number }) => list.sendBy !== sendBy)
    );
  };

  const handleDenyRequest = async (sendBy: number) => {
    await axiosInstance.delete(`/follow/requested`, {
      data: { sendBy: sendBy },
    });
    setRequestList((prevRequestList) =>
      prevRequestList.filter((list: { sendBy: number }) => list.sendBy !== sendBy)
    );
  };

  return (
    <>
      <Container onClick={handleOverlayClick}>
        <Content overlayTop={overlayTop} overlayLeft={overlayLeft}>
          {requestList.length === 0 ? (
            <Item>
              도착한 친구 요청이 없습니다.
              <Button onClick={handleOverlayClick}> 닫기 </Button>
            </Item>
          ) : (
            requestList.map((request, index) => {
              intraRefs[index] = intraRefs[index] || React.createRef<HTMLDivElement>();
              return (
                <Item key={index}>
                  <TextFrame>
                    <Text
                      onMouseEnter={() => handleShowIntraName(request.intraName, index)}
                      onMouseLeave={() => setShowIntraName(false)}
                      ref={intraRefs[index]}
                    >
                      {request.nickName}
                    </Text>
                    님이 친구 요청을 보냈습니다.
                  </TextFrame>
                  <ButtonFrame>
                    <Button onClick={() => handleAcceptRequest(request.sendBy)}> 수락 </Button>
                    <Button onClick={() => handleDenyRequest(request.sendBy)}> 거절 </Button>
                  </ButtonFrame>
                  {showIntraName && (
                    <IntraOverlay overlayTop={intraOverlayTop} overlayLeft={overlayLeft}>
                      {intraName}
                    </IntraOverlay>
                  )}
                </Item>
              );
            })
          )}
        </Content>
      </Container>
    </>
  );
};

export default AlarmModal;

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
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Item = styled.div`
  width: 25vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #725d42;
  font-size: 1.5vh;
  font-family: 'GiantsLight';
`;

const TextFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Text = styled.div`
  font-size: 1.5vh;
  color: ${(props) => props.theme.colors.Emerald};
`;

const ButtonFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 1vh;
`;

const Button = styled.div`
  background-color: ${(props) => props.theme.colors.ivory};
  color: #725d42;
  font-size: 1.5vh;
  font-family: 'GiantsLight';
  padding: 1vh 2vh;
  border-radius: 20px;
  box-sizing: content-box;
  cursor: pointer;
`;

const IntraOverlay = styled.div<{ overlayTop: string; overlayLeft: string }>`
  position: fixed;
  top: ${(props) => props.overlayTop};
  left: ${(props) => props.overlayLeft};
  background-color: ${(props) => props.theme.colors.ivory};
  opacity: 0.5;
  color: #725d42;
  font-size: 1.5vh;
  font-family: 'GiantsLight';
  margin-left: 1vh;
  padding: 1vh 1vh;
  border-radius: 10px;
  box-sizing: content-box;
`;

import styled from 'styled-components';
import Image from 'next/image';
import Isabelle from '@/public/Login/Isabelle.png';

const NoticeModal: React.FC<{
  handleCloseModal: () => void;
  noticeMessage: string;
}> = ({ handleCloseModal, noticeMessage }) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <>
      <Container onClick={handleOverlayClick}>
        <ContentFrame onClick={handleOverlayClick}>
          <Content>
            <GuriImage src={Isabelle} alt='Isabelle' />
            <Text> {noticeMessage} </Text>
            <CompleteButtonFrame>
              <CompleteButton onClick={handleOverlayClick}> 닫기 </CompleteButton>
            </CompleteButtonFrame>
          </Content>
        </ContentFrame>
      </Container>
    </>
  );
};

export default NoticeModal;

const Container = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ContentFrame = styled.div`
  width: 80%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  position: fixed;
  width: 20vw;
  height: auto;
  background-color: ${(props) => props.theme.colors.cream};
  padding: 2vh;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GuriImage = styled(Image)`
  width: 20%;
  height: auto;
  cursor: pointer;
`;

const Text = styled.div`
  width: 90%;
  height: auto;
  padding: 5%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'GiantsLight';
  font-size: 1vw;
  line-height: normal;
  color: ${(props) => props.theme.colors.brown};
`;

const CompleteButtonFrame = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const CompleteButton = styled.div`
  width: auto;
  height: auto;
  font-family: 'GiantsLight';
  background-color: #f7cd67;
  color: #7a5025;
  padding: 0.5vw 1vw;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 1vw;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

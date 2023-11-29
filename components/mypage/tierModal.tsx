import styled from 'styled-components';
import Image from 'next/image';
import Guri from '../../public/Login/logo.png';
import { bronze, silver, gold, platinum, diamond } from './tier';

const tierModal: React.FC<{
  handleCloseModal: () => void;
  InfoButtonRect: { top: number; left: number };
}> = ({ handleCloseModal, InfoButtonRect }) => {
  const tierImages = [bronze, silver, gold, platinum, diamond];
  const tierTexts = ['브론즈', '실버', '골드', '플래티넘', '다이아몬드'];
  const tierScore = [
    '1000점 미만',
    '1100점 미만',
    '1500점 미만',
    '2000점 미만',
    '2000점 이상',
  ];
  const overlayTop = `${InfoButtonRect.top * 1.1}px`;
  const overlayLeft = `${InfoButtonRect.left * 0.5}px`;
  const infoText = '티어는 아래와 같아요 !';

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <>
      <Container onClick={handleOverlayClick}>
        <Content overlayTop={overlayTop} overlayLeft={overlayLeft}>
          <Text> {infoText} </Text>
          <InfoFrame>
            <TierFrame>
              <TierImage
                src={tierImages[0]}
                alt='Tier Image'
                width={30}
                height={30}
              />
              <TierText> {tierTexts[0]} </TierText>
              <TierScore> {tierScore[0]} </TierScore>
            </TierFrame>
            <TierFrame>
              <TierImage
                src={tierImages[1]}
                alt='Tier Image'
                width={30}
                height={30}
              />
              <TierText> {tierTexts[1]} </TierText>
              <TierScore> {tierScore[1]} </TierScore>
            </TierFrame>
            <TierFrame>
              <TierImage
                src={tierImages[2]}
                alt='Tier Image'
                width={30}
                height={30}
              />
              <TierText> {tierTexts[2]} </TierText>
              <TierScore> {tierScore[2]} </TierScore>
            </TierFrame>
            <TierFrame>
              <TierImage
                src={tierImages[3]}
                alt='Tier Image'
                width={30}
                height={30}
              />
              <TierText> {tierTexts[3]} </TierText>
              <TierScore> {tierScore[3]} </TierScore>
            </TierFrame>
            <TierFrame>
              <TierImage
                src={tierImages[4]}
                alt='Tier Image'
                width={30}
                height={30}
              />
              <TierText> {tierTexts[4]} </TierText>
              <TierScore> {tierScore[4]} </TierScore>
            </TierFrame>
          </InfoFrame>
        </Content>
      </Container>
    </>
  );
};

export default tierModal;

const Container = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div<{ overlayTop: string; overlayLeft: string }>`
  position: fixed;
  top: ${(props) => props.overlayTop};
  left: ${(props) => props.overlayLeft};
  width: 30vw;
  height: auto;
  background-color: ${(props) => props.theme.colors.cream};
  padding: 3vh 0;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vh;
`;

const Text = styled.div`
  width: 90%;
  height: auto;
  border: none;
  cursor: pointer;
  display: flex;
  font-family: 'GiantsLight';
  font-size: 2vmin;
  line-height: normal;
  color: ${(props) => props.theme.colors.brown};
`;

const InfoFrame = styled.div`
  width: 90%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TierFrame = styled.div`
  width: 15%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.4vh;
`;

const TierImage = styled(Image)`
  width: 90%;
  height: auto;
`;

const TierText = styled.div`
  color: ${(props) => props.theme.colors.brown};
  width: 100%;
  font-family: 'GiantsLight';
  vertical-align: middle;
  text-align: center;
  font-size: 1.5vmin;
`;

const TierScore = styled.div`
  color: ${(props) => props.theme.colors.brown};
  width: 100%;
  font-family: 'GiantsLight';
  vertical-align: middle;
  text-align: center;
  font-size: 1.1vmin;
`;

const CompleteButtonFrame = styled.div`
  width: 90%;
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

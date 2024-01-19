import type { NextPage } from 'next';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Container from '@/components/layout/columnNevLayout';
import General from '@/public/Main/generalgame.jpg';
import Rank from '@/public/Main/rankgame.jpg';
import Chat from '@/public/Main/chat.jpg';
import Ranking from '@/public/Main/ranking.jpg';

const Home: NextPage = () => {
  const router = useRouter();

  const handleRoute = (route: string) => {
    router.push(route);
  };

  return (
    <Container>
      <RowFrame>
        <CardFrame onClick={() => handleRoute('/generalLobby')}>
          <CardImageFrame imageUrl={General.src} />
          <FooterFrame>
            <TitleText> General Game </TitleText>
            <InfoText> 일반게임 시작하기 </InfoText>
          </FooterFrame>
        </CardFrame>
        <CardFrame onClick={() => handleRoute('/rankLobby')}>
          <CardImageFrame imageUrl={Rank.src} />
          <FooterFrame>
            <TitleText> Rank Game </TitleText>
            <InfoText> 랭크게임 시작하기 </InfoText>
          </FooterFrame>
        </CardFrame>
      </RowFrame>
      <RowFrame>
        <CardFrame onClick={() => handleRoute('/chat')}>
          <CardImageFrame imageUrl={Chat.src} />
          <FooterFrame>
            <TitleText> Chatting Room </TitleText>
            <InfoText> 단체채팅 참여하기 </InfoText>
          </FooterFrame>
        </CardFrame>
        <CardFrame onClick={() => handleRoute('/ranking')}>
          <CardImageFrame imageUrl={Ranking.src} />
          <FooterFrame>
            <TitleText> Top Ranking </TitleText>
            <InfoText> 전체 순위 </InfoText>
          </FooterFrame>
        </CardFrame>
      </RowFrame>
    </Container>
  );
};

export default Home;

const RowFrame = styled.div`
  width: 70%;
  height: 40%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

const CardFrame = styled.div`
  width: 50%;
  height: 90%;
  background-color: ${(props) => props.theme.colors.cream};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  margin: 2%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1%;
  justify-content: space-between;
  cursor: pointer;
  box-sizing: border-box;
  gap: 5%;

  &:hover {
    transform: scale(1.03);
  }
`;

const CardImageFrame = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 80%;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const FooterFrame = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
  gap: 1vh;
`;

const TitleText = styled.div`
  font-family: 'Giants';
  font-size: 3vh;
  color: ${(props) => props.theme.colors.brown};
`;

const InfoText = styled.div`
  font-family: 'GiantsLight';
  font-size: 1.5vh;
  color: ${(props) => props.theme.colors.brown};
`;

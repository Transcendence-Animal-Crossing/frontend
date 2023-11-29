import styled from 'styled-components';
import Image from 'next/image';
import { handleSetUserAvatar } from '../../utils/avatarUtils';

interface UserData {
  id: number;
  nickName: string;
  intraName: string;
  avatar: string;
}

const GameFooter: React.FC<{
  leftUser: UserData;
  rightUser: UserData;
  leftScore: number;
  rightScore: number;
}> = ({ leftUser, rightUser, leftScore, rightScore }) => {

  return (
    <GameContent>
      <UserInfoFrame sort='flex-start'>
        <UserImage
          src={handleSetUserAvatar(leftUser.avatar)}
          alt='Uploaded Image'
          width={300}
          height={300}
        />
        <UserTextFrame sort='flex-start'>
          <Text textsize='1.1vw'> {leftUser.nickName} </Text>
          <Text textsize='0.7vw'> {leftUser.intraName} </Text>
        </UserTextFrame>
      </UserInfoFrame>
      <ScoreBoardFrame>
        <ScoreBoard color='1'> {leftScore} </ScoreBoard>
        <ScoreBoard color='2'> {rightScore} </ScoreBoard>
      </ScoreBoardFrame>
      <UserInfoFrame sort='flex-end'>
        <UserTextFrame sort='flex-end'>
          <Text textsize='1.1vw'> {rightUser.nickName} </Text>
          <Text textsize='0.7vw'> {rightUser.intraName} </Text>
        </UserTextFrame>
        <UserImage
          src={handleSetUserAvatar(rightUser.avatar)}
          alt='Uploaded Image'
          width={300}
          height={300}
        />
      </UserInfoFrame>
    </GameContent>
  );
};

export default GameFooter;

const GameContent = styled.div`
  width: 70%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 1%;
`;

const ScoreBoardFrame = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ScoreBoard = styled.div<{ color: string }>`
  width: 40%;
  height: 100%;
  background-color: ${(props) => {
    switch (props.color) {
      case '1':
        return props.theme.colors.blue;
      case '2':
        return props.theme.colors.red;
    }
  }};
  color: ${(props) => props.theme.colors.cream};
  font-size: 3vh;
  font-family: 'GiantsLight';
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const UserInfoFrame = styled.div<{ sort: string }>`
  width: 20%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => props.sort};
  gap: 1vw;
`;

const UserImage = styled(Image)`
  width: 3vw;
  height: auto;
  border-radius: 50px;
`;

const UserTextFrame = styled.div<{ sort: string }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => props.sort};
  justify-content: center;
  gap: 0.5vw;
`;

const Text = styled.div<{ textsize: string }>`
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'GiantsLight';
  color: ${(props) => props.theme.colors.brown};
  font-size: ${(props) => props.textsize};
`;

import styled from 'styled-components';
import Paging from './paging';

const AchievementContainer = ({
  achieveList,
  refresh,
}: {
  achieveList: number[];
  refresh: boolean;
}) => {
  return (
    <AchievementFrame>
      <AchievementHeader>Achievements</AchievementHeader>
      <AchievementBody>
        <Paging achieveList={achieveList} refresh={refresh} />
      </AchievementBody>
    </AchievementFrame>
  );
};

export default AchievementContainer;

const AchievementFrame = styled.div`
  margin: 3%;
  width: 100%;
  height: 35%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3%;
`;

const AchievementHeader = styled.div`
  width: 100%;
  height: 15%;
  text-align: center;
  color: ${(props) => props.theme.colors.brown};
  font-family: 'GiantsLight';
  font-size: 2vh;
  flex-direction: row;
  align-items: center;
`;

const AchievementBody = styled.div`
  width: 100%;
  height: 85%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5%;
`;

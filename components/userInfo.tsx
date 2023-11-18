import styled from 'styled-components';
import Image from 'next/image';

const UserInfo: React.FC<{
  nickName: string;
  intraName: string;
  avatar: string;
  width: number;
  height: number;
}> = ({ nickName, intraName, avatar, width, height }) => {
  return (
    <UserInfoFrame width={width} height={height}>
      <ProfileImage src={avatar} alt='Profile Image' width={100} height={100} />
      <NameFrame>
        <NickNameFrame> {nickName} </NickNameFrame>
        <IntraNameFrame> {intraName} </IntraNameFrame>
      </NameFrame>
    </UserInfoFrame>
  );
};

export default UserInfo;

const UserInfoFrame = styled.div<{ width: number; height: number }>`
  width: ${(props) => props.width}%;
  height: ${(props) => props.height}vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10%;
  font-size: ${(props) => props.height}vh;
`;

const ProfileImage = styled(Image)`
  width: auto;
  height: 85%;
  border-radius: 50px;
`;

const NameFrame = styled.div`
  width: 70%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'GiantsLight';
  font-size: 100%;
  gap: 15%;
  color: ${(props) => props.theme.colors.brown};
`;

const NickNameFrame = styled.div`
  width: 100%;
  font-size: 30%;
`;

const IntraNameFrame = styled.div`
  width: 100%;
  font-size: 20%;
`;

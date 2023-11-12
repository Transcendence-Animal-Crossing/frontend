import styled from "styled-components";
import Image from "next/image";

const UserInfo: React.FC<{
  nickName: string;
  intraName: string;
  avatar: string;
  size: number;
}> = ({ nickName, intraName, avatar, size }) => {
  return (
    <UserInfoFrame size={size}>
      <ProfileImage src={avatar} alt="Profile Image" width={100} height={100} />
      <NameFrame>
        <NickNameFrame> {nickName} </NickNameFrame>
        <IntraNameFrame> {intraName} </IntraNameFrame>
      </NameFrame>
    </UserInfoFrame>
  );
};

export default UserInfo;

const UserInfoFrame = styled.div<{ size: number }>`
  width: ${(props) => props.size}%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7%;
`;

const ProfileImage = styled(Image)`
  width: 15%;
  height: auto;
  border-radius: 50px;
`;

const NameFrame = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "GiantsLight";
  color: ${(props) => props.theme.colors.brown};
`;

const NickNameFrame = styled.div`
  width: 100%;
  font-size: small;
`;

const IntraNameFrame = styled.div`
  width: 100%;
  font-size: x-small;
  margin-top: 3%;
`;

import styled from 'styled-components';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import setting from '../../public/Icon/setting.png';

const myProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSetUserAvatar = () => {
    const apiUrl = 'http://localhost:8080/';
    return apiUrl + session?.user.avatar;
  };

  const handleUserPage = () => {
    router.push(`http://localhost:3000/profile/${session?.user?.id}`);
  };

  return (
    <>
      <ProfileFrame>
        <ProfileInfoFrame onClick={handleUserPage}>
          <ProfileImage src={handleSetUserAvatar()} alt='Uploaded Image' width={300} height={300} />
          <ProfileTextFrame>
            <Text textsize='1.1vw'> {session?.user?.nickName} </Text>
            <Text textsize='0.7vw'> {session?.user?.intraName} </Text>
          </ProfileTextFrame>
        </ProfileInfoFrame>
        <IconImage src={setting} alt='setting' width={300} height={300} />
      </ProfileFrame>
    </>
  );
};

export default myProfile;

const ProfileFrame = styled.div`
  width: 100%;
  height: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5%;
  box-sizing: border-box;
`;

const ProfileInfoFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1vw;
  cursor: pointer;
`;

const ProfileImage = styled(Image)`
  width: 4vw;
  height: auto;
  border-radius: 50px;
`;

const ProfileTextFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

const IconImage = styled(Image)`
  width: 3vh;
  height: auto;
`;

import styled from 'styled-components';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import setting from '../../public/Icon/setting.png';
import { handleSetUserAvatar } from '../../utils/avatarUtils';
import SettingModal from './settingModal';

const myProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [isOpenSetting, setOpenSetting] = useState<boolean>(false);
  const [SettingButtonRect, setSettingButtonRect] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const SettingButtonRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (SettingButtonRef.current) {
      const buttonRect = SettingButtonRef.current.getBoundingClientRect();
      setSettingButtonRect({
        top: buttonRect.top,
        left: buttonRect.left,
      });
    }
  }, []);

  const handleSetUserAvatar = () => {
    const apiUrl = 'http://localhost:8080/';
    return apiUrl + session?.user.avatar;
  };

  const handleUserPage = () => {
    router.push(`http://localhost:3000/profile/${session?.user?.id}`);
  };

  const handleSettingModal = () => {
    setOpenSetting(true);
  };

  const handleCloseSetting = () => {
    setOpenSetting(false);
  };

  return (
    <>
      <ProfileFrame>
        <ProfileInfoFrame onClick={handleUserPage}>
          <ProfileImage
            src={handleSetUserAvatar(session?.user?.avatar)}
            alt='Uploaded Image'
            width={300}
            height={300}
          />
          <ProfileTextFrame>
            <Text textsize='1.1vw'> {session?.user?.nickName} </Text>
            <Text textsize='0.7vw'> {session?.user?.intraName} </Text>
          </ProfileTextFrame>
        </ProfileInfoFrame>
        <IconImage
          src={setting}
          alt='setting'
          width={300}
          height={300}
          onClick={handleSettingModal}
          ref={SettingButtonRef}
        />
      </ProfileFrame>
      {isOpenSetting && (
        <SettingModal
          handleCloseModal={handleCloseSetting}
          SettingButtonRect={SettingButtonRect}
          userId={session?.user?.id}
        />
      )}
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
  cursor: pointer;
`;

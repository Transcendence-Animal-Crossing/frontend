import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { useState, useEffect } from "react";
import { p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12 } from "./profile";
import pen from "../../../public/Icon/pen.png";

const InfoContainer: React.FC<{
  checknick: boolean;
  onNicknameChange: (newNickname: string) => void;
  handleImageChange: (newIndex: number) => void;
}> = ({ checknick, onNicknameChange, handleImageChange }) => {
  const [profileFrameWidth, setProfileFrameWidth] = useState(0);
  const imagePaths = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12];

  const handleProfileFrameWidth = () => {
    const profileFrame = document.getElementById("profile-frame");
    if (profileFrame) {
      setProfileFrameWidth(profileFrame.clientWidth);
    }
  };

  const calculateImageWidth = () => {
    return (profileFrameWidth - 90) / 4;
  };

  return (
    <InfoFrame>
      <NicknameFrame>
        <InputFrame>
          <PenFrame>
            <PenImage src={pen} alt="pen" />
          </PenFrame>
          <Input
            type="text"
            placeholder="NickName"
            onChange={(e) => onNicknameChange(e.target.value)}
            maxLength={10}
            required
          />
        </InputFrame>
        {checknick ? <Text> 중복된 닉네임입니다. </Text> : null}
      </NicknameFrame>
      <DivisionBar />
      <ProfileFrame id="profile-frame" onLoad={handleProfileFrameWidth}>
        {imagePaths.map((imagePath, index) => (
          <ProfileImage
            key={index}
            src={imagePath}
            alt={`Image ${index + 1}`}
            width={calculateImageWidth()}
            onClick={() => handleImageChange(index)}
          />
        ))}
      </ProfileFrame>
    </InfoFrame>
  );
};

export default InfoContainer;

const InfoFrame = styled.div`
  width: 40%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5%;
`;

const NicknameFrame = styled.div`
  width: 80%;
  height: auto;
  gap: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const InputFrame = styled.div`
  width: 90%;
  height: auto;
  background-color: ${(props) => props.theme.colors.ivory};
  border-radius: 20px;
  padding: 5%;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PenFrame = styled.div`
  width: 2vw;
  margin-right: 3%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const PenImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Input = styled.input.attrs({ required: true })`
  width: 100%;
  height: auto;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.brown};
  font-family: "BMHANNAAir";
  font-size: 1.5vw;
  &:focus {
    outline: none;
  }
`;

const Text = styled.div`
  color: #fc736d;
  font-family: "BMHANNAAir";
  font-size: 1vw;
`;

const DivisionBar = styled.div`
  width: 80%;
  height: 1.5px;
  background-color: ${(props) => props.theme.colors.brown};
`;

const ProfileFrame = styled.div`
  width: 80%;
  height: 60%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  overflow: auto;
`;

const ProfileImage = styled(Image)`
  height: auto;
  margin: 10px;
`;
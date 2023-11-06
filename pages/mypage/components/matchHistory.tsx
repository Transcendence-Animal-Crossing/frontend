import styled from "styled-components";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import home from "../../../public/Icon/home.png";
import axiosInstance from "../../../utils/axiosInstance";

const MatchHistoryContainer = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [mode, setMode] = useState("rank");
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect(() => {
    getMatchHistory();
  }, []);

  useEffect(() => {
    getMatchHistory();
  }, [mode]);

  const getMatchHistory = async () => {
    try {
      const userId = session?.user.user_id;
      const response = await axiosInstance.get("/games/" + mode, {
        params: {
          id: userId,
          offset: 0,
        },
      });
      console.log("getMatchHistory() response");
      console.log(response);
      await setMatchHistory(response.data);
    } catch (error) {
      console.log("Error occured in getMatchHistory()");
      console.log(error);
    }
  };

  const handleRouteLobby = async () => {
    router.push("/");
  };

  return (
    <MatchHistoryFrame>
      <MatchHistoryHeader>
        <Mode>
          <ModeButton onClick={() => setMode("general")}>
            <div className={`${mode === "general" ? "select" : "unselect"}`}>
              일반
            </div>
          </ModeButton>
          <ModeButton onClick={() => setMode("rank")}>
            <div className={`${mode === "rank" ? "select" : "unselect"}`}>
              랭크
            </div>
          </ModeButton>
        </Mode>
        <Button onClick={handleRouteLobby}>
          <InfoImage src={home} alt="home" />
        </Button>
      </MatchHistoryHeader>
      <MatchHistoryBody></MatchHistoryBody>
    </MatchHistoryFrame>
  );
};

export default MatchHistoryContainer;

const MatchHistoryFrame = styled.div`
  margin: 3%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1%;
`;

const MatchHistoryHeader = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Mode = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10%;
  gap: 5%;
`;

const ModeButton = styled.button`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.lightbrown};
  font-family: "GiantsLight";
  border-radius: 15px;
  border: none;
  cursor: pointer;
  .select {
    border-radius: 15px;
    background-color: ${(props) => props.theme.colors.lightgold};
    color: ${(props) => props.theme.colors.white};
  }
  .unselect {
    border-radius: 15px;
    background-color: ${(props) => props.theme.colors.cream};
    color: ${(props) => props.theme.colors.lightgold};
  }
`;

const Button = styled.div`
  height: 30%;
  width: auto;
  padding: 0.5vh 1.5vh;
  background-color: ${(props) => props.theme.colors.beige};
  border-radius: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 5%;
`;

const InfoImage = styled(Image)`
  height: 100%;
  width: auto;
  cursor: pointer;
`;

const MatchHistoryBody = styled.div`
  height: 90%;
  width: 100%;
  background-color: ${(props) => props.theme.colors.beige};
`;

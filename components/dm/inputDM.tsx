import styled from 'styled-components';
import Image from 'next/image';
import send from '../../public/Chat/send.png';

const InputDmContainer: React.FC<{
  messageText: string;
  setMessageText: (newMessage: string) => void;
  handleKeyPress: (e: any) => void;
  sendMessage: () => void;
}> = ({ messageText, setMessageText, handleKeyPress, sendMessage }) => {
  return (
    <InputFrame>
      <Input
        type='text'
        placeholder='메세지를 입력하세요'
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <ButtonFrame onClick={sendMessage}>
        <ButtonImage src={send} alt='send' />
      </ButtonFrame>
    </InputFrame>
  );
};

export default InputDmContainer;

const InputFrame = styled.div`
  width: 100%;
  height: 10%;
  background-color: ${(props) => props.theme.colors.ivory};
  border-radius: 10px;
  padding: 1.5%;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  /* box-sizing: border-box; */
`;

const Input = styled.input.attrs({ required: true })`
  width: 100%;
  height: auto;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.brown};
  font-family: 'BMHANNAAir';
  font-size: 2vh;
  &:focus {
    outline: none;
  }
`;

const ButtonFrame = styled.div`
  width: 3vw;
  height: 3.5vh;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonImage = styled(Image)`
  height: 3vh;
  width: auto;
  cursor: pointer;
`;

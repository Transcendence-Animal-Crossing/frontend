import styled from 'styled-components';
import { useSession } from 'next-auth/react';

const MessageContainer: React.FC<{ messages: array }> = ({ messages }) => {
  const { data: session } = useSession();

  return (
    <MessageListFrame>
      {messages.map((message, index) => (
        <MessageFrame senderId={message.senderId} currentUser={session?.user.user_id}>
          <Message key={index} senderId={message.senderId} currentUser={session?.user.user_id}>
            {message.senderId} : {message.text}
          </Message>
        </MessageFrame>
      ))}
    </MessageListFrame>
  );
};

export default MessageContainer;

const MessageListFrame = styled.div`
  width: 90%;
  height: auto;
  padding: 2%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  overflow-x: hidden;
`;

const MessageFrame = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: ${(props) => (props.senderId === props.currentUser ? 'row-reverse' : 'row')};
  align-items: center;
  justify-content: space-between;
`;

const Message = styled.div`
  width: auto;
  max-width: 50%;
  word-wrap: break-word;
  height: auto;
  background-color: ${(props) =>
    props.senderId === props.currentUser ? props.theme.colors.brown : props.theme.colors.ivory};
  color: ${(props) =>
    props.senderId === props.currentUser ? props.theme.colors.ivory : props.theme.colors.brown};
  font-family: 'GiantsLight';
  font-size: 2vh;
  border-radius: 10px;
  padding: 2%;
  margin: 0.5% 0;
`;

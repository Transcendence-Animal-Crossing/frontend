import useDigitInput from 'react-digit-input';
import styled from 'styled-components';

export default function TwoFactAuth({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const digits = useDigitInput({
    acceptedCharacters: /^[0-9]$/,
    length: 7,
    value,
    onChange,
  });

  return (
    <InputFrame>
      <Input inputMode='decimal' {...digits[0]} />
      <Input inputMode='decimal' {...digits[1]} />
      <Input inputMode='decimal' {...digits[2]} />
      <Input inputMode='decimal' {...digits[3]} />
      <Input inputMode='decimal' {...digits[4]} />
      <Input inputMode='decimal' {...digits[5]} />
      <Input inputMode='decimal' {...digits[6]} />
    </InputFrame>
  );
}

const InputFrame = styled.div`
  width: 90%;
  height: 20%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 3%;
`;

const Input = styled.input.attrs({ required: true })`
  width: 10%;
  height: 100%;
  color: ${(props) => props.theme.colors.brown};
  background-color: ${(props) => props.theme.colors.ivory};
  border-radius: 10px;
  border: none;
  &:focus {
    outline: none;
  }
  font-family: 'GiantsLight';
  font-size: 2vmin;
  text-align: center;
`;

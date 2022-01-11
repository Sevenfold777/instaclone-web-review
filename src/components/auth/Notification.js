import styled from "styled-components";

const SNotification = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 3px;
  margin-top: 15px;
  max-width: 240px;
  width: 100%;
  padding: 0px 3px 3px 3px;
  border-bottom: 1.8px solid ${(props) => props.theme.borderColor};
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

function Notification({ message }) {
  return message === "" || !message ? null : (
    <SNotification>{message}</SNotification>
  );
}

export default Notification;

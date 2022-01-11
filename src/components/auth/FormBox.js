import styled from "styled-components";
import { BaseBox } from "../shared";

const Container = styled(BaseBox)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 35px 40px 20px 40px;
  margin-bottom: 10px;
  div {
    color: ${(props) => props.theme.logoColor};
  }
  form {
    display: flex;
    justify-items: center;
    align-items: center;
    flex-direction: column;
    margin-top: 35px;
    width: 100%;
  }
`;

function FormBox({ children }) {
  return <Container>{children}</Container>;
}

export default FormBox;

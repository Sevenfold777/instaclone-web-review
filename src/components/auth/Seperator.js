import styled from "styled-components";

const SSeparator = styled.div`
  margin: 20px 0px 20px 0px;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center; // vertically center
  width: 100%;
  div {
    width: 100%;
    height: 1px;
    background-color: #8e8e8e;
    opacity: 0.5;
  }
  span {
    margin: 0px 10px;
    color: #8e8e8e;
    font-weight: 600;
    font-size: 12px;
  }
`;

function Separator() {
  return (
    <SSeparator>
      <div></div>
      <span>Or</span>
      <div></div>
    </SSeparator>
  );
}

export default Separator;

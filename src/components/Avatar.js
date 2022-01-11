import styled from "styled-components";

const styledAvatar = styled.div`
  width: ${(props) => (props.lg ? "30px" : "25px")};
  height: ${(props) => (props.lg ? "30px" : "25px")};
  border-radius: 50%;
  background-color: #2c2c2c;
  overflow: hidden;
`;

const Img = styled.img`
  max-width: 100%;
`;

function Avatar({ url = "", lg = false }) {
  // DEFAULT PARAMETER: url == "", lg == false;
  return (
    <styledAvatar lg={lg}>{url !== "" ? <Img src={url} /> : null}</styledAvatar>
  );
}

export default Avatar;

import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const lightTheme = {
  accent: "#0095f6",
  bgColor: "#FAFAFA",
  borderColor: "rgb(219, 219, 219)",
  fontColor: "rgb(38, 38, 38)",
  textColor: "rgb(142,142,142)",
  logoColor: "rgb(38,38,38)",
};
export const darkTheme = {
  accent: "#0095f6",
  bgColor: "#2c2c2c",
  borderColor: "#FAFAFA",
  fontColor: "rgb(38, 38, 38)",
  textColor: "rgb(232,232,232)",
  logoColor: "rgb(232,232,232)",
};

export const GlobalStyles = createGlobalStyle`
    // reset Default Styles
    ${reset}

    // for all/every box, box-sizing: border-box
    * {
        box-sizing: border-box;
    }

    // remove all the properties from input
    input {
        all: unset;
    }

    // basic body definitions
    body{
        background-color: ${(props) => props.theme.bgColor};
        font-size: 14px;
        font-family: 'Open Sans', sans-serif;
        color: ${(props) => props.theme.fontColor};
    }

    a {
        text-decoration: none;  // all the links not underlined default
        color: inherit;
    }
`;

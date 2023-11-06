import { DefaultTheme } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      ivory: string;
      brown: string;
      brown05: string;
      pink: string;
      white: string;
      Emerald: string;
      orange: string;
      beige: string;
      cream: string;
      gold: string;
      lightgold: string;
      lightbrown: string;
    };
  }
}

export const theme: DefaultTheme = {
  colors: {
    ivory: "#f8f4e8",
    brown: "#8a7b66",
    brown05: "rgba(138, 123, 102, 0.5)",
    pink: "#E2826A",
    white: "#FFFFF7",
    Emerald: "#04AFA6",
    orange: "#F39801",
    beige: "rgba(255, 251, 231, 0.5);",
    cream: "#FFFBE7",
    gold: "#BEA745",
    lightgold: "#C1B175",
    lightbrown: "#e9e2c7",
  },
};

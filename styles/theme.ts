import { DefaultTheme } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      ivory: string;
      brown: string;
      brown05: string;
    };
  }
}

export const theme: DefaultTheme = {
  colors: {
    ivory: "#f8f4e8",
    brown: "#8a7b66",
    brown05: "rgba(138, 123, 102, 0.5)",
  },
};

import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4d87af",
    },
    secondary: {
      main: "#e89b25",
    },
    background: {
      default: "#fbfbf9",
    },
    text: {
      primary: "hsl(0, 0%, 5%)",
      secondary: "hsl(0, 0%, 20%)",
    },
  },
  typography: {
    fontFamily: "'Fira Sans', Arial, sans-serif",
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        margin: "normal",
      },
    },
  },
});

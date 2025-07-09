import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      // or #a6c4d8
      main: "#83acc8",
    },
    secondary: {
      // or #f3ca8c
      main: "#eeb55e",
    },
    background: {
      default: "#3b3b39",
    },
    text: {
      primary: "hsl(0, 0%, 95%)",
      secondary: "hsl(0, 0%, 80%)",
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
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#83acc8",
          boxShadow: "none",
        },
      },
    },
  },
});

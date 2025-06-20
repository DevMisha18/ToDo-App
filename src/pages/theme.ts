import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#4B9CD3",
      contrastText: "#fff",
    },
    secondary: {
      main: "#FF6F61",
      contrastText: "#fff",
    },
    background: {
      default: "#f4f6fb",
      paper: "#fff",
    },
    success: {
      main: "#43a047",
    },
    error: {
      main: "#e53935",
    },
  },
  typography: {
    fontFamily: "'Fira Sans', Arial, sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    body1: {
      fontSize: "1.1rem",
    },
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

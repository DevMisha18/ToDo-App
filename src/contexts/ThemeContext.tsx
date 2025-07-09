import React, { createContext, useContext, useState } from "react";
import { lightTheme, darkTheme } from "@/themes";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";

type themeMode = "light" | "dark";
type themeContextType = {
  mode: themeMode;
  toggleTheme: () => void;
};

export const themeContext = createContext<themeContextType>({
  mode: "dark",
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(themeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<themeMode>("dark");
  const toggleTheme = () =>
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  return (
    <themeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </themeContext.Provider>
  );
};

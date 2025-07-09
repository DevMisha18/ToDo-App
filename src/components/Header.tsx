import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import { useThemeContext } from "@/contexts/ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export function Header() {
  const { mode, toggleTheme } = useThemeContext();
  return (
    <AppBar position="static" color="primary" elevation={3}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          ToDo App
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton onClick={toggleTheme}>
            {mode === "dark" ? (
              <DarkModeIcon />
            ) : (
              <LightModeIcon color="secondary" />
            )}
          </IconButton>
          {/* Add more header actions/icons here if needed */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

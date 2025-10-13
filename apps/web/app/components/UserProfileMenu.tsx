import { Close } from "@mui/icons-material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { usePathname } from "next/navigation";
import React, { useContext, useState } from "react";

import { ThemeContext } from "@/app/contexts/Theme";
import { useAppUser } from "@/app/hooks/useAppUser";
import ToggleMode from "@/app/icons/toggle-mode.svg";

export const UserProfileMenu = () => {
  const pathname = usePathname();
  const { mode, setMode } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const { user, authUser } = useAppUser();

  const toggleTheme = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", next);
    }
  };

  const toggleUserProfile = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="User profile and settings">
        <IconButton onClick={toggleUserProfile} color="inherit">
          <Box component={AccountCircle} sx={{ color: "text.secondary" }} />
        </IconButton>
      </Tooltip>
      <Drawer
        variant="temporary"
        // anchorEl={anchorEl}
        anchor="right"
        elevation={1}
        open={openMenu}
        onClose={handleClose}
        onClick={handleClose}
        // transformOrigin={{ horizontal: "right", vertical: "top" }}
        // anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: { width: 300 },
        }}
        sx={{
          "& ul": {
            paddingY: "0px",
          },
          "& .MuiButtonBase-root:last-of-type": {
            borderTop: `1px solid ${"palette.grey[300]"}`,
          },
        }}
      >
        <Box
          sx={{ width: "100%", display: "flex", p: 2 }}
          justifyContent="right"
          alignItems="center"
        >
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <List>
          {user && authUser && <MenuItem disabled>Logged in as:</MenuItem>}
          {user && authUser && <MenuItem disabled>{user?.email}</MenuItem>}
          {user && !authUser && <MenuItem>Guest Mode</MenuItem>}
          {user && <MenuItem>{}</MenuItem>}
          {authUser && (
            <MenuItem component="a" href="/api/auth/logout?returnTo=/">
              Logout
            </MenuItem>
          )}
          {!authUser && (
            <MenuItem
              component="a"
              href={`/api/auth/login?returnTo=${pathname}`}
            >
              Login
            </MenuItem>
          )}

          {user && <Divider />}

          <MenuItem onClick={toggleTheme}>
            <Tooltip title="Toggle light/dark mode">
              <>
                Toggle theme{" "}
                <IconButton color="inherit">
                  <Box
                    component={ToggleMode}
                    sx={{ color: "text.secondary" }}
                  />
                </IconButton>
              </>
            </Tooltip>
          </MenuItem>
        </List>
      </Drawer>
    </>
  );
};

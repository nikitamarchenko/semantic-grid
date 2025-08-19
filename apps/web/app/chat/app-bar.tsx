"use client";

import AccountCircle from "@mui/icons-material/AccountCircle";
import type { AppBarProps, SelectChangeEvent } from "@mui/material";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Stack,
  styled,
  Toolbar,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

import { createSession } from "@/app/actions";
import type { TModel } from "@/app/contexts/App";
import { AppContext, DBs, Flows, Models } from "@/app/contexts/App";
import { ThemeContext } from "@/app/contexts/Theme";
import { byTime, toChatHistoryEntry } from "@/app/helpers/nav";
import { useAppUser } from "@/app/hooks/useAppUser";
import { useUserSessions } from "@/app/hooks/useUserSessions";

// import Alerts from '../alerts';

interface StyledAppBarProps extends AppBarProps {
  open?: boolean;
}

export const drawerWidth = 232;
export const contextDrawerWidth = 450;

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<StyledAppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const ConstantAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<StyledAppBarProps>(() => ({}));

const ApplicationBar = () => {
  const router = useRouter();
  const { mode, setMode, isLarge } = useContext(ThemeContext);
  const {
    user,
    authUser,
    error,
    canContinueAsAuthUser,
    canContinueAsGuest,
    isLoading,
  } = useAppUser();
  const {
    model,
    setModel,
    flow,
    setFlow,
    db,
    setDB,
    setNavOpen,
    setContextOpen,
    dialogOpen,
    setDialogOpen,
    setCurrentMessage,
    setStoredModelName,
    setStoredFlowName,
    setStoredDBName,
  } = useContext(AppContext);
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { data, error: dataError, mutate } = useUserSessions();

  useEffect(() => {
    if (!isLoading) {
      if (!canContinueAsAuthUser && !canContinueAsGuest && !dialogOpen) {
        setMessage("You need to request access to continue");
      } else {
        setMessage("");
      }
    }
  }, [canContinueAsAuthUser, canContinueAsGuest, dialogOpen, isLoading]);

  const openMenu = Boolean(anchorEl);
  const chatHistory = (data || [])
    .sort(byTime)
    .map(toChatHistoryEntry)
    .filter((s: any) => !s.tags.includes("hidden"));

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", mode === "dark" ? "light" : "dark");
    }
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setNavOpen((o) => !o);
  };

  const handleModelChange = (event: SelectChangeEvent) => {
    setModel(
      (Models[event.target.value as string] as TModel) ||
        Object.values(Models).find((m) => m.value === event.target.value),
    );
    setStoredModelName?.(event.target.value as string);
  };

  const handleFlowChange = (event: SelectChangeEvent) => {
    setFlow(Flows[event.target.value as string] as TModel);
    setStoredFlowName?.(event.target.value as string);
  };

  const handleDBChange = (event: SelectChangeEvent) => {
    setDB(
      (DBs[event.target.value as string] as TModel) ||
        Object.values(DBs).find((m) => m.value === event.target.value),
    );
    setStoredDBName?.(event.target.value as string);
  };

  const onSetNewCurrentChat = async () => {
    if (user?.sub) {
      // use name of last used chat
      const lastUsedName = chatHistory.sort(
        (a: any, b: any) => b.lastUpdated - a.lastUpdated,
      )?.[0]?.topic;
      // check if lastUseName ends in a number
      const lastNumber = lastUsedName?.match(/(\d+)$/);
      const newNumber = lastNumber ? parseInt(lastNumber[0]) + 1 : 1;
      try {
        const session = await createSession({
          name: `chat${newNumber}`,
          tags: "test",
        });
        await mutate();
        if (session) {
          console.log("new session", session.session_id);
          router.replace(`/chat/${session.session_id}`);
          // await updatePage({ sessionId: session.session_id });
          setCurrentMessage(null);
          setContextOpen(false);
          if (!isLarge) {
            setNavOpen(false);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const imgSrc = () => {
    if (!isLarge) return "/apegpt-logo-mark.png";
    return mode === "dark"
      ? "/apegpt-appbar-logo-inverted.svg"
      : "/apegpt-appbar-logo.svg";
  };

  const AppBar = isLarge ? StyledAppBar : ConstantAppBar;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      {error && (
        <Alert severity="error" variant="filled">
          {error.message}
        </Alert>
      )}
      {message && (
        <Alert
          severity="warning"
          variant="filled"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setDialogOpen(true)}
            >
              Request Access
            </Button>
          }
        >
          {message}
        </Alert>
      )}
      {/* <Alerts /> */}
      <Toolbar sx={{ height: "78px" }}>
        <Stack
          direction="row"
          sx={{ flexGrow: 1, alignItems: "center" }}
          spacing={1}
        >
          <Box
            component={Link}
            href="/chat"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <img src={imgSrc()} alt="Logo" style={{ height: "40px" }} />
          </Box>
          <Tooltip title="Open chat selector">
            <span>
              <IconButton
                disableRipple
                disableTouchRipple
                disableFocusRipple
                disabled={!user}
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
              >
                <img
                  src="/icons/chat-selector.svg"
                  alt="open chat selector"
                  style={{ height: "24px" }}
                />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Start new chat">
            <span>
              <IconButton
                disableRipple
                disableTouchRipple
                disableFocusRipple
                disabled={!user}
                aria-label="new chat"
                onClick={onSetNewCurrentChat}
                edge="start"
              >
                <img
                  src="/icons/new-chat.svg"
                  alt="start new chat"
                  style={{ height: "24px" }}
                />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
        <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
          <Tooltip title="Share this chat">
            <IconButton
              disableRipple
              disableTouchRipple
              disableFocusRipple
              onClick={() => {}}
              color="inherit"
            >
              <img
                src="/icons/share.svg"
                alt="share chat"
                style={{ height: "24px" }}
              />
            </IconButton>
          </Tooltip>
          <FormControl>
            <Stack direction="row" spacing={1}>
              <Select
                size="small"
                labelId="ai-model-select-label"
                id="ai-model-select"
                value={model.value}
                onChange={handleModelChange}
                sx={{ minWidth: 60 }}
              >
                {Object.values(Models).map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
              <Select
                size="small"
                labelId="ai-flow-select-label"
                id="ai-flow-select"
                value={flow.value}
                onChange={handleFlowChange}
                sx={{ minWidth: 60 }}
              >
                {Object.values(Flows).map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
              <Select
                size="small"
                labelId="ai-db-select-label"
                id="ai-db-select"
                value={db.value}
                onChange={handleDBChange}
                sx={{ minWidth: 30 }}
              >
                {Object.values(DBs).map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </FormControl>
          <Tooltip title="Toggle light/dark mode">
            <IconButton
              disableRipple
              disableTouchRipple
              disableFocusRipple
              onClick={toggleTheme}
              color="inherit"
            >
              <img
                src="/icons/toggle-mode.svg"
                alt="toggle dark light mode"
                style={{ height: "24px" }}
              />
            </IconButton>
          </Tooltip>
          <IconButton
            disableRipple
            disableTouchRipple
            disableFocusRipple
            onClick={handleClick}
          >
            {user ? (
              <Avatar sx={{ width: 26, height: 26 }} src={user.picture || ""} />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            elevation={1}
            open={openMenu}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            sx={{
              "& ul": {
                paddingY: "0px",
              },
              "& .MuiButtonBase-root:last-of-type": {
                borderTop: `1px solid ${"palette.grey[300]"}`,
              },
            }}
          >
            {user && authUser && <MenuItem>Profile</MenuItem>}
            {user && !authUser && <MenuItem>Guest Mode</MenuItem>}
            {user && <Divider />}
            {user && <MenuItem>{user?.email}</MenuItem>}
            {authUser && (
              <MenuItem component="a" href="/api/auth/logout">
                Logout
              </MenuItem>
            )}
            {!authUser && (
              <MenuItem component="a" href="/api/auth/login">
                Login
              </MenuItem>
            )}
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default ApplicationBar;

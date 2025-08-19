"use client";

import { Close } from "@mui/icons-material";
import {
  Box,
  Container,
  Drawer,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  MenuItem,
  MenuList,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { createSession, updateSession } from "@/app/actions";
import { drawerWidth } from "@/app/chat/app-bar";
import { AppContext } from "@/app/contexts/App";
import { ThemeContext } from "@/app/contexts/Theme";
import { byTime, groupByDay, toChatHistoryEntry } from "@/app/helpers/nav";
import { useAppUser } from "@/app/hooks/useAppUser";
import { useUserSessions } from "@/app/hooks/useUserSessions";
import type { TChat, TChatHistory } from "@/app/lib/types";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export interface INavDrawerProps {}

const NavDrawer = () => {
  const {
    user,
    canContinueAsAuthUser,
    canContinueAsGuest,
    isLoading: userIsLoading,
  } = useAppUser();
  const { navOpen, setNavOpen, setContextOpen, setCurrentMessage } =
    useContext(AppContext);
  const router = useRouter();
  const { mode, isLarge } = useContext(ThemeContext);
  const [chatHistory, setChatHistory] = useState<TChatHistory>([]);
  const pathName = usePathname();
  const {
    data,
    error: dataError,
    mutate,
    isLoading: sessionsAreLoading,
  } = useUserSessions();

  // console.log("User or Guest", user, canContinueAsGuest, canContinueAsAuthUser);

  useEffect(() => {
    if (data && !dataError && !sessionsAreLoading && !userIsLoading) {
      console.log("nav", data.length);
      setChatHistory(
        data
          .sort(byTime)
          .map(toChatHistoryEntry)
          .filter((s: any) => !s.tags.includes("hidden")),
      );
    }
  }, [data, dataError, user, sessionsAreLoading, userIsLoading]);

  const onSetNewCurrentChat = () => async () => {
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
          router.replace(`/chat/${session.session_id}`);
          setContextOpen(false);
          setCurrentMessage(null);
          if (!isLarge) {
            setNavOpen(false);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (chatHistory && !dataError && !sessionsAreLoading && !userIsLoading) {
      const current = chatHistory.find(
        (s: TChat) => s.uid === pathName.split("/").pop(),
      );
      // console.log("Current", current);
      if (!current) {
        const latest = chatHistory?.[0];
        if (latest) {
          router.replace(`/chat/${latest.uid}`);
          setContextOpen(false);
          setCurrentMessage(null);
        } else {
          // new chat
          console.log("new chat");
          onSetNewCurrentChat()();
        }
      }
    }
  }, [chatHistory, pathName]);

  const handleDrawerClose = () => {
    setNavOpen(false);
  };

  const onDeleteChatClick = (chat: TChat) => async () => {
    // delete chat by setting hidden tag
    updateSession({
      sessionId: chat.uid,
      tags: `${chat.tags?.join(",")},hidden`,
    }).then(() => mutate());
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          border: "none",
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: mode === "dark" ? "#1f1e1d" : "#e9e8e6",
        },
      }}
      variant={isLarge ? "persistent" : "temporary"}
      anchor="left"
      open={navOpen}
      onClose={isLarge ? () => {} : handleDrawerClose}
    >
      <DrawerHeader />
      <Container sx={{ mt: "18px" }}>
        {!user && !canContinueAsGuest && (
          <MenuItem component="a" href="/api/auth/login">
            Login
          </MenuItem>
        )}
        {user && (
          <Stack spacing={2} direction="column">
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <IconButton
                disableRipple
                disableTouchRipple
                disableFocusRipple
                onClick={handleDrawerClose}
                sx={{ color: "#75716D", px: 0, mr: -1 }}
              >
                <Close />
              </IconButton>
            </Box>
            <Typography
              variant="body2"
              color="grey.600"
              sx={{ textAlign: "left", pl: 2, pt: 0 }}
            >
              Chat History
            </Typography>
            <MenuList dense sx={{ overflowY: "hidden" }}>
              {/* <ListItem disableGutters>
                <ListItemButton onClick={onSetNewCurrentChat()}>
                  <ListItemText primary="NEW" />
                </ListItemButton>
              </ListItem> */}
              {Object.entries(groupByDay(chatHistory))
                .map(([date, chats]: [string, TChat[]]) => [
                  <ListSubheader
                    key={date}
                    sx={{ color: "grey.600", backgroundColor: "transparent" }}
                  >
                    {date}
                  </ListSubheader>,
                  chats.map((chat: TChat) => (
                    <ListItem
                      disableGutters
                      key={chat.lastUpdated}
                      sx={{
                        width: "100%",
                        paddingRight: 0,
                        "&:hover .icon-button": {
                          visibility: "visible",
                          // backgroundColor: "action.hover",
                          backgroundColor: "transparent",
                          // borderRadius: 1, // subtle rounding
                          paddingRight: 0.5,
                        },
                      }}
                      secondaryAction={
                        isLarge && (
                          <IconButton
                            size="small"
                            onClick={onDeleteChatClick(chat)}
                            className="icon-button"
                            sx={{ color: "gray", visibility: "hidden" }}
                          >
                            <Close />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemButton
                        component={Link}
                        href={`/chat/${chat.uid}`}
                        selected={pathName.endsWith(chat.uid)}
                      >
                        <Tooltip title={chat.topic} placement="top">
                          <ListItemText
                            primary={chat.topic || "Untitled"}
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              flex: 1, // ensures it takes available space
                            }}
                          />
                        </Tooltip>
                      </ListItemButton>
                    </ListItem>
                  )),
                ])
                .flat()}
            </MenuList>
          </Stack>
        )}
      </Container>
    </Drawer>
  );
};

export default NavDrawer;

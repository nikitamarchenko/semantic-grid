"use client";

import { Close, Delete } from "@mui/icons-material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Container,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  styled,
  Tooltip,
} from "@mui/material";
import { TreeItem } from "@mui/x-tree-view";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SyntheticEvent } from "react";
import { useContext, useEffect, useState } from "react";

import { updateSession } from "@/app/actions";
// import { drawerWidth } from "@/app/chat/app-bar";
import { AppContext } from "@/app/contexts/App";
import { ThemeContext } from "@/app/contexts/Theme";
import { byTime, toChatHistoryEntry } from "@/app/helpers/nav";
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
  const { mode, isLarge } = useContext(ThemeContext);
  const [chatHistory, setChatHistory] = useState<TChatHistory>([]);
  const [roots, setRoots] = useState<TChat[]>([]);
  const pathName = usePathname();
  const {
    data,
    error: dataError,
    mutate,
    isLoading: sessionsAreLoading,
  } = useUserSessions();

  const onNodeClick = () => {
    setNavOpen(false);
  };
  const onDeleteChatClick = (node: TChat) => async (e: SyntheticEvent) => {
    // delete chat by setting hidden tag
    console.log("Hiding chat", node);
    e.stopPropagation(); // prevent triggering TreeItem's internal handlers
    updateSession({
      sessionId: node.uid,
      tags: `${node.tags?.join(",")},hidden`,
    }).then(() => mutate());
  };

  // Render TreeItems recursively
  const renderTree = (node: TChat) => (
    <TreeItem
      key={node.id}
      itemId={node.id || node.uid}
      label={
        <Stack
          direction="row"
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
        >
          <Link
            href={`/query/${node.id || node.uid}`}
            onClick={(e: SyntheticEvent) => {
              e.stopPropagation(); // prevent triggering TreeItem's internal handlers
              onNodeClick();
            }}
          >
            {node.topic}
          </Link>
          <Box
            sx={{
              "&:hover .icon-button": {
                visibility: "visible",
                // backgroundColor: "action.hover",
                // backgroundColor: "transparent",
                // borderRadius: 1, // subtle rounding
                // paddingRight: 0.5,
              },
            }}
          >
            <Tooltip title="Delete chat" placement="right">
              <IconButton
                disableRipple
                disableTouchRipple
                disableFocusRipple
                size="small"
                onClick={onDeleteChatClick(node)}
                className="icon-button"
                sx={{
                  color: "gray",
                  visibility: "hidden",
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      }
      sx={{
        "& .MuiTreeItem-label": {
          fontSize: "0.9rem",
          padding: "4px 8px",
          color:
            node.id === pathName.split("/").pop()
              ? "primary.main"
              : "text.primary",
        },
      }}
    >
      {node.children?.map((child) => renderTree(child))}
    </TreeItem>
  );

  // console.log("User or Guest", user, canContinueAsGuest, canContinueAsAuthUser);

  useEffect(() => {
    if (data && !dataError && !sessionsAreLoading && !userIsLoading) {
      const history = data
        .sort(byTime)
        .map(toChatHistoryEntry)
        .filter((s: any) => !s.tags.includes("hidden") && s.message_count > 0);
      setChatHistory(history);
    }
  }, [data, dataError, user, sessionsAreLoading, userIsLoading]);

  useEffect(() => {
    // Step 1: Index and add 'children'
    const idMap: Record<string, any> = {};
    chatHistory?.forEach((item) => {
      idMap[item.uid] = { ...item, id: item.uid, children: [] };
    });

    // Step 2: Build tree structure
    const roots: TChat[] = [];
    Object.values(idMap).forEach((node) => {
      if (node.parent) {
        const parent = idMap[node.parent];
        if (parent) parent.children.push(node);
      } else {
        roots.push(node); // no parent → root
      }
    });
    // console.log("roots", roots);
    setRoots(roots.filter((r) => !!r.id));
  }, [chatHistory]);

  const handleDrawerClose = () => {
    setNavOpen(false);
  };

  return (
    <Drawer
      sx={{
        width: "400px",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          border: "none",
          width: "400px",
          boxSizing: "border-box",
          backgroundColor: mode === "dark" ? "#1f1e1d" : "#e9e8e6",
        },
      }}
      variant="temporary"
      anchor="left"
      open={navOpen}
      onClose={handleDrawerClose}
    >
      <DrawerHeader sx={{ minHeight: "48px!important" }} />
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
            <Box sx={{ maxHeight: "calc(100vh - 146px)", overflowY: "auto" }}>
              <SimpleTreeView
                slots={{
                  collapseIcon: ExpandMoreIcon,
                  expandIcon: ChevronRightIcon,
                }}
              >
                {roots.map((root) => renderTree(root))}
              </SimpleTreeView>
            </Box>
          </Stack>
        )}
      </Container>
    </Drawer>
  );
};

export default NavDrawer;

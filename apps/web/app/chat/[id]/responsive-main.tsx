"use client";

import { styled } from "@mui/material";

import { contextDrawerWidth, drawerWidth } from "@/app/chat/app-bar";

export const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "contextOpen",
})<{
  open?: boolean;
  contextOpen?: boolean;
}>(({ theme, open, contextOpen }) => ({
  flex: 1,
  padding: theme.spacing(3),
  // width: `calc(100% - ${drawerWidth * (open ? 1 : 0) + contextDrawerWidth * (contextOpen ? 1 : 0)}px)`,
  // maxWidth: `calc(100% - ${drawerWidth * (open ? 1 : 0) + contextDrawerWidth * (contextOpen ? 1 : 0)}px)`,
  // maxWidth: "900px",
  // margin: "auto",
  // marginLeft: open ? `${drawerWidth}px` : "auto",
  // marginRight: contextOpen ? `${contextDrawerWidth}px` : "auto",
  transform: `translateX(${(drawerWidth * (open ? 1 : 0) - contextDrawerWidth * (contextOpen ? 1 : 0)) / 2}px)`,
  // overflowX: "hidden",
  transition: "transform 0.3s ease;" /* Smooth transition for re-centering */,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflowY: "hidden",
  // transition: "margin 0.2s ease-in-out",
  // transition: theme.transitions.create("margin", {
  //  easing: theme.transitions.easing.easeOut,
  //  duration: theme.transitions.duration.enteringScreen,
  // }),
}));

export const ConstantMain = styled("main", {
  shouldForwardProp: (prop: any) => prop !== "open" && prop !== "contextOpen",
})<{ open?: boolean; contextOpen?: boolean }>(() => ({
  flexGrow: 1,
  padding: "16px",
}));

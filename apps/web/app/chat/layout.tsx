import React from "react";

import AppBar from "@/app/chat/app-bar";
import ContextDrawer from "@/app/chat/context-drawer";
import NavDrawer from "@/app/chat/nav-drawer";
import { AppProvider } from "@/app/contexts/App";

const ChatLayout = ({ children }: { children: React.ReactElement }) => (
  <AppProvider>
    <AppBar />
    <NavDrawer />
    <ContextDrawer />
    <div>{children}</div>
  </AppProvider>
);

export default ChatLayout;

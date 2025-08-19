import React from "react";

import { AppProvider } from "@/app/contexts/App";
import AppBar from "@/app/query/app-bar";

import NavDrawer from "./nav-drawer";

const ChatLayout = ({ children }: { children: React.ReactElement }) => (
  <AppProvider>
    <AppBar id={null} ancestors={[]} succesors={[]} />
    <NavDrawer />
    <main>{children}</main>
  </AppProvider>
);

export default ChatLayout;

import React from "react";

import GridNavClient from "@/app/components/GridNavClient";
import { AppProvider } from "@/app/contexts/App";
import { getDashboards } from "@/app/lib/appApi";

const ChatLayout = async ({ children }: { children: React.ReactElement }) => {
  const dashboards = await getDashboards();

  return (
    <AppProvider>
      <GridNavClient dashboards={dashboards} />
      <main>{children}</main>
    </AppProvider>
  );
};

export default ChatLayout;

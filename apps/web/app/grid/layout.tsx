import React from "react";

import { ensureSession } from "@/app/actions";
import GridNavClient from "@/app/components/GridNavClient";
import { AppProvider } from "@/app/contexts/App";
import { getDashboards } from "@/app/lib/dashboards";
import NavDrawer from "@/app/query/nav-drawer";

const ChatLayout = async ({ children }: { children: React.ReactElement }) => {
  const { uid, dashboardId } = await ensureSession();
  const dashboards = await getDashboards(uid);

  return (
    <AppProvider>
      <GridNavClient
        dashboards={dashboards}
        uid={uid}
        dashboardId={dashboardId}
      />
      <NavDrawer anchor="right" base="grid" />
      <main>{children}</main>
    </AppProvider>
  );
};

export default ChatLayout;

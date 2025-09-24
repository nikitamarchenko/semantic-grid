import React from "react";

import { ensureSession } from "@/app/actions";
import GridItemNavClient from "@/app/components/GridItemNavClient";
import { ItemViewProvider } from "@/app/contexts/ItemView";
import { getDashboards } from "@/app/lib/dashboards";
import NavDrawer from "@/app/query/nav-drawer";

const GridLayout = async ({
  children,
  params: { id },
}: {
  children: React.ReactElement;
  params: { id: string };
}) => {
  const { uid, dashboardId } = await ensureSession();
  const dashboards = await getDashboards(uid);

  return (
    <ItemViewProvider itemId={id} defaultView="grid">
      <GridItemNavClient
        dashboards={dashboards}
        uid={uid}
        dashboardId={dashboardId}
      />
      <NavDrawer anchor="right" base="grid" />
      <main>{children}</main>
    </ItemViewProvider>
  );
};

export default GridLayout;

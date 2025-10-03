import React from "react";

import { ensureSession } from "@/app/actions";
import GridItemNavClient from "@/app/components/GridItemNavClient";
import { ItemViewProvider } from "@/app/contexts/ItemView";
import { getDashboards } from "@/app/lib/dashboards";
import { getAllUserRequestsForSession, getUserSession } from "@/app/lib/gptAPI";

const GridLayout = async ({
  children,
  params: { id },
}: {
  children: React.ReactElement;
  params: { id: string };
}) => {
  const { uid, dashboardId } = await ensureSession();
  const dashboards = await getDashboards(uid);
  const { metadata, ...others } = await getUserSession({ sessionId: id });
  const currentSession = await getAllUserRequestsForSession({ sessionId: id });
  const lastMessage = currentSession
    .sort((a: any, b: any) => a.sequence_number - b.sequence_number)
    .at(-1);

  return (
    <ItemViewProvider itemId={id} defaultView="grid">
      <GridItemNavClient
        dashboards={dashboards}
        uid={uid}
        dashboardId={dashboardId}
        id={id}
        metadata={metadata}
        queryUid={lastMessage?.query?.query_id}
      />
      {/* <NavDrawer anchor="right" base="grid" /> */}
      <main>{children}</main>
    </ItemViewProvider>
  );
};

export default GridLayout;

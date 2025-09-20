import type { ReactNode } from "react";

import { ensureSession } from "@/app/actions";
import ViewNavClient from "@/app/components/ViewNavClient";
import { ItemViewProvider } from "@/app/contexts/ItemView";
import { getDashboardItemData, getDashboards } from "@/app/lib/dashboards";

const ItemLayout = async ({
  params: { id },
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) => {
  const { uid } = await ensureSession();
  const dashboards = await getDashboards(uid);
  const item = await getDashboardItemData(id);

  return (
    <ItemViewProvider itemId={id} defaultView="chart">
      <ViewNavClient dashboards={dashboards} item={item} />
      {children}
    </ItemViewProvider>
  );
};

export default ItemLayout;

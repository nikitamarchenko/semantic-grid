import type { ReactNode } from "react";

import ViewNavClient from "@/app/components/ViewNavClient";
import { ItemViewProvider } from "@/app/contexts/ItemView";
import { getDashboardItemData, getDashboards } from "@/app/lib/appApi";

const ItemLayout = async ({
  params: { id },
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) => {
  const dashboards = await getDashboards();
  const item = await getDashboardItemData(id);

  return (
    <ItemViewProvider itemId={id} defaultView="chart">
      <ViewNavClient dashboards={dashboards} item={item} />
      {children}
    </ItemViewProvider>
  );
};

export default ItemLayout;

import React from "react";

import { ensureSession } from "@/app/actions";
import { AppProvider } from "@/app/contexts/App";

const QueryDataLayout = async ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const { uid, dashboardId } = await ensureSession();

  return (
    <AppProvider>
      <main>{children}</main>
    </AppProvider>
  );
};

export default QueryDataLayout;

import React from "react";

import { AppProvider } from "@/app/contexts/App";

const QueryDataLayout = ({ children }: { children: React.ReactElement }) => (
  <AppProvider>
    <main>{children}</main>
  </AppProvider>
);

export default QueryDataLayout;

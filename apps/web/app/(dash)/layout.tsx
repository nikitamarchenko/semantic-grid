import type { ReactNode } from "react";

import TopNav from "@/app/(dash)/top-nav";

const DashLayout = ({
  params: { id },
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) => {
  console.log("ItemLayout", id);
  return (
    <>
      <TopNav />
      {children}
    </>
  );
};

export default DashLayout;

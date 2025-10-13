import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import type { ReactNode } from "react";

import TopNav from "@/app/(dash)/top-nav";
import { ensureSession } from "@/app/actions";

const DashLayout = async ({
  params: { id },
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) => {
  const { uid } = await ensureSession();

  return (
    <>
      <TopNav userId={uid || undefined} />
      {children}
    </>
  );
};

export default DashLayout;

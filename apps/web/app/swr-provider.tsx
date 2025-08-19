"use client";

import { SWRConfig } from "swr";

import { localStorageProvider } from "@/app/contexts/localStorageProvider";

const SWRProvider = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => localStorageProvider() as any }}>
    {children}
  </SWRConfig>
);

export default SWRProvider;

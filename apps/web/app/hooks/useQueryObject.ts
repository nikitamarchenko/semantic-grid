"use client";

import useSWR from "swr";

import { getQueryById } from "@/app/actions";
import type { TQuery } from "@/app/lib/types";

export const useQueryObject = (id: string) => {
  const { data, error, isLoading } = useSWR<TQuery | null>(id, getQueryById, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return { data, error, isLoading };
};

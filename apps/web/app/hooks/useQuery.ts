import useSWR, { unstable_serialize, useSWRConfig } from "swr";

export const UnauthorizedError = new Error("Unauthorized");

const LS_KEY = "app-cache-freshness";

type Freshness = Record<string, number>;

const serializeKey = (key: any) => (key ? unstable_serialize(key) : null);

function readFreshness(): Freshness {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}") as Freshness;
  } catch {
    return {};
  }
}

export function setFreshness(key: string, ts = Date.now()) {
  const f = readFreshness();
  f[key] = ts;
  localStorage.setItem(LS_KEY, JSON.stringify(f));
}

export function getFreshness(key: string): number | null {
  const f = readFreshness();
  return typeof f[key] === "number" ? f[key] : null;
}

const fetcher = async ([url, id, limit, offset, sortBy, sortOrder]: [
  url: string,
  id: string,
  limit?: number,
  offset?: number,
  sortBy?: string,
  sortOrder?: "asc" | "desc",
]) => {
  let fullUrl = `${url}/${id}`;
  if (limit || offset || sortBy || sortOrder) {
    fullUrl += `?`;
    if (limit) fullUrl += `limit=${limit}&`;
    if (offset) fullUrl += `offset=${offset}&`;
    if (sortBy) fullUrl += `sort_by=${sortBy}&`;
    if (sortOrder) fullUrl += `sort_order=${sortOrder}&`;
  }
  if (fullUrl.endsWith("&")) {
    fullUrl = fullUrl.slice(0, -1); // Remove trailing '&'
  }

  const res = await fetch(fullUrl);
  if (res.ok) return res.json();

  throw UnauthorizedError;
};

// Remove non-ASCII characters to avoid 400 error from API
const sanitize = (str: string) => str.replace(/[^\x20-\x7E]+/g, "");

export const useQuery = ({
  id,
  sql,
  limit,
  offset,
  sortBy,
  sortOrder,
}: {
  id?: string;
  sql?: string; // not used
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const { mutate: mutateCache } = useSWRConfig();

  // console.log("useQuery", id, limit, offset, sortBy, sortOrder);
  // const sqlHash = sql ? btoa(sanitize(sql)) : "";
  const key = id
    ? [`/api/apegpt/data`, id, limit, offset, sortBy, sortOrder]
    : null;
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    fetcher,
    {
      keepPreviousData: true,
      shouldRetryOnError: false,
      // cacheTime: 0,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
      onSuccess(data, k, c) {
        console.log("useQuery onSuccess", id, k);
        if (k) setFreshness(k as string);
      },
    },
  );

  const fetchedAt = key ? getFreshness(serializeKey(key) as string) : null;
  console.log("fetchedAt", id, key, fetchedAt);

  console.log("useQuery data", id, key, data, error);
  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    mutateCache,
    refresh: () => key && mutate(),
    fetchedAt,
  };
};

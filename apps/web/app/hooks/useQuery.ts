import useSWR from "swr";

export const UnauthorizedError = new Error("Unauthorized");

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

export const useQuery = ({
  id,
  sql,
  limit,
  offset,
  sortBy,
  sortOrder,
}: {
  id?: string;
  sql?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  // console.log("useQuery", id, limit, offset, sortBy, sortOrder);
  const sqlHash = sql ? btoa(sql) : "";
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    id && sql
      ? [`/api/apegpt/data`, id, limit, offset, sortBy, sortOrder, sqlHash]
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
      // cacheTime: 0,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  );

  return { data, error, isLoading, isValidating, mutate };
};

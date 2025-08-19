import useSWR from "swr";

export const UnauthorizedError = new Error("Unauthorized");

export const useAdminRequests = (
  limit: number = 20,
  offset: number = 0,
  status: string = "Done",
) => {
  const fetcher = ([url, limit, offset, status]: [
    string,
    number,
    number,
    string,
  ]) =>
    fetch(`${url}?limit=${limit}&offset=${offset}&status=${status}`).then(
      (res) => {
        if (res.ok) return res.json();
        throw UnauthorizedError;
      },
    );
  const { data, error, isLoading, mutate } = useSWR(
    ["/api/apegpt/admin/requests", limit, offset, status],
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
  console.log("useAdminRequests", { data, error, isLoading });
  return { data, error, isLoading, mutate };
};

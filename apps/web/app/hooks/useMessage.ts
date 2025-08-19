import useSWR from "swr";

export const UnauthorizedError = new Error("Unauthorized");

export const useUserSessions = (sessionId: string, seqNum: number) => {
  const fetcher = ([url, sessionId, seqNum]: [string, string, number]) =>
    fetch(`${url}?sessionId=${sessionId}&seqNum=${seqNum}`).then((res) => {
      if (res.ok) return res.json();
      throw UnauthorizedError;
    });
  const { data, error, isLoading, mutate } = useSWR(
    ["/api/apegpt/message/", sessionId, seqNum],
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  );

  return { data, error, isLoading, mutate };
};

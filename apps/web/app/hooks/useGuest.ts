"use client";

import { useEffect, useState } from "react";

export const useGuest = () => {
  const [guest, setGuest] = useState<string>();
  const [hasQuota, setHasQuota] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/auth/guest")
      .then((res) => res.json())
      .then((maybeGuest) => {
        // console.log("maybeGuest", maybeGuest);
        setGuest(maybeGuest?.uid);
        setHasQuota(maybeGuest?.hasQuota);
      });
  }, []);

  return { guest, hasQuota };
};

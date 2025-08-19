"use client";

import { useRouter, useSearchParams } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const query = useSearchParams();
  // encode all search params and add them to the login URL
  router.push(
    `/api/auth/login${query.toString() ? `?${query.toString()}` : ""}`,
  );
};

export default LoginPage;

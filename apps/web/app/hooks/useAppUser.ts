import type { UserProfile } from "@auth0/nextjs-auth0/client";
import { useUser } from "@auth0/nextjs-auth0/client";

import { useGuest } from "@/app/hooks/useGuest";
import { useSession } from "@/app/hooks/useSession";

export type TAppUser = {
  authUser: UserProfile | undefined;
  user: any;
  guest: string | undefined;
  sessionIsValid: boolean;
  isGuest: boolean;
  isAuthUser: boolean;
  sessionHasPermission: boolean;
  canContinueAsGuest: boolean;
  canContinueAsAuthUser: boolean;
  session: any;
  error: any;
  hasQuota: boolean;
  isLoading: boolean;
};

const useAppUser = () => {
  const { user: authUser, error: userError, isLoading } = useUser();
  const { session, isLoading: sessionIsLoading } = useSession(authUser);
  const { guest, hasQuota } = useGuest();
  const sessionIsValid =
    (session?.accessTokenExpiresAt || 0) * 1000 > Date.now();
  const sessionHasPermission =
    session?.accessTokenScope?.includes("create:session");

  return {
    user: authUser || guest,
    authUser,
    guest,
    isGuest: !authUser && !!guest,
    canContinueAsGuest: !authUser && !!guest && hasQuota,
    canContinueAsAuthUser:
      isLoading ||
      sessionIsLoading ||
      (!!authUser && sessionIsValid && sessionHasPermission),
    isAuthUser: !!authUser,
    sessionIsValid,
    sessionHasPermission,
    session,
    hasQuota,
    isLoading,
    error: userError,
  } as TAppUser;
};

export { useAppUser };

import { getLoginUrl } from "@/const";
import { useCallback, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};

  const logout = useCallback(async () => {
    // Simplified logout without database
    localStorage.removeItem("manus-runtime-user-info");
  }, []);

  const state = useMemo(() => {
    const userInfo = localStorage.getItem("manus-runtime-user-info");
    const user = userInfo ? JSON.parse(userInfo) : null;
    
    return {
      user: user,
      loading: false,
      error: null,
      isAuthenticated: Boolean(user),
    };
  }, []);

  return {
    ...state,
    refresh: () => {},
    logout,
  };
}

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  getToken,
  setToken,
  clearToken,
  onAuthChange,
  dispatchAuthChange,
} from "../lib/auth-events";
import type { User } from "../lib/types";

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

// Parse the JWT payload synchronously so we can render immediately without
// waiting for a network round-trip to /auth/me on every page load.
const parseTokenUser = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.sub || !payload.email) return null;
    return {
      id: payload.sub,
      email: payload.email,
      display_name: payload.display_name ?? payload.email.split("@")[0],
    };
  } catch {
    return null;
  }
};

const getInitialAuthState = (): AuthState => {
  const token = getToken();
  if (!token) return { user: null, loading: false, error: null };
  const user = parseTokenUser(token);
  // Render optimistically from token payload; background verify will
  // confirm or clear if the token has been revoked/expired server-side.
  return { user, loading: false, error: null };
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(getInitialAuthState);

  useEffect(() => {
    const verifyUser = async () => {
      const token = getToken();
      if (!token) {
        setAuthState({ user: null, loading: false, error: null });
        return;
      }
      try {
        const user = await api.auth.me();
        setAuthState({ user, loading: false, error: null });
      } catch {
        clearToken();
        setAuthState({ user: null, loading: false, error: null });
      }
    };

    verifyUser();
    return onAuthChange(verifyUser);
  }, []);

  const signUp = async (
    email: string,
    password: string,
    displayName?: string,
  ) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { token, user } = await api.auth.signUp(
        email,
        password,
        displayName,
      );
      setToken(token);
      setAuthState({ user, loading: false, error: null });
      dispatchAuthChange();
      return { data: user, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Sign up failed");
      setAuthState((prev) => ({ ...prev, loading: false, error }));
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { token, user } = await api.auth.signIn(email, password);
      setToken(token);
      setAuthState({ user, loading: false, error: null });
      dispatchAuthChange();
      return { data: user, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Sign in failed");
      setAuthState((prev) => ({ ...prev, loading: false, error }));
      return { data: null, error };
    }
  };

  const signOut = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await api.auth.signOut();
    } catch {
      // Ignore server errors on sign-out; clear locally regardless
    }
    clearToken();
    setAuthState({ user: null, loading: false, error: null });
    dispatchAuthChange();
    return { error: null };
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signUp,
    signIn,
    signOut,
  };
};

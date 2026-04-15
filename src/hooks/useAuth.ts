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

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadUser = async () => {
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

    loadUser();
    return onAuthChange(loadUser);
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

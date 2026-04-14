const AUTH_EVENT = "rpg-auth-change";

export const dispatchAuthChange = () =>
  window.dispatchEvent(new Event(AUTH_EVENT));

export const onAuthChange = (cb: () => void): (() => void) => {
  window.addEventListener(AUTH_EVENT, cb);
  return () => window.removeEventListener(AUTH_EVENT, cb);
};

const TOKEN_KEY = "rpg_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

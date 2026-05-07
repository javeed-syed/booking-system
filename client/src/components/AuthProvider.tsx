import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthUser } from "../auth";
import { getAuthToken, getAuthUser, clearAuth } from "../auth";
import { authApi } from "../api";

// ─── Context type ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── On mount: restore session OR handle OAuth callback ───────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code  = params.get("code");
    const state = params.get("state");

    if (code) {
      // We're back from Google — exchange the code for a token
      authApi
        .handleCallback(code, state ?? "")
        .then((data) => {
          setUser(data.user);
          // Clean up the URL so the code isn't reused on refresh
          window.history.replaceState({}, "", window.location.pathname);
        })
        .catch(() => {
          clearAuth();
        })
        .finally(() => setIsLoading(false));
      return;
    }

    // No callback — try restoring from localStorage
    const token = getAuthToken();
    const stored = getAuthUser();

    if (token && stored) {
      // Optionally re-validate with backend here:
      //   authApi.fetchMe().then(setUser).catch(() => { clearAuth(); setUser(null); })
      setUser(stored);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  // ── Login: get redirect URL from backend, then navigate ──────────────────
  const loginWithGoogle = useCallback(async () => {
    const url = await authApi.getLoginUrl();
    window.location.href = url;
  }, []);

  // ── Logout: call backend, then clear local state ──────────────────────────
  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
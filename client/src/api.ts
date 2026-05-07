import axios from "axios";
import type { Movie, SeatStatus, HoldResponse } from "./types";
import type { AuthUser } from "./auth";
import { getAuthToken, setAuth, clearAuth } from "./auth";

// ─── Axios instance ───────────────────────────────────────────────────────────

const client = axios.create({
  baseURL: "/",                    // ← change to your API base URL if needed
  headers: { "Content-Type": "application/json" },
  withCredentials: true,           // sends cookies automatically if your backend uses them
});

// Attach bearer token on every request (if your backend uses tokens not cookies)
client.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap backend error messages
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ??
      err.response?.data?.message ??
      err.message ??
      "Request failed";
    return Promise.reject(new Error(message));
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
//
// Adjust these to match your backend's actual endpoints and response shapes.
//
// Flow A — Redirect (most common with Google OAuth):
//   1. Call getLoginUrl()  → backend returns { url: "https://accounts.google.com/..." }
//   2. Redirect user there → Google redirects back to your /auth/callback
//   3. On that page call handleCallback(code, state) → backend returns { token, user }
//   4. Call setAuth(token, user) to persist
//
// Flow B — Backend does everything via HTTP-only cookie:
//   1. Just redirect to loginRedirectUrl directly
//   2. On return, call fetchMe() to get the current user from the cookie session
//
// Flow C — SPA pops a window, backend posts a message back:
//   Implement a postMessage listener in AuthProvider instead

export interface LoginUrlResponse {
  url: string;   // the Google OAuth redirect URL
}

export interface CallbackResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  /**
   * Get the Google OAuth redirect URL from your backend.
   * e.g. GET /auth/google/login → { url: "https://accounts.google.com/o/oauth2/..." }
   */
  getLoginUrl(): Promise<string> {
    return client
      .get<LoginUrlResponse>("/auth/google/login")
      .then((r) => r.data.url);
  },

  /**
   * Exchange the OAuth callback code+state for a token.
   * e.g. GET /auth/google/callback?code=...&state=...
   * Called automatically by AuthProvider when it detects ?code= in the URL.
   *
   * If your backend uses HTTP-only cookies instead of returning a token,
   * just remove the setAuth() call below and use fetchMe() to get the user.
   */
  handleCallback(code: string, state: string): Promise<CallbackResponse> {
    return client
      .get<CallbackResponse>(`/auth/google/callback`, { params: { code, state } })
      .then((r) => {
        setAuth(r.data.token, r.data.user);   // persist token + user locally
        return r.data;
      });
  },

  /**
   * Fetch the currently authenticated user (useful with cookie-based sessions).
   * e.g. GET /auth/me → { id, name, email, picture }
   */
  fetchMe(): Promise<AuthUser> {
    return client.get<AuthUser>("/auth/me").then((r) => r.data);
  },

  /**
   * Tell the backend to invalidate the session / revoke the token.
   * e.g. POST /auth/logout
   */
  logout(): Promise<void> {
    return client.post("/auth/logout").then(() => {
      clearAuth();
    });
  },
};

// ─── Cinema API ───────────────────────────────────────────────────────────────

export const cinemaApi = {
  getMovies(): Promise<Movie[]> {
    return client.get<Movie[]>("/movies").then((r) => r.data);
  },

  getSeats(movieId: string): Promise<SeatStatus[]> {
    return client.get<SeatStatus[]>(`/movies/${movieId}/seats`).then((r) => r.data);
  },

  holdSeat(movieId: string, seatId: string, userId: string): Promise<HoldResponse> {
    return client
      .post<HoldResponse>(`/movies/${movieId}/seats/${seatId}/hold`, { user_id: userId })
      .then((r) => r.data);
  },

  confirmSeat(sessionId: string, userId: string): Promise<void> {
    return client
      .put(`/sessions/${sessionId}/confirm`, { user_id: userId })
      .then(() => undefined);
  },

  releaseSeat(sessionId: string, userId: string): Promise<void> {
    return client
      .delete(`/sessions/${sessionId}`, { data: { user_id: userId } })
      .then(() => undefined);
  },
};
import axios from "axios";
import type { Movie, SeatStatus, HoldResponse } from "./types";
import type { AuthUser } from "./types";
import { config } from "../env.config"

// ─── Axios instance ───────────────────────────────────────────────────────────

const client = axios.create({
  baseURL: config.baseURL,                    
  headers: { "Content-Type": "application/json" },
  withCredentials: true,           // sends cookies automatically if your backend uses them
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

export const authApi = {
  async fetchMe(): Promise<AuthUser> {
    return client.get<AuthUser>("/auth/me").then((r) => r.data);
  },

  async logout(): Promise<void> {
    return client.post("/auth/logout").then(() => {
    });
  },
};

// ─── Cinema API ───────────────────────────────────────────────────────────────

export const cinemaApi = {
  async getMovies(): Promise<Movie[]> {
    return client.get<Movie[]>("/movies").then((r) => r.data);
  },

  async getSeats(movieId: string): Promise<SeatStatus[]> {
    return client.get<SeatStatus[]>(`/movies/${movieId}/seats`).then((r) => r.data);
  },

  async holdSeat(movieId: string, seatId: string, userId: string): Promise<HoldResponse> {
    return client
      .post<HoldResponse>(`/movies/${movieId}/seats/${seatId}/hold`, { user_id: userId })
      .then((r) => r.data);
  },

  async confirmSeat(sessionId: string, userId: string): Promise<void> {
    await client
      .put(`/sessions/${sessionId}/confirm`, { user_id: userId });
    return undefined;
  },

  async releaseSeat(sessionId: string, userId: string): Promise<void> {
    await client
      .delete(`/sessions/${sessionId}`, { data: { user_id: userId } });
    return undefined;
  },
};
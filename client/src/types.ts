export interface Movie {
  movie_id: string;
  title: string;
  rows: number;
  seats_per_row: number;
}

export interface SeatStatus {
  seat_id: string;
  booked: boolean;
  confirmed: boolean;
  user_id: string | null;
}

export interface ActiveSession {
  sessionID: string;
  movieID: string;
  seatID: string;
  expiresAt: string;
}

export interface HoldResponse {
  session_id: string;
  movie_id: string;
  seat_id: string;
  expires_at: string;
}

export type StatusType = "success" | "error";

export interface StatusMsg {
  msg: string;
  type: StatusType;
}

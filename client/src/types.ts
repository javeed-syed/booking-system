export interface Movie {
  movie_id: string;
  title: string;
  rows: number;
  seats_per_row: number;
  backdrop_path?: string;
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

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface CreateOrderResponse {
  order_id: string;
  amount: number;
  receipt: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}
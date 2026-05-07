import { useState, useEffect, useCallback } from "react";

import type { Movie, SeatStatus, ActiveSession, StatusMsg } from "./types";
import { cinemaApi } from "./api";
import { useAuth } from "./components/AuthProvider";
import { LoginPage } from "./components/LoginPage";
import { StyleInjector } from "./components/StyleInjector";
import { MovieGrid } from "./components/MovieGrid";
import { SeatGrid } from "./components/SeatGrid";
import { Legend } from "./components/Legend";
import { CheckoutSidebar } from "./components/CheckoutSidebar";

const bookingUserID = crypto.randomUUID().replace(/-/g, "").slice(0, 12);

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="cb-header">
      <div className="cb-brand">
        <div className="cb-brand-icon">🎬</div>
        <div>
          <div className="cb-brand-name">CineBook</div>
          <div className="cb-brand-tagline">Reserve your perfect seat</div>
        </div>
      </div>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img
            src={user.picture}
            alt={user.name}
            referrerPolicy="no-referrer"
            style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(240,165,0,0.4)", objectFit: "cover" }}
          />
          <span style={{ fontSize: "0.78rem", color: "var(--text-2)", fontWeight: 500 }}>
            {user.name.split(" ")[0]}
          </span>
          <button
            onClick={() => logout()}
            style={{ padding: "0.35rem 0.85rem", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "100px", fontSize: "0.68rem", color: "var(--text-3)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-3)"; }}
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Booking app ──────────────────────────────────────────────────────────────

function BookingApp() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [seats, setSeats] = useState<SeatStatus[]>([]);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [status, setStatus] = useState<StatusMsg | null>(null);

  useEffect(() => { cinemaApi.getMovies().then(setMovies).catch(() => {}); }, []);

  const fetchSeats = useCallback(() => {
    if (!selectedMovie) return;
    cinemaApi.getSeats(selectedMovie.movie_id).then(setSeats).catch(() => {});
  }, [selectedMovie]);

  useEffect(() => { fetchSeats(); }, [fetchSeats]);

  function releaseActive(): Promise<void> {
    if (!activeSession) return Promise.resolve();
    const sid = activeSession.sessionID;
    setActiveSession(null); setStatus(null);
    return cinemaApi.releaseSeat(sid, bookingUserID).catch(() => {});
  }

  function selectMovie(movie: Movie): void {
    releaseActive().then(() => { setSelectedMovie(movie); setSeats([]); setStatus(null); });
  }

  function holdSeat(seatID: string): void {
    if (activeSession || !selectedMovie) return;
    cinemaApi.holdSeat(selectedMovie.movie_id, seatID, bookingUserID)
      .then((data) => {
        setActiveSession({ sessionID: data.session_id, movieID: data.movie_id, seatID: data.seat_id, expiresAt: data.expires_at });
        setStatus(null); fetchSeats();
      })
      .catch((err: Error) => setStatus({ msg: err.message, type: "error" }));
  }

  function confirmSeat(): void {
    if (!activeSession) return;
    cinemaApi.confirmSeat(activeSession.sessionID, bookingUserID)
      .then(() => { setActiveSession(null); fetchSeats(); setStatus({ msg: "Booking confirmed!", type: "success" }); })
      .catch((err: Error) => setStatus({ msg: err.message, type: "error" }));
  }

  function releaseSeat(): void {
    if (!activeSession) return;
    cinemaApi.releaseSeat(activeSession.sessionID, bookingUserID)
      .then(() => { setActiveSession(null); fetchSeats(); setStatus(null); })
      .catch((err: Error) => setStatus({ msg: err.message, type: "error" }));
  }

  function handleExpire(): void {
    setActiveSession(null); fetchSeats();
    setStatus({ msg: "Hold expired — please choose again.", type: "error" });
  }

  return (
    <div className="cb-root">
      <Header />
      <div className="cb-page">
        <div className="cb-step" style={{ animationDelay: "0.05s" }}>
          <div className="cb-step-num">1</div>
          <div className="cb-step-label">Choose a film</div>
        </div>

        <MovieGrid movies={movies} selectedMovie={selectedMovie} onSelect={selectMovie} />

        {selectedMovie && (
          <>
            <div className="cb-step" style={{ animationDelay: "0.12s" }}>
              <div className="cb-step-num">2</div>
              <div className="cb-step-label">Select your seat</div>
            </div>

            <div className="cb-main">
              <div className="cb-theatre-card">
                <div className="cb-theatre-header">
                  <div className="cb-theatre-title">{selectedMovie.title}</div>
                  <div className="cb-theatre-meta">{selectedMovie.rows * selectedMovie.seats_per_row} seats total</div>
                </div>
                <div className="cb-theatre-body">
                  <div className="cb-screen-wrap">
                    <div className="cb-screen-bar" />
                    <div className="cb-screen-text">Screen</div>
                  </div>
                  <SeatGrid movie={selectedMovie} seats={seats} activeSession={activeSession} userID={bookingUserID} onHold={holdSeat} />
                </div>
                <Legend />
              </div>

              <div className="cb-checkout">
                <div className="cb-step" style={{ animationDelay: "0" }}>
                  <div className="cb-step-num">3</div>
                  <div className="cb-step-label">Review &amp; confirm</div>
                </div>
                <CheckoutSidebar selectedMovie={selectedMovie} activeSession={activeSession} status={status} onConfirm={confirmSeat} onRelease={releaseSeat} onExpire={handleExpire} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function CinemaBooking() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#13110f", color: "#6b6256", fontFamily: "'Outfit', sans-serif", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
        Loading…
      </div>
    );
  }

  return (
    <>
      <StyleInjector />
      {user ? <BookingApp /> : <LoginPage />}
    </>
  );
}
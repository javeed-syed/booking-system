import type { Movie, ActiveSession, StatusMsg } from "../types";
import Razorpay from "./Razorpay";
import { Timer } from "./Timer";

// Adjust to match your backend's hold duration
const HOLD_SECONDS = 300;

interface CheckoutSidebarProps {
  selectedMovie: Movie | null;
  activeSession: ActiveSession | null;
  status: StatusMsg | null;
  onConfirm: (paymentId: string) => void;
  onRelease: () => void;
  onExpire: () => void;
}

export function CheckoutSidebar({
  selectedMovie,
  activeSession,
  status,
  onConfirm,
  onRelease,
  onExpire,
}: CheckoutSidebarProps) {
  // No film selected yet
  if (!selectedMovie) {
    return (
      <div className="cb-hint-card">
        <div className="cb-hint-icon">🎬</div>
        <div className="cb-hint-title">Choose a film</div>
        <div className="cb-hint-body">
          Select a movie above to see available seats.
        </div>
      </div>
    );
  }

  // Film selected, waiting for seat pick
  if (!activeSession) {
    return (
      <>
        <div className="cb-hint-card">
          <div className="cb-hint-icon">💺</div>
          <div className="cb-hint-title">Pick your seat</div>
          <div className="cb-hint-body">
            Click any available seat in the theatre to hold it for you.
          </div>
        </div>
        {status && (
          <div className={`cb-toast ${status.type}`}>
            {status.type === "success" ? "✓" : "✗"} {status.msg}
          </div>
        )}
      </>
    );
  }

  // Seat held — show full checkout
  const infoRows: [string, string][] = [
    ["Film",    activeSession.movieID],
    ["Ref. no", activeSession.sessionID.slice(0, 10) + "…"],
  ];

  return (
    <>
      {/* Order summary */}
      <div className="cb-summary-card">
        <div className="cb-summary-top">
          <div className="cb-summary-label">Your selection</div>
          <div className="cb-summary-seat">
            <div className="cb-summary-seat-num">{activeSession.seatID}</div>
            <div className="cb-summary-seat-label">Seat</div>
          </div>
        </div>
        <div className="cb-summary-rows">
          {infoRows.map(([k, v]) => (
            <div key={k} className="cb-summary-row">
              <span className="cb-summary-key">{k}</span>
              <span className="cb-summary-val">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Countdown */}
      <Timer
        activeSession={activeSession}
        onExpire={onExpire}
        totalSecs={HOLD_SECONDS}
      />

      {/* Actions */}
      <div className="cb-actions">
        <Razorpay
        className="cb-btn cb-btn-primary"
        order = {{
            'amount': 30000,
            'session_id': activeSession.sessionID
        }}
          onSuccess = {onConfirm}
          buttonText = {"✓ Confirm booking"}
        />
        
        <button className="cb-btn cb-btn-ghost" onClick={onRelease}>
          Release seat
        </button>
      </div>

      {status && (
        <div className={`cb-toast ${status.type}`}>
          {status.type === "success" ? "✓" : "✗"} {status.msg}
        </div>
      )}
    </>
  );
}

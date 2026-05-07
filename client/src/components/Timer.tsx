import type { ActiveSession } from "../types";
import { useTimer } from "../hooks/useTimer";

interface TimerProps {
  activeSession: ActiveSession;
  onExpire: () => void;
  totalSecs: number;
}

export function Timer({ activeSession, onExpire, totalSecs }: TimerProps) {
  const remaining = useTimer(activeSession, onExpire);
  if (remaining === null) return null;

  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");
  const pct = Math.max(0, (remaining / totalSecs) * 100);
  const urgent = remaining < 60;

  return (
    <div className="cb-timer-card">
      <div className="cb-timer-label">⏱ Time to confirm</div>
      <div className={`cb-timer-digits${urgent ? " urgent" : ""}`}>
        {mins}:{secs}
      </div>
      <div className="cb-timer-sub">
        {urgent
          ? "⚠ Hurry! Seat will be released soon"
          : "Your seat is held"}
      </div>
      <div className="cb-timer-bar-wrap">
        <div
          className={`cb-timer-bar${urgent ? " urgent" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

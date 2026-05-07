import type { Movie, SeatStatus, ActiveSession } from "../types";

const ROW_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface SeatProps {
  seatID: string;
  info: SeatStatus | undefined;
  activeSession: ActiveSession | null;
  userID: string;
  onHold: (id: string) => void;
}

function Seat({ seatID, info, activeSession, userID, onHold }: SeatProps) {
  const isMyHeld =
    activeSession?.seatID === seatID ||
    (info?.booked && info.user_id === userID);
  const isOtherHeld = info?.booked && info.user_id !== userID;
  const isConfirmed = !!info?.confirmed;
  const isDisabled =
    isConfirmed || !!isOtherHeld || (!!activeSession && !isMyHeld);

  let cls = "cb-seat";
  if (isConfirmed) cls += " s-confirmed";
  else if (isMyHeld) cls += " s-mine";
  else if (isOtherHeld) cls += " s-other";

  return (
    <button
      className={cls}
      disabled={isDisabled}
      onClick={() => !isDisabled && onHold(seatID)}
      title={`Seat ${seatID}`}
    >
      {seatID.replace(/[A-Z]/, "")}
    </button>
  );
}

interface SeatGridProps {
  movie: Movie;
  seats: SeatStatus[];
  activeSession: ActiveSession | null;
  userID: string;
  onHold: (id: string) => void;
}

export function SeatGrid({
  movie,
  seats,
  activeSession,
  userID,
  onHold,
}: SeatGridProps) {
  const statusMap: Record<string, SeatStatus> = {};
  seats.forEach((s) => (statusMap[s.seat_id] = s));

  return (
    <div className="cb-seat-grid">
      {Array.from({ length: movie.rows }, (_, r) => (
        <div key={r} className="cb-seat-row">
          <div className="cb-row-lbl">{ROW_LABELS[r]}</div>
          {Array.from({ length: movie.seats_per_row }, (_, s) => {
            const id = ROW_LABELS[r] + (s + 1);
            return (
              <Seat
                key={id}
                seatID={id}
                info={statusMap[id]}
                activeSession={activeSession}
                userID={userID}
                onHold={onHold}
              />
            );
          })}
          <div className="cb-row-lbl">{ROW_LABELS[r]}</div>
        </div>
      ))}
    </div>
  );
}

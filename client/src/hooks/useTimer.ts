import { useState, useEffect, useRef } from "react";
import type { ActiveSession } from "../types";

export function useTimer(
  activeSession: ActiveSession | null,
  onExpire: () => void
): number | null {
  const [remaining, setRemaining] = useState<number | null>(null);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!activeSession) {
      if (ref.current) clearInterval(ref.current);
      setRemaining(null);
      return;
    }

    const tick = () => {
      const secs = Math.max(
        0,
        Math.floor(
          (new Date(activeSession.expiresAt).getTime() - Date.now()) / 1000
        )
      );
      setRemaining(secs);
      if (secs <= 0) {
        if (ref.current) clearInterval(ref.current);
        onExpire();
      }
    };

    tick();
    ref.current = setInterval(tick, 1000);

    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [activeSession]);

  return remaining;
}

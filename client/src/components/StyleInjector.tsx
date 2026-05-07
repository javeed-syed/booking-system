import { useEffect } from "react";
import STYLES from "../styles";

export function StyleInjector() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => {
      document.head.removeChild(el);
    };
  }, []);

  return null;
}

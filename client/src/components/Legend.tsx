const LEGEND_ITEMS: { label: string; bg: string; border: string }[] = [
  { label: "Available",  bg: "var(--seat-open)",          border: "rgba(255,255,255,0.06)" },
  { label: "Your seat",  bg: "var(--gold)",               border: "var(--gold)" },
  { label: "Taken",      bg: "var(--seat-other)",         border: "transparent" },
  { label: "Confirmed",  bg: "var(--green-soft)",         border: "var(--green)" },
];

export function Legend() {
  return (
    <div className="cb-legend">
      {LEGEND_ITEMS.map(({ label, bg, border }) => (
        <div key={label} className="cb-legend-item">
          <div
            className="cb-legend-swatch"
            style={{ background: bg, borderColor: border }}
          />
          {label}
        </div>
      ))}
    </div>
  );
}

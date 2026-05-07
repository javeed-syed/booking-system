import type { Movie } from "../types";

const FILM_EMOJIS = ["🎭", "🎪", "🎠", "🎡", "🌙", "⚡", "🔥", "🌊", "🏔", "🌸"];

function filmEmoji(id: string): string {
  const sum = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return FILM_EMOJIS[sum % FILM_EMOJIS.length];
}

interface MovieGridProps {
  movies: Movie[];
  selectedMovie: Movie | null;
  onSelect: (movie: Movie) => void;
}

export function MovieGrid({ movies, selectedMovie, onSelect }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="cb-empty-state">
        <div className="cb-empty-icon">🎭</div>
        <div className="cb-empty-title">No screenings available</div>
        <div className="cb-empty-sub">Check back soon for upcoming films.</div>
      </div>
    );
  }

  return (
    <div className="cb-movies-grid">
      {movies.map((m, i) => (
        <div
          key={m.movie_id}
          className={`cb-movie-card${selectedMovie?.movie_id === m.movie_id ? " selected" : ""}`}
          onClick={() => onSelect(m)}
          style={{ animationDelay: `${0.08 + i * 0.06}s` }}
        >
          <div className="cb-movie-badge">✓</div>
          <div className="cb-movie-poster">{filmEmoji(m.movie_id)}</div>
          <div className="cb-movie-title">{m.title}</div>
          <div className="cb-movie-meta">
            {m.rows} rows · {m.seats_per_row} seats per row
          </div>
        </div>
      ))}
    </div>
  );
}

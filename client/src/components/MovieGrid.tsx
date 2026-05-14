import { config } from "../../env.config";
import type { Movie } from "../types";

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
  "linear-gradient(135deg, #1a0533 0%, #6a0572 50%, #ab47bc 100%)",
  "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #8b0000 100%)",
  "linear-gradient(135deg, #003049 0%, #005f73 50%, #0a9396 100%)",
  "linear-gradient(135deg, #1b0000 0%, #4a0e0e 50%, #c9184a 100%)",
  "linear-gradient(135deg, #0a0a0a 0%, #1c1c1c 50%, #2d6a4f 100%)",
  "linear-gradient(135deg, #1a0a00 0%, #4e1600 50%, #e85d04 100%)",
  "linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)",
  "linear-gradient(135deg, #1a001a 0%, #3d0066 50%, #7b2d8b 100%)",
];

const backdropImageBaseURL = config.tmdbImageBaseURL;

function fallbackGradient(id: string): string {
  const sum = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return FALLBACK_GRADIENTS[sum % FALLBACK_GRADIENTS.length];
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
      {movies.map((m, i) => {
        const backdropUrl = m.backdrop_path
          ? `${backdropImageBaseURL}/${m.backdrop_path}`
          : null;

        return (
          <div
            key={m.movie_id}
            className={`cb-movie-card${selectedMovie?.movie_id === m.movie_id ? " selected" : ""}`}
            onClick={() => onSelect(m)}
            style={{ animationDelay: `${0.08 + i * 0.06}s` }}
          >
            {/* Banner section */}
            <div
              className="cb-movie-banner"
              style={
                backdropUrl
                  ? {
                      backgroundImage: `url(${backdropUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : { background: fallbackGradient(m.movie_id) }
              }
            >
              <div className="cb-movie-badge">✓</div>
            </div>

            {/* Info section */}
            <div className="cb-movie-info">
              <div className="cb-movie-title">{m.title}</div>
              <div className="cb-movie-meta">
                {m.rows} rows · {m.seats_per_row} seats per row
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
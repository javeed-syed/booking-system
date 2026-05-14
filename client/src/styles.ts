const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');

  :root {
    --bg:           #13110f;
    --surface:      #1c1916;
    --surface-2:    #252018;
    --surface-3:    #2e2820;
    --border:       rgba(255,255,255,0.07);
    --border-med:   rgba(255,255,255,0.12);

    --text:         #f5f0e8;
    --text-2:       #a89f92;
    --text-3:       #6b6256;

    --gold:         #f0a500;
    --gold-soft:    rgba(240,165,0,0.15);
    --gold-glow:    rgba(240,165,0,0.3);

    --green:        #4caf7d;
    --green-soft:   rgba(76,175,125,0.15);
    --red:          #e05252;
    --red-soft:     rgba(224,82,82,0.15);
    --blue:         #5b8dee;
    --blue-soft:    rgba(91,141,238,0.15);

    --seat-open:      #2a2520;
    --seat-open-h:    #3a3028;
    --seat-mine:      var(--gold);
    --seat-other:     #1e1b17;
    --seat-confirmed: var(--green);

    --radius-sm:  6px;
    --radius-md:  12px;
    --radius-lg:  18px;
    --radius-xl:  24px;

    --shadow-sm:  0 1px 3px rgba(0,0,0,0.4);
    --shadow-md:  0 4px 16px rgba(0,0,0,0.5);
    --shadow-lg:  0 12px 40px rgba(0,0,0,0.6);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    height: 100%;
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }

  .cb-root {
    min-height: 100vh;
    background:
      radial-gradient(ellipse 120% 60% at 50% -20%, rgba(240,165,0,0.05) 0%, transparent 60%),
      var(--bg);
  }

  .cb-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 2rem; border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 50;
    background: rgba(19,17,15,0.85);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    animation: fadeDown 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  .cb-brand { display: flex; align-items: center; gap: 0.75rem; }
  .cb-brand-icon { width: 36px; height: 36px; background: var(--gold); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
  .cb-brand-name { font-family: 'Instrument Serif', serif; font-size: 1.5rem; color: var(--text); letter-spacing: -0.01em; line-height: 1; }
  .cb-brand-tagline { font-size: 0.65rem; color: var(--text-3); letter-spacing: 0.05em; margin-top: 1px; }
  .cb-user-pill { display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.9rem; background: var(--surface-2); border: 1px solid var(--border); border-radius: 100px; font-size: 0.7rem; color: var(--text-2); }
  .cb-user-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); animation: pulse-dot 2s ease-in-out infinite; }

  @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.6; transform:scale(0.85); } }

  .cb-page { max-width: 1200px; margin: 0 auto; padding: 2rem; }

  .cb-step { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; animation: fadeUp 0.4s both; }
  .cb-step-num { width: 24px; height: 24px; border-radius: 50%; background: var(--gold); color: #000; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .cb-step-label { font-size: 0.75rem; font-weight: 600; color: var(--text-2); letter-spacing: 0.08em; text-transform: uppercase; }

  /* ── Movie grid & cards ── */
  .cb-movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
    margin-bottom: 2.5rem;
    animation: fadeUp 0.4s 0.05s both;
  }

  .cb-movie-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .cb-movie-card:hover {
    border-color: var(--gold);
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(240,165,0,0.15);
  }
  .cb-movie-card.selected {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px var(--gold-glow), var(--shadow-md);
  }

  /* Banner (backdrop image or gradient) */
  .cb-movie-banner {
    position: relative;
    width: 100%;
    height: 130px;
    flex-shrink: 0;
    background-size: cover;
    background-position: center;
  }

  .cb-movie-badge {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    width: 22px;
    height: 22px;
    background: var(--gold);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 1;
  }
  .cb-movie-card.selected .cb-movie-badge { opacity: 1; }

  /* Info section below banner */
  .cb-movie-info {
    padding: 0.9rem 1.1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    background: var(--surface);
    flex: 1;
  }
  .cb-movie-card.selected .cb-movie-info {
    background: var(--surface-2);
  }

  .cb-movie-title { font-family: 'Instrument Serif', serif; font-size: 1.05rem; color: var(--text); line-height: 1.3; }
  .cb-movie-meta { font-size: 0.72rem; color: var(--text-3); font-weight: 400; }

  .cb-main { display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; align-items: start; }

  .cb-theatre-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); overflow: hidden; animation: fadeUp 0.45s 0.1s both; }
  .cb-theatre-header { padding: 1.25rem 1.75rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .cb-theatre-title { font-family: 'Instrument Serif', serif; font-size: 1.1rem; color: var(--text); }
  .cb-theatre-meta { font-size: 0.72rem; color: var(--text-3); }
  .cb-theatre-body { padding: 2rem 1.75rem; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }

  .cb-screen-wrap { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; }
  .cb-screen-bar { width: 65%; height: 4px; border-radius: 100px; background: linear-gradient(90deg, transparent, rgba(240,165,0,0.6), transparent); box-shadow: 0 4px 20px rgba(240,165,0,0.25); }
  .cb-screen-text { font-size: 0.6rem; font-weight: 500; letter-spacing: 0.35em; color: var(--text-3); text-transform: uppercase; }

  .cb-seat-grid { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; }
  .cb-seat-row { display: flex; align-items: center; gap: 5px; }
  .cb-row-lbl { width: 1.5rem; text-align: center; font-size: 0.62rem; font-weight: 600; color: var(--text-3); letter-spacing: 0.05em; }

  .cb-seat { width: 34px; height: 30px; border-radius: 5px 5px 3px 3px; background: var(--seat-open); border: 1.5px solid rgba(255,255,255,0.06); cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 0.6rem; font-weight: 500; color: var(--text-3); transition: all 0.14s; outline: none; }
  .cb-seat:hover:not(:disabled) { background: var(--seat-open-h); border-color: var(--gold); color: var(--gold); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(240,165,0,0.2); }
  .cb-seat.s-mine { background: var(--gold); border-color: var(--gold); color: #000; font-weight: 700; cursor: default; box-shadow: 0 0 14px rgba(240,165,0,0.4), 0 3px 8px rgba(0,0,0,0.3); transform: translateY(-1px); }
  .cb-seat.s-other { background: var(--seat-other); border-color: transparent; color: var(--text-3); cursor: not-allowed; opacity: 0.5; }
  .cb-seat.s-confirmed { background: var(--green-soft); border-color: var(--green); color: var(--green); cursor: not-allowed; font-weight: 600; }
  .cb-seat:disabled { cursor: not-allowed; }

  .cb-legend { display: flex; flex-wrap: wrap; gap: 1rem 2rem; justify-content: center; padding: 1.25rem 1.75rem; border-top: 1px solid var(--border); background: var(--surface-2); }
  .cb-legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; color: var(--text-2); font-weight: 500; }
  .cb-legend-swatch { width: 20px; height: 16px; border-radius: 4px 4px 2px 2px; border: 1.5px solid; }

  .cb-checkout { display: flex; flex-direction: column; gap: 1rem; animation: fadeUp 0.5s 0.15s both; }

  .cb-summary-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); overflow: hidden; }
  .cb-summary-top { padding: 1.4rem 1.5rem; background: linear-gradient(135deg, var(--surface-2), var(--surface)); border-bottom: 1px solid var(--border); }
  .cb-summary-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-3); margin-bottom: 0.6rem; }
  .cb-summary-seat { display: flex; align-items: baseline; gap: 0.5rem; }
  .cb-summary-seat-num { font-family: 'Instrument Serif', serif; font-size: 3.5rem; line-height: 1; color: var(--gold); }
  .cb-summary-seat-label { font-size: 0.8rem; color: var(--text-2); font-weight: 500; }
  .cb-summary-rows { padding: 0.5rem 0; }
  .cb-summary-row { display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 1.5rem; border-bottom: 1px solid var(--border); }
  .cb-summary-row:last-child { border-bottom: none; }
  .cb-summary-key { font-size: 0.72rem; color: var(--text-3); font-weight: 500; }
  .cb-summary-val { font-size: 0.75rem; color: var(--text-2); font-weight: 600; text-align: right; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .cb-timer-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; text-align: center; }
  .cb-timer-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-3); margin-bottom: 0.5rem; }
  .cb-timer-digits { font-family: 'Instrument Serif', serif; font-size: 3rem; line-height: 1; color: var(--gold); transition: color 0.3s; letter-spacing: 0.02em; }
  .cb-timer-digits.urgent { color: var(--red); animation: urgentShake 0.5s ease-in-out infinite; }
  .cb-timer-sub { font-size: 0.65rem; color: var(--text-3); margin-top: 0.3rem; }
  .cb-timer-bar-wrap { height: 3px; background: var(--surface-3); border-radius: 100px; margin-top: 0.8rem; overflow: hidden; }
  .cb-timer-bar { height: 100%; border-radius: 100px; background: var(--gold); transition: width 1s linear, background 0.3s; }
  .cb-timer-bar.urgent { background: var(--red); }

  @keyframes urgentShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-2px)} 75%{transform:translateX(2px)} }

  .cb-actions { display: flex; flex-direction: column; gap: 0.6rem; }
  .cb-btn { width: 100%; padding: 0.9rem 1rem; border-radius: var(--radius-md); border: none; font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.18s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; letter-spacing: 0.01em; }
  .cb-btn-primary { background: var(--gold); color: #000; box-shadow: 0 4px 16px rgba(240,165,0,0.3); }
  .cb-btn-primary:hover { background: #ffb81a; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(240,165,0,0.4); }
  .cb-btn-primary:active { transform: translateY(0); }
  .cb-btn-ghost { background: var(--surface); color: var(--text-2); border: 1px solid var(--border-med); }
  .cb-btn-ghost:hover { background: var(--surface-2); color: var(--red); border-color: var(--red); }

  .cb-toast { padding: 0.8rem 1rem; border-radius: var(--radius-md); font-size: 0.78rem; font-weight: 600; text-align: center; display: flex; align-items: center; justify-content: center; gap: 0.5rem; animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
  .cb-toast.success { background: var(--green-soft); border: 1px solid var(--green); color: var(--green); }
  .cb-toast.error { background: var(--red-soft); border: 1px solid var(--red); color: var(--red); }

  @keyframes toastIn { from{opacity:0;transform:scale(0.9) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }

  .cb-hint-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 2rem 1.5rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.7rem; }
  .cb-hint-icon { width: 52px; height: 52px; background: var(--surface-3); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 0.3rem; }
  .cb-hint-title { font-family: 'Instrument Serif', serif; font-size: 1.1rem; color: var(--text); }
  .cb-hint-body { font-size: 0.78rem; color: var(--text-3); line-height: 1.5; max-width: 200px; }

  .cb-empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem 2rem; text-align: center; gap: 0.8rem; animation: fadeUp 0.4s 0.2s both; }
  .cb-empty-icon { font-size: 3rem; margin-bottom: 0.5rem; }
  .cb-empty-title { font-family: 'Instrument Serif', serif; font-size: 1.4rem; color: var(--text); }
  .cb-empty-sub { font-size: 0.8rem; color: var(--text-3); }

  @keyframes fadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  @media (max-width: 900px) {
    .cb-main { grid-template-columns: 1fr; }
    .cb-page { padding: 1.25rem; }
    .cb-header { padding: 1rem 1.25rem; }
  }
  @media (max-width: 600px) {
    .cb-movies-grid { grid-template-columns: repeat(2, 1fr); }
    .cb-seat { width: 28px; height: 24px; font-size: 0.5rem; }
  }
`;

export default STYLES;
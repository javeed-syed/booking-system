import { useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider";

const LOGIN_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');

  .login-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(ellipse 100% 80% at 30% 20%, rgba(240,165,0,0.07) 0%, transparent 55%),
      radial-gradient(ellipse 80% 60% at 80% 90%, rgba(76,175,125,0.04) 0%, transparent 50%),
      #13110f;
    font-family: 'Outfit', sans-serif;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  /* Subtle film grain */
  .login-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 3px 3px;
    pointer-events: none;
  }

  /* Decorative reel in corner */
  .login-deco {
    position: absolute;
    top: -80px;
    right: -80px;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    border: 1px solid rgba(240,165,0,0.06);
    pointer-events: none;
  }

  .login-deco::before {
    content: '';
    position: absolute;
    inset: 20px;
    border-radius: 50%;
    border: 1px solid rgba(240,165,0,0.05);
  }

  .login-deco::after {
    content: '';
    position: absolute;
    inset: 40px;
    border-radius: 50%;
    border: 1px solid rgba(240,165,0,0.04);
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    background: #1c1916;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    animation: loginCardIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes loginCardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Top decorative strip */
  .login-strip {
    height: 4px;
    background: linear-gradient(90deg, #f0a500, #ffd166, #f0a500);
    background-size: 200% 100%;
    animation: shimmer 2.5s linear infinite;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .login-body {
    padding: 2.5rem 2.25rem 2.25rem;
  }

  /* Brand */
  .login-brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
    animation: fadeUp 0.5s 0.1s both;
  }

  .login-icon {
    width: 56px;
    height: 56px;
    background: #f0a500;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    margin-bottom: 1rem;
    box-shadow: 0 8px 24px rgba(240,165,0,0.35);
  }

  .login-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.9rem;
    color: #f5f0e8;
    letter-spacing: -0.02em;
    line-height: 1;
    margin-bottom: 0.4rem;
    text-align: center;
  }

  .login-subtitle {
    font-size: 0.8rem;
    color: #6b6256;
    text-align: center;
    line-height: 1.4;
  }

  /* Divider */
  .login-divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1.5rem 0;
    animation: fadeUp 0.5s 0.2s both;
  }

  .login-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }

  .login-divider-text {
    font-size: 0.65rem;
    color: #6b6256;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* Google button container */
  .login-google-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 1.25rem;
    animation: fadeUp 0.5s 0.25s both;
    min-height: 44px;
  }

  /* Fallback button for when GSI renders its own */
  .login-google-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.85rem 1.25rem;
    background: #f5f0e8;
    color: #1a1510;
    border: none;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    letter-spacing: 0.01em;
  }

  .login-google-btn:hover {
    background: #fff;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  }

  .login-google-btn:active { transform: translateY(0); }

  .login-google-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  /* Features list */
  .login-features {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    animation: fadeUp 0.5s 0.3s both;
  }

  .login-feature {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.75rem;
    color: #6b6256;
  }

  .login-feature-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #f0a500;
    flex-shrink: 0;
    opacity: 0.7;
  }

  /* Footer note */
  .login-footer {
    margin-top: 1.75rem;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(255,255,255,0.05);
    text-align: center;
    font-size: 0.65rem;
    color: #3a3530;
    line-height: 1.5;
    animation: fadeUp 0.5s 0.35s both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Try to render the official Google button inside the container
  useEffect(() => {
    const tryRender = () => {
      if (googleBtnRef.current && window.google) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "filled_black",
          size: "large",
          shape: "rectangular",
          width: googleBtnRef.current.offsetWidth || 350,
          text: "signin_with",
          logo_alignment: "center",
        });
      }
    };

    // Try immediately, then retry once the GSI script may have loaded
    tryRender();
    const timer = setTimeout(tryRender, 800);
    return () => clearTimeout(timer);
  }, []);

  // Inject styles once
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = LOGIN_STYLES;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  return (
    <div className="login-root">
      <div className="login-deco" />

      <div className="login-card">
        <div className="login-strip" />
        <div className="login-body">

          {/* Brand */}
          <div className="login-brand">
            <div className="login-icon">🎬</div>
            <div className="login-title">CineBook</div>
            <div className="login-subtitle">
              Reserve your perfect seat — <br />any film, any row, any time.
            </div>
          </div>

          {/* Google sign-in */}
          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">Sign in to continue</span>
            <div className="login-divider-line" />
          </div>

          {/*
            This div is the target for Google's renderButton().
            The fallback button shows if GSI hasn't loaded yet.
          */}
          <div className="login-google-wrap">
            <div ref={googleBtnRef} style={{ width: "100%" }}>
              {/* Fallback — replaced by Google's own button once GSI loads */}
              <button className="login-google-btn" onClick={loginWithGoogle}>
                <svg className="login-google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>

          {/* Feature bullets */}
          <div className="login-features">
            {[
              "Browse all current screenings",
              "Hold and confirm seats in real time",
              "Your bookings sync across devices",
            ].map((f) => (
              <div key={f} className="login-feature">
                <div className="login-feature-dot" />
                {f}
              </div>
            ))}
          </div>

          <div className="login-footer">
            By signing in you agree to our Terms of Service.<br />
            We use Google sign-in — no password needed.
          </div>
        </div>
      </div>
    </div>
  );
}
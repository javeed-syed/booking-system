interface HeaderProps {
  userID: string;
}

export function Header({ userID }: HeaderProps) {
  return (
    <header className="cb-header">
      <div className="cb-brand">
        <div className="cb-brand-icon">🎬</div>
        <div>
          <div className="cb-brand-name">CineBook</div>
          <div className="cb-brand-tagline">Reserve your perfect seat</div>
        </div>
      </div>
      <div className="cb-user-pill">
        <div className="cb-user-dot" />
        <span>ID: {userID.slice(0, 8).toUpperCase()}</span>
      </div>
    </header>
  );
}

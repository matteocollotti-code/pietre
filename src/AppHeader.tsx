import { useState } from 'react';

export default function AppHeader() {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
      <header className="app-header" role="banner">
        {/* Mini logo */}
        <svg
          className="app-header-logo"
          viewBox="0 0 60 10"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <line
            x1="2" y1="5" x2="58" y2="5"
            stroke="#d4af37"
            strokeWidth="1.5"
            strokeDasharray="5 3"
            strokeLinecap="round"
          />
          {[8, 22, 30, 38, 52].map((cx, i) => (
            <rect
              key={i}
              x={cx - 3}
              y="2"
              width="6"
              height="6"
              rx="0.5"
              fill="#d4af37"
            />
          ))}
        </svg>

        <span className="app-header-title">le vie della parità</span>

        <button
          className="app-header-info-btn"
          aria-label="Informazioni sul progetto"
          aria-expanded={infoOpen}
          aria-controls="info-panel"
          onClick={() => setInfoOpen((o) => !o)}
        >
          ℹ
        </button>
      </header>

      {/* Info panel */}
      <aside
        id="info-panel"
        className={`info-panel${infoOpen ? ' info-panel--open' : ''}`}
        aria-hidden={!infoOpen}
        role="complementary"
      >
        <button
          className="info-panel-close"
          aria-label="Chiudi pannello informazioni"
          onClick={() => setInfoOpen(false)}
        >
          ✕
        </button>

        <h2 className="info-panel-title">le vie della parità</h2>

        <p className="info-panel-body">
          Questo progetto mappa le <strong>Pietre d'Inciampo</strong> a Milano,
          con particolare attenzione alle donne vittime della persecuzione
          nazifascista.
        </p>
        <p className="info-panel-body">
          Le pietre dorate, create dall'artista Gunter Demnig, sono incastonate
          nel pavimento davanti alle ultime abitazioni delle vittime,
          ricordando le loro storie lungo le vie della città.
        </p>

        <hr className="info-panel-divider" />

        <div className="info-panel-legend">
          <span className="info-panel-legend-dot" aria-hidden="true" />
          <span>Pietra d'Inciampo</span>
        </div>
      </aside>
    </>
  );
}

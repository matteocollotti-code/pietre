import { useState } from 'react';

interface SplashScreenProps {
  onDismiss: () => void;
}

export default function SplashScreen({ onDismiss }: SplashScreenProps) {
  const [fading, setFading] = useState(false);

  function handleDismiss() {
    setFading(true);
  }

  function handleTransitionEnd() {
    if (fading) {
      onDismiss();
    }
  }

  return (
    <div
      className={`splash-overlay${fading ? ' fade-out' : ''}`}
      aria-hidden={fading}
      onTransitionEnd={handleTransitionEnd}
    >
      {/* City-grid background */}
      <div className="splash-grid" aria-hidden="true" />

      <div className="splash-content">
        {/* SVG logo: dashed gold path with 5 stones */}
        <svg
          className="splash-logo"
          viewBox="0 0 160 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <line
            x1="8" y1="12" x2="152" y2="12"
            stroke="#d4af37"
            strokeWidth="2"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
          {[20, 46, 80, 114, 140].map((cx, i) => (
            <rect
              key={i}
              x={cx - 5}
              y="7"
              width="10"
              height="10"
              rx="1"
              fill="#d4af37"
              className="splash-stone"
              style={{ animationDelay: `${0.3 + i * 0.2}s` }}
            />
          ))}
        </svg>

        <h1 className="splash-title">le vie della parità</h1>

        <p className="splash-subtitle">
          UN PERCORSO NELLA MEMORIA DELLE DONNE<br />
          VITTIME DELL'OLOCAUSTO A MILANO
        </p>

        <p className="splash-description">
          Le{' '}
          <a
            href="https://www.pietrediinciampo.it"
            target="_blank"
            rel="noopener noreferrer"
            className="splash-link"
          >
            Pietre d'Inciampo
          </a>{' '}
          sono lastre di ottone lucido incastonate nel selciato davanti alle
          ultime abitazioni delle vittime del nazismo. Questo percorso le
          collega lungo le vie di Milano, restituendo un cammino di memoria e
          di parità.
        </p>

        <button
          className="splash-cta"
          onClick={handleDismiss}
          autoFocus
        >
          INIZIA IL PERCORSO →
        </button>

        <p className="splash-footer">PIETRE D'INCIAMPO · MILANO</p>
      </div>
    </div>
  );
}

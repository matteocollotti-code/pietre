# Le vie della parità — Design System & Theme Guidelines

## Concept

**Le vie della parità** mappa le Pietre d'Inciampo di Milano con un'attenzione particolare alle storie delle donne vittime della persecuzione nazifascista.

Il design evoca:

- **La pietra d'ottone**: il materiale originale delle Pietre d'Inciampo create da Gunter Demnig — lucido, pesante, permanente.
- **Il silenzio e la memoria**: palette scura e sobria che invita alla riflessione.
- **Il cammino**: elementi lineari (percorsi, tratteggi) che richiamano le vie della città.

---

## Colori

### Palette principale

| Nome           | Valore HEX | Utilizzo |
|----------------|------------|---------|
| `--gold-primary` | `#c9a227` | Elementi di brand, pulsanti, bordi attivi, marker SVG |
| `--gold-medium`  | `#d4af37` | Marker fisici (gradiente base), cluster |
| `--gold-bright`  | `#ffdf00` | Highlight nei marker fisici (gradiente) |
| `--gold-dark`    | `#b8860b` | Ombre nei marker, testo nei popup |
| `--gold-border`  | `#7c5c02` | Bordi dei marker fisici |
| `--bg-dark`      | `#1a1310` | Sfondo principale (splash, header, pannelli) |
| `--bg-panel`     | `rgba(26,19,16,0.92)` | Pannelli sovrapposti alla mappa (blur) |
| `--text-primary` | `#f5f0e8` | Testo su sfondo scuro |
| `--text-muted`   | `rgba(245,240,232,0.6)` | Testo secondario / etichette |
| `--border-subtle`| `rgba(201,162,39,0.25)` | Bordi di pannelli e widget |
| `--accent-red`   | `#c0392b` | Confini del comune di Milano sulla mappa |

### Utilizzo dei colori

- L'**oro** è il colore identitario: rappresenta le pietre d'inciampo reali in ottone lucido.
- Il **fondo scuro caldo** (`#1a1310`) evita il nero freddo puro: è la tonalità del ciottolato antico e della memoria segnata.
- Il **bianco caldo** (`#f5f0e8`) richiama la carta invecchiata, le lettere, le fotografie.
- Non usare blu, verde brillante o colori saturi che romperebbero il registro sobrio dell'applicazione.

---

## Tipografia

### Famiglie di font

| Ruolo | Font | Weight |
|-------|------|--------|
| Titoli e nome app | **Playfair Display** (serif) | 400, 600, 400 italic |
| Corpo e UI | **Inter** (sans-serif) | 300, 400, 500 |

### Scala tipografica

| Elemento | Font | Dimensione | Peso | Note |
|----------|------|-----------|------|------|
| Titolo splash | Playfair Display | `clamp(1.8rem, 5vw, 2.6rem)` | 400 | Maiuscole naturali, no bold |
| Sottotitolo splash | Inter | `0.9rem` | 300 | `letter-spacing: 0.1em`, tutto maiuscolo |
| Descrizione | Inter | `0.875rem` | 400 | Line-height 1.75 |
| Header app | Playfair Display | `0.85rem` | 400 | `letter-spacing: 0.05em` |
| Pannello info | Inter | `0.8rem` | 400 | Line-height 1.7 |
| Etichette / footer | Inter | `0.7rem` | 400 | `letter-spacing: 0.15em`, tutto maiuscolo |

### Linee guida

- Il **Playfair Display** trasmette autorevolezza storica e femminilità elegante. Usarlo solo per titoli e nome dell'applicazione.
- **Inter** garantisce leggibilità su schermi piccoli. Usarlo per tutto il testo di supporto.
- Evitare pesi `bold` (700+) sul fondo scuro: preferire `500` per l'enfasi.

---

## Spaziatura e Layout

| Token | Valore | Utilizzo |
|-------|--------|---------|
| `--space-xs` | `4px` | Gap interni minimi |
| `--space-sm` | `8px` | Padding compatti (header) |
| `--space-md` | `16px` | Padding standard (pannelli) |
| `--space-lg` | `28px` | Separazioni di sezione |
| `--space-xl` | `40px` | Padding splash content |

---

## Componenti

### Marker (Pietra d'Inciampo)

```css
background: linear-gradient(135deg, #d4af37 0%, #ffdf00 50%, #b8860b 100%);
border: 1px solid #7c5c02;
border-radius: 2px;
width: 12px; height: 12px;
```

Il marker è un piccolo rettangolo dorato con effetto volume (gradiente). Scala al 120% in hover.

### Cluster

Cerchio dorato (`#d4af37`) con bordo scuro, 24×24px, con il numero di elementi in nero.

### Splash Screen

- Fondo `#1a1310` con griglia di linee oro sottili (6% opacità) che richiamano la pianta urbana.
- Logo SVG: un percorso tratteggiato in oro con 5 pietre che appaiono in sequenza.
- Animazioni: `stoneAppear` (scale + rotate), `drawPath` (stroke-dashoffset), `fadeInUp` (opacity + translateY).
- L'intera schermata scompare con `opacity: 0` (0.8s ease) al click su "Inizia il percorso".

### App Header

- `position: absolute` in alto a sinistra sopra la mappa (z-index 500).
- Fondo semitrasparente con `backdrop-filter: blur(6px)`.
- Bordo oro sottile (`rgba(201, 162, 39, 0.25)`).
- Appare con fade-in dopo la chiusura della splash screen.

### Pannello Info

- Si apre/chiude con il bottone `ℹ` nell'header.
- Usa `hidden` attribute per accessibilità.
- Stesso linguaggio visivo dell'header (blur, fondo scuro, bordi oro).

### Pulsanti CTA (Splash)

```
border: 1.5px solid #c9a227
padding: 12px 28px
font: Inter 0.85rem, uppercase, letter-spacing 0.12em
```

Hover: riempimento oro con testo scuro (`#1a1310`). Transizione 0.25s ease.

---

## Accessibilità

- Tutti i componenti interattivi hanno `:focus-visible` con `outline` o cambio di colore visibile.
- Il pannello info usa `role="complementary"` e `aria-label`.
- La splash screen usa `role="dialog"` e `aria-modal="true"`.
- Gli elementi decorativi SVG hanno `aria-hidden="true"`.
- I bottoni hanno `aria-label` descrittivi.

---

## Tono e voce

- **Lingua**: italiano.
- **Registro**: sobrio, rispettoso, mai banale.
- **Termini preferiti**: "percorso", "memoria", "testimonianza", "via", "storia". Evitare termini tecnici di mappatura come "marker", "pin", "layer" nelle interfacce rivolte agli utenti.
- Il nome dell'app è sempre scritto in **minuscolo**: `le vie della parità`.

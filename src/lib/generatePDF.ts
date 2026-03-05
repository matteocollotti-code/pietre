import { jsPDF, GState } from 'jspdf';
import { THEME_CONFIG } from './themeConfig';

// Brand palette
const BRAND = {
  orange: [234, 88, 12] as [number, number, number],   // #ea580c  orange-600
  purple: [147, 51, 234] as [number, number, number],  // #9333ea  purple-600
  dark: [30, 27, 75] as [number, number, number],      // #1e1b4b  indigo-950
  white: [255, 255, 255] as [number, number, number],
  lightGray: [248, 247, 255] as [number, number, number],
  midGray: [148, 148, 168] as [number, number, number],
  bodyText: [55, 50, 80] as [number, number, number],
};

// Hexadecimal colours used by themes (same as THEME_CONFIG but as rgb tuples)
const THEME_COLORS: Record<string, [number, number, number]> = {
  corpi: [220, 38, 38],
  case: [22, 163, 74],
  cose: [37, 99, 235],
  amore: [219, 39, 119],
};

// Draw a horizontal gradient stripe (simulated via multiple thin rectangles)
function drawGradientRect(
  doc: jsPDF,
  x: number, y: number,
  w: number, h: number,
  fromRgb: [number, number, number],
  toRgb: [number, number, number],
  steps = 60
) {
  const stepW = w / steps;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const r = Math.round(fromRgb[0] + (toRgb[0] - fromRgb[0]) * t);
    const g = Math.round(fromRgb[1] + (toRgb[1] - fromRgb[1]) * t);
    const b = Math.round(fromRgb[2] + (toRgb[2] - fromRgb[2]) * t);
    doc.setFillColor(r, g, b);
    doc.rect(x + i * stepW, y, stepW + 0.5, h, 'F');
  }
}

// Draw the small dot-logo (3 squares connected by diagonal lines) used in the app
function drawLogo(doc: jsPDF, cx: number, cy: number, size: number) {
  const s = size * 0.28;
  const gap = size * 0.36;
  // diagonal line
  doc.setDrawColor(...BRAND.white);
  doc.setLineWidth(0.4);
  doc.line(cx - gap / 2, cy - gap / 2, cx + gap / 2, cy + gap / 2);
  // squares
  doc.setFillColor(...BRAND.orange);
  doc.roundedRect(cx - gap / 2 - s / 2, cy - gap / 2 - s / 2, s, s, 0.5, 0.5, 'F');
  doc.setFillColor(...BRAND.purple);
  doc.roundedRect(cx - s / 2, cy - s / 2, s, s, 0.5, 0.5, 'F');
  doc.setFillColor(...BRAND.orange);
  doc.roundedRect(cx + gap / 2 - s / 2, cy + gap / 2 - s / 2, s, s, 0.5, 0.5, 'F');
}

// Add a consistent page header (small) used on pages > 1
function addPageHeader(doc: jsPDF, pageW: number) {
  drawGradientRect(doc, 0, 0, pageW, 10, BRAND.orange, BRAND.purple);
  doc.setFontSize(7);
  doc.setTextColor(...BRAND.white);
  doc.setFont('helvetica', 'bold');
  doc.text('LE VIE DELLA PARITÀ', pageW / 2, 6.5, { align: 'center' });
}

// Add a consistent page footer with page number
function addPageFooter(doc: jsPDF, pageW: number, pageH: number, pageNum: number, totalPages: number) {
  doc.setFillColor(...BRAND.lightGray);
  doc.rect(0, pageH - 8, pageW, 8, 'F');
  doc.setFontSize(7);
  doc.setTextColor(...BRAND.midGray);
  doc.setFont('helvetica', 'normal');
  doc.text('Le Vie della Parità — Pietre d\'Inciampo, Milano', 10, pageH - 3);
  doc.text(`${pageNum} / ${totalPages}`, pageW - 10, pageH - 3, { align: 'right' });
}

interface Stone {
  name: string;
  address: string;
  birthDate?: string;
  deathDate?: string;
  deathPlace?: string;
}

interface RouteSection {
  themeKey: string;
  stones: Stone[];
}

export function generateItineraryPDF(sections: RouteSection[], mapScreenshotDataUrl?: string, mapAspectRatio?: number) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentW = pageW - margin * 2;

  // ─── PRE-COMPUTE TOTAL PAGE COUNT ─────────────────────────────────────────
  // cover (1) + per-section pages + closing (1)
  const cardH = 22;
  const cardGap = 4;
  const cardStep = cardH + cardGap; // 26 mm per stop
  const footerTop = pageH - 16;   // same threshold as the loop below

  function sectionPageCount(stoneCount: number): number {
    // First page: y starts at 50, breaks when y + cardH > footerTop
    const firstPageCapacity = Math.floor((footerTop - 50) / cardStep);
    if (stoneCount <= firstPageCapacity) return 1;
    const remaining = stoneCount - firstPageCapacity;
    // Continuation pages: y starts at 18 (after mini-header)
    const contPageCapacity = Math.floor((footerTop - 18) / cardStep);
    return 1 + Math.ceil(remaining / contPageCapacity);
  }

  const totalPages =
    1 + sections.reduce((acc, s) => acc + sectionPageCount(s.stones.length), 0) + 1;

  // ─── COVER PAGE ───────────────────────────────────────────────────────────

  // Full-page gradient background
  drawGradientRect(doc, 0, 0, pageW, pageH, BRAND.orange, BRAND.purple);

  // Subtle diagonal decorative band (light)
  doc.setFillColor(255, 255, 255);
  doc.setGState(new GState({ opacity: 0.07 }));
  const pts: [number, number][] = [
    [pageW * 0.2, 0],
    [pageW * 0.65, 0],
    [pageW * 0.45, pageH],
    [0, pageH],
  ];
  doc.triangle(pts[0][0], pts[0][1], pts[1][0], pts[1][1], pts[2][0], pts[2][1], 'F');
  doc.triangle(pts[0][0], pts[0][1], pts[2][0], pts[2][1], pts[3][0], pts[3][1], 'F');
  doc.setGState(new GState({ opacity: 1 }));

  // Central logo (large)
  drawLogo(doc, pageW / 2, pageH * 0.32, 22);

  // Tagline above title
  doc.setFontSize(8.5);
  doc.setTextColor(...BRAND.white);
  doc.setFont('helvetica', 'normal');
  doc.setCharSpace(3);
  doc.text('LE VIE DELLA PARITÀ', pageW / 2, pageH * 0.43, { align: 'center' });
  doc.setCharSpace(0);

  // Main title
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Itinerari', pageW / 2, pageH * 0.50, { align: 'center' });
  doc.setFontSize(20);
  doc.setFont('helvetica', 'normal');
  doc.text('al femminile a Milano', pageW / 2, pageH * 0.57, { align: 'center' });

  // Thin white divider
  doc.setDrawColor(...BRAND.white);
  doc.setLineWidth(0.5);
  doc.setGState(new GState({ opacity: 0.5 }));
  doc.line(margin + 20, pageH * 0.60, pageW - margin - 20, pageH * 0.60);
  doc.setGState(new GState({ opacity: 1 }));

  if (mapScreenshotDataUrl) {
    const mapW = contentW;
    const maxMapH = 72;
    const mapH = mapAspectRatio ? Math.min(mapW / mapAspectRatio, maxMapH) : Math.min(mapW / 1.5, maxMapH);
    const mapX = margin;
    const mapY = pageH * 0.61;
    doc.setFillColor(255, 255, 255);
    doc.setGState(new GState({ opacity: 0.18 }));
    doc.roundedRect(mapX - 1.2, mapY - 1.2, mapW + 2.4, mapH + 2.4, 3, 3, 'F');
    doc.setGState(new GState({ opacity: 1 }));
    doc.addImage(mapScreenshotDataUrl, 'JPEG', mapX, mapY, mapW, mapH, undefined, 'FAST');
  }

  // Active routes summary
  const routeNames = sections.map(s => THEME_CONFIG[s.themeKey]?.label ?? s.themeKey).join('  ·  ');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...BRAND.white);
  doc.text(routeNames, pageW / 2, pageH * 0.85, { align: 'center' });

  // Total stops
  const totalStops = sections.reduce((acc, s) => acc + s.stones.length, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${totalStops} tappe totali`, pageW / 2, pageH * 0.89, { align: 'center' });

  // Bottom disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.setGState(new GState({ opacity: 0.7 }));
  doc.text('Pietre d\'Inciampo — memoria e cammino nella città', pageW / 2, pageH - 14, { align: 'center' });
  doc.setGState(new GState({ opacity: 1 }));

  // ─── ROUTE PAGES ──────────────────────────────────────────────────────────

  let currentPage = 1;

  for (const section of sections) {
    doc.addPage();
    currentPage++;

    const themeColor = THEME_COLORS[section.themeKey] ?? BRAND.purple;
    const themeLabel = THEME_CONFIG[section.themeKey]?.label ?? section.themeKey;

    // Page background (very light)
    doc.setFillColor(...BRAND.lightGray);
    doc.rect(0, 0, pageW, pageH, 'F');

    // ── Section header strip ──
    drawGradientRect(doc, 0, 0, pageW, 38, themeColor, BRAND.purple);

    // Logo (small) in header
    drawLogo(doc, margin + 8, 19, 10);

    // Theme title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND.white);
    doc.text(`Percorso ${themeLabel}`, margin + 22, 16);

    // Subtitle in header
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.setGState(new GState({ opacity: 0.85 }));
    doc.text(`${section.stones.length} tappe · Le Vie della Parità`, margin + 22, 23);
    doc.setGState(new GState({ opacity: 1 }));

    // Coloured accent bar at bottom of header
    doc.setFillColor(...themeColor);
    doc.rect(0, 36, pageW, 2.5, 'F');

    // ── Stones list ──
    let y = 50;
    const cardRadius = 2;
    const numberCircleR = 5;

    section.stones.forEach((stone, idx) => {
      // Page break check (leave room for footer)
      if (y + cardH > footerTop) {
        addPageFooter(doc, pageW, pageH, currentPage, totalPages);
        doc.addPage();
        currentPage++;
        doc.setFillColor(...BRAND.lightGray);
        doc.rect(0, 0, pageW, pageH, 'F');
        addPageHeader(doc, pageW);
        y = 18;
      }

      // Card background (white with shadow simulation)
      doc.setFillColor(242, 240, 255);
      doc.roundedRect(margin - 1, y - 1, contentW + 2, cardH + 2, cardRadius + 0.5, cardRadius + 0.5, 'F');
      doc.setFillColor(...BRAND.white);
      doc.roundedRect(margin, y, contentW, cardH, cardRadius, cardRadius, 'F');

      // Left accent bar with theme color
      doc.setFillColor(...themeColor);
      doc.roundedRect(margin, y, 2.5, cardH, 1, 1, 'F');

      // Stop number circle
      const circleX = margin + 2.5 + numberCircleR + 3;
      const circleY = y + cardH / 2;
      doc.setFillColor(...themeColor);
      doc.circle(circleX, circleY, numberCircleR, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...BRAND.white);
      doc.text(`${idx + 1}`, circleX, circleY + 2.5, { align: 'center' });

      // Stone name
      const textX = margin + 2.5 + numberCircleR * 2 + 8;
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...BRAND.dark);
      const nameMaxW = contentW - (textX - margin) - 2;
      const nameLines = doc.splitTextToSize(stone.name, nameMaxW);
      doc.text(nameLines[0], textX, y + 8);

      // Address
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...BRAND.bodyText);
      const addressLines = doc.splitTextToSize(stone.address ?? '', nameMaxW);
      doc.text(addressLines[0], textX, y + 14.5);

      // Dates row (birth / death)
      const dateStr = [
        stone.birthDate ? `Nata: ${stone.birthDate}` : null,
        stone.deathDate ? `†: ${stone.deathDate}` : null,
        stone.deathPlace ? `Luogo: ${stone.deathPlace}` : null,
      ]
        .filter(Boolean)
        .join('   ');
      if (dateStr) {
        doc.setFontSize(7.5);
        doc.setTextColor(...BRAND.midGray);
        doc.text(dateStr, textX, y + 19.5);
      }

      y += cardH + 4;
    });

    // Footer for the last page of this section
    addPageFooter(doc, pageW, pageH, currentPage, totalPages);
  }

  // ─── CLOSING PAGE ─────────────────────────────────────────────────────────
  doc.addPage();
  currentPage++;
  drawGradientRect(doc, 0, 0, pageW, pageH, BRAND.purple, BRAND.orange);

  drawLogo(doc, pageW / 2, pageH * 0.38, 18);

  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BRAND.white);
  doc.text('Buon cammino!', pageW / 2, pageH * 0.50, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.setGState(new GState({ opacity: 0.8 }));
  doc.text('Ogni pietra è una storia che non va dimenticata.', pageW / 2, pageH * 0.57, { align: 'center' });
  doc.setGState(new GState({ opacity: 1 }));

  return doc;
}

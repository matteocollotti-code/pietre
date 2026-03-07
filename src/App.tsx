import { useState, useMemo, useEffect } from 'react';
import { Filter, Info, Download } from 'lucide-react';
import { useWebHaptics } from 'web-haptics/react';
import html2canvas from 'html2canvas';
import data from '../data.json';
import precomputedRoutes from './routes.json';
import themeTexts from './texts.json';
import biosData from './bios.json';
import photosData from './photos.json';
import MapComponent from './MapComponent';
import FilterPanel from './FilterPanel';
import type { GenderFilter, ThemesState } from './FilterPanel';
import { THEME_CONFIG } from '@/lib/themeConfig';
import { generateItineraryPDF } from '@/lib/generatePDF';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function App() {
  const appDescription = 'Itinerari di memoria a Milano';
  const { trigger } = useWebHaptics();

  // Parsing Age from data
  const validAges = data
    .map((d: any) => parseInt(d.age))
    .filter((a: number) => !isNaN(a) && a > 0);

  const minAge = validAges.length ? Math.min(...validAges) : 0;
  const maxAge = validAges.length ? Math.max(...validAges) : 100;

  const [gender, setGender] = useState<GenderFilter>('all');
  const [ageRange, setAgeRange] = useState<[number, number]>([minAge, maxAge]);
  const [themes, setThemes] = useState<ThemesState>({
    corpi: false,
    case: false,
    cose: false,
    amore: false
  });
  const [activeDetail, setActiveDetail] = useState<{ name: string, theme: string } | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    const fadeTimeout = window.setTimeout(() => setFadeSplash(true), 1800);
    const hideTimeout = window.setTimeout(() => setShowSplash(false), 2500);

    return () => {
      window.clearTimeout(fadeTimeout);
      window.clearTimeout(hideTimeout);
    };
  }, []);

  // Derived filtered data
  const filteredMarkers = useMemo(() => {
    return data.filter((item: any) => {
      // Filter Gender
      const itemGender = item.raw?.genere?.toString().toLowerCase();
      if (gender !== 'all') {
        if (gender === 'm' && itemGender !== 'm') return false;
        if (gender === 'f' && itemGender !== 'f') return false;
      }

      // Filter Age
      const itemAge = parseInt(item.age);
      if (!isNaN(itemAge)) {
        if (itemAge < ageRange[0] || itemAge > ageRange[1]) return false;
      }

      // Filter Themes
      const { corpi, case: caseTheme, cose, amore } = themes;
      const isAnyThemeActive = corpi || caseTheme || cose || amore;

      if (isAnyThemeActive) {
        const hasCorpi = item.raw?.corpi === 1 || item.raw?.corpi === '1';
        const hasCase = item.raw?.case === 1 || item.raw?.case === '1';
        const hasCose = item.raw?.cose === 1 || item.raw?.cose === '1' || item.raw?.['cose '] === 1 || item.raw?.['cose '] === '1';
        const hasAmore = item.raw?.amore === 1 || item.raw?.amore === '1';

        const matchesTheme =
          (corpi && hasCorpi) ||
          (caseTheme && hasCase) ||
          (cose && hasCose) ||
          (amore && hasAmore);

        if (!matchesTheme) return false;
      }

      return true;
    });
  }, [gender, ageRange, themes]);

  // Build thematic routes if a theme is active
  const thematicRoutes = useMemo(() => {
    const routes: { id: string, color: string, points: [number, number][] }[] = [];
    const r = precomputedRoutes as unknown as Record<string, [number, number][]>;

    (Object.keys(themes) as Array<keyof ThemesState>).forEach((key) => {
      if (themes[key] && r[key]) {
        routes.push({ id: key, color: THEME_CONFIG[key].color, points: r[key] });
      }
    });
    return routes;
  }, [themes]);

  // Generate and download directions for active routes as a branded PDF
  const captureMapScreenshot = async (): Promise<{ dataUrl: string; aspectRatio: number } | undefined> => {
    const mapElement = document.getElementById('route-map-container');
    if (!mapElement) return undefined;

    try {
      const canvas = await html2canvas(mapElement, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#f8fafc',
        scale: Math.min(window.devicePixelRatio || 1, 2),
      });
      return {
        dataUrl: canvas.toDataURL('image/jpeg', 0.92),
        aspectRatio: canvas.width / canvas.height,
      };
    } catch {
      return undefined;
    }
  };

  const downloadDirections = async () => {
    const activeThemes = Object.entries(themes).filter(([, v]) => v).map(([k]) => k);
    if (activeThemes.length === 0) return;

    const r = precomputedRoutes as unknown as Record<string, [number, number][]>;

    const sections = activeThemes.map((themeKey) => {
      // Get the stones for this theme
      const stones = data.filter((d: any) => {
        if (!d.lat || !d.lng || !d.raw) return false;
        if (themeKey === 'cose') return d.raw.cose == 1 || d.raw['cose '] == 1;
        return d.raw[themeKey] == 1;
      });

      // Sort stones by proximity to the precomputed route order
      const routeCoords = r[themeKey];
      let orderedStones = stones;
      if (routeCoords && routeCoords.length > 0) {
        const withOrder = stones.map((s: any) => {
          let minDist = Infinity;
          let bestIdx = 0;
          for (let i = 0; i < routeCoords.length; i++) {
            const dist = Math.pow(s.lat - routeCoords[i][0], 2) + Math.pow(s.lng - routeCoords[i][1], 2);
            if (dist < minDist) { minDist = dist; bestIdx = i; }
          }
          return { stone: s, order: bestIdx };
        });
        withOrder.sort((a: any, b: any) => a.order - b.order);
        orderedStones = withOrder.map(({ stone }: any) => stone);
      }

      return {
        themeKey,
        description: THEME_CONFIG[themeKey]?.description,
        stones: orderedStones.map((s: any) => ({
          name: s.name,
          address: s.address,
          birthDate: s.birthDate,
          deathDate: s.deathDate,
          deathPlace: s.deathPlace,
        })),
      };
    });

    const mapScreenshot = await captureMapScreenshot();
    const doc = generateItineraryPDF(sections, mapScreenshot?.dataUrl, mapScreenshot?.aspectRatio);
    doc.save(`itinerario_${activeThemes.join('_')}.pdf`);
  };

  return (
    <div className="relative flex flex-col md:flex-row h-screen h-[100dvh] w-full bg-slate-50 overflow-hidden font-sans">
      {showSplash && (
        <div className={`fixed inset-0 z-[2000] flex items-center justify-center bg-background/95 backdrop-blur-md transition-opacity duration-700 animate-[splash-fade-in_0.5s_ease-out] ${fadeSplash ? 'opacity-0' : 'opacity-100'}`}>
          <div className="mx-6 flex max-w-md flex-col items-center text-center">
            <div className="relative mb-6 h-20 w-20 animate-[splash-scale-in_0.5s_ease-out_0.1s_both]">
              <span className="absolute inset-0 rounded-2xl border border-primary/20 animate-pulse" />
              <span className="absolute left-2 top-2 h-4 w-4 rounded-sm bg-orange-500/80" />
              <span className="absolute left-8 top-8 h-4 w-4 rounded-sm bg-purple-500/80 animate-pulse" />
              <span className="absolute left-14 top-14 h-4 w-4 rounded-sm bg-orange-500/80" />
              <span className="absolute left-[18px] top-[18px] h-px w-11 rotate-45 bg-muted-foreground/60" />
              <span className="absolute left-[42px] top-[42px] h-px w-11 rotate-45 bg-muted-foreground/60" />
            </div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-muted-foreground animate-[splash-slide-up_0.5s_ease-out_0.3s_both]">le vie della parità</p>
            <p className="mt-3 text-sm text-muted-foreground animate-[splash-slide-up_0.5s_ease-out_0.6s_both]">{appDescription}</p>
          </div>
        </div>
      )}

      {/* MOBILE HEADER (Visibile solo su schermi piccoli) */}
      <div className="md:hidden flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-white/40 px-4 py-3 shadow-sm z-10 relative">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-xl border border-slate-200/80 bg-white/70">
            <span className="absolute left-1.5 top-1.5 h-2.5 w-2.5 rounded-sm bg-orange-500/80" />
            <span className="absolute left-3.5 top-3.5 h-2.5 w-2.5 rounded-sm bg-purple-500/80" />
            <span className="absolute left-5.5 top-5.5 h-2.5 w-2.5 rounded-sm bg-orange-500/80" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">le vie della parità</h1>
            <p className="text-xs text-slate-600 font-medium">Itinerari di memoria a Milano</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-slate-200 bg-white/50 text-slate-700 hover:bg-white/80 rounded-full px-4 backdrop-blur-md" onClick={() => trigger('nudge')}>
                <Filter className="w-4 h-4" />
                <span>Filtri</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[50vh] bg-white/90 backdrop-blur-xl border-t border-white/50 rounded-t-2xl sm:max-w-none overflow-y-auto">
              <SheetHeader className="mb-4">
                <SheetTitle>Opzioni di Ricerca</SheetTitle>
              </SheetHeader>
              <FilterPanel
                gender={gender} setGender={setGender}
                ageRange={ageRange} setAgeRange={setAgeRange}
                minAge={minAge} maxAge={maxAge}
                themes={themes} setThemes={setThemes}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* SIDEBAR DESKTOP (Visibile solo da schermi medi in su) */}
      <div className="hidden md:flex flex-col w-80 min-w-80 bg-white/70 backdrop-blur-xl border-r border-white/50 shadow-[10px_0_30px_-5px_rgba(0,0,0,0.1)] z-50 relative h-full">
        <div className="p-6 border-b border-white/40 bg-gradient-to-br from-white/40 to-transparent">
          <div className="mb-3 flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-xl border border-slate-200/80 bg-white/70">
              <span className="absolute left-2 top-2 h-3 w-3 rounded-sm bg-orange-500/80" />
              <span className="absolute left-4.5 top-4.5 h-3 w-3 rounded-sm bg-purple-500/80" />
              <span className="absolute left-7 top-7 h-3 w-3 rounded-sm bg-orange-500/80" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent leading-tight">
              le vie della parità
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-600">
            itinerari al femminile a milano
          </p >
        </div >

        <div className="flex-1 overflow-y-auto pt-4">
          <FilterPanel
            gender={gender} setGender={setGender}
            ageRange={ageRange} setAgeRange={setAgeRange}
            minAge={minAge} maxAge={maxAge}
            themes={themes} setThemes={setThemes}
          />
        </div>

        <div className="p-4 border-t border-white/50 bg-white/30 space-y-3">
          <p className="text-xs text-slate-500 font-medium font-sans text-center">
            Mostrando {filteredMarkers.length} su {data.length}
          </p>
          {thematicRoutes.length > 0 && (
            <Button
              onClick={downloadDirections}
              className="w-full gap-2 rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold hover:from-orange-600 hover:to-purple-700 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Scarica indicazioni
            </Button>
          )}
        </div>
      </div >

      {/* FLOATING DOWNLOAD BUTTON (Mobile only) */}
      {thematicRoutes.length > 0 && (
        <div className="md:hidden fixed bottom-6 right-5 z-[999]">
          <Button
            onClick={downloadDirections}
            aria-label="Scarica indicazioni"
            className="rounded-full h-14 w-14 bg-gradient-to-br from-orange-500 to-purple-600 text-white shadow-2xl shadow-orange-500/40 hover:from-orange-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 flex items-center justify-center"
          >
            <Download className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* MAPPA */}
      < div className="flex-1 relative z-0" >
        {/* Badge Fluttuante Desktop */}
        < div className="hidden md:block absolute top-4 right-4 z-[999]" >
          <Card className="px-5 py-2.5 shadow-xl border border-white/40 bg-white/70 backdrop-blur-xl rounded-full">
            <p className="text-sm font-bold text-slate-700"> {filteredMarkers.length} Pietre filtrate</p>
          </Card>
        </div >
        {!showSplash && (
          <MapComponent markers={filteredMarkers} routes={thematicRoutes} onOpenDetail={setActiveDetail} containerId="route-map-container" />
        )}
      </div >

      {/* Thematic Deep Dive Sheet */}
      < Sheet open={!!activeDetail
      } onOpenChange={(open) => { if (!open) setActiveDetail(null); }}>
        <SheetContent side="bottom" className="h-[85vh] bg-white/95 backdrop-blur-2xl border-t border-white/50 rounded-t-3xl sm:max-w-3xl sm:mx-auto sm:px-10 overflow-hidden flex flex-col shadow-2xl z-[1000]">
          <SheetHeader className="pb-6 border-b border-slate-200/50 flex flex-col space-y-2 mt-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-full shadow-inner">
                <Info className="w-6 h-6" />
              </div>
              <SheetTitle className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                {activeDetail?.theme === 'Biografia' ? 'Biografia' : activeDetail?.theme === 'Vedi Immagine' ? 'Fotografia' : `Percorso: ${activeDetail?.theme}`}
              </SheetTitle>
            </div>
            <p className="text-base text-slate-500 font-semibold tracking-wide ml-[3.25rem]">
              {activeDetail?.theme === 'Biografia' || activeDetail?.theme === 'Vedi Immagine' ? '' : 'Tema dedicato a: '}<span className="text-slate-800">{activeDetail?.name}</span>
            </p>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-1 py-6 prose prose-slate text-justify">

            {activeDetail && (() => {
              if (activeDetail.theme === 'Vedi Immagine') {
                const matchedPhoto = photosData.find((p: any) => p.name === activeDetail.name);
                if (matchedPhoto) {
                  return (
                    <div className="flex flex-col items-center justify-center h-full w-full py-4">
                      <img src={import.meta.env.BASE_URL + matchedPhoto.file.replace(/^\//, '')} alt={`Foto di ${activeDetail.name}`} className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-lg border border-slate-200" />
                    </div>
                  );
                }
                return <p className="text-center text-slate-500 mt-10">Foto non trovata.</p>;
              }

              let matchedTextObj: any = null;

              if (activeDetail.theme === 'Biografia') {
                const matchedBio = biosData.find((b: any) => b.matches?.includes(activeDetail.name));
                if (matchedBio) {
                  matchedTextObj = { text: matchedBio.text };
                }
              } else {
                const normalizeNameForMatch = (name: string) => {
                  return name.toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/['"’]/g, '').trim();
                };

                const dNameNormalized = normalizeNameForMatch(activeDetail.name);

                matchedTextObj = themeTexts.find(t => {
                  if (t.theme.toLowerCase() !== activeDetail.theme.toLowerCase()) return false;

                  const namesToCheck = [t.name, ...(t.aliases || [])].map(normalizeNameForMatch);

                  return namesToCheck.some(nameToMatch => {
                    const textNameParts = nameToMatch.split(' ').filter(Boolean);
                    return textNameParts.every(part => dNameNormalized.includes(part));
                  });
                });
              }

              if (matchedTextObj && matchedTextObj.text) {
                let firstTitleFound = false;
                return matchedTextObj.text.split('\n').map((paragraph: string, idx: number) => {
                  if (!paragraph.trim()) return null;

                  if (!firstTitleFound) {
                    firstTitleFound = true;
                    return <p key={idx} className="text-xl font-bold text-slate-800 mb-6 whitespace-pre-line">{paragraph}</p>;
                  }

                  return <p key={idx} className="text-base leading-relaxed text-slate-600 mb-4 whitespace-pre-line">{paragraph}</p>;
                });
              }

              return (
                <>
                  <p className="text-base leading-relaxed text-slate-600 mb-4">
                    Testo di approfondimento in arrivo per questa pietra. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <p className="text-base leading-relaxed text-slate-600 mb-4">
                    Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra,
                    est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.
                    Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper,
                    ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi.
                  </p>
                </>
              );
            })()}
          </div>
        </SheetContent>
      </Sheet >

    </div >
  )
}

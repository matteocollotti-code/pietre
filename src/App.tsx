import { useState, useMemo, useEffect } from 'react';
import { Filter } from 'lucide-react';
import data from '../data.json';
import MapComponent from './MapComponent';
import FilterPanel from './FilterPanel';
import type { GenderFilter, ThemesState } from './FilterPanel';
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
  const appDescription = 'Itinerari a Milano che attraversano le storie delle donne della Shoah.';

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
    const CENTRALE: [number, number] = [45.4861, 9.2036];
    const SAN_VITTORE: [number, number] = [45.4619, 9.1656];

    const buildRoute = (points: any[]) => {
      if (points.length === 0) return [];
      let unvisited = [...points];
      let current = CENTRALE;
      const route: [number, number][] = [CENTRALE];

      while (unvisited.length > 0) {
        let closestIdx = 0;
        let minDist = Infinity;
        for (let i = 0; i < unvisited.length; i++) {
          const pt = unvisited[i];
          // approximate distance ignoring spherical geometry since Milan is small
          const dist = Math.pow(pt.lat - current[0], 2) + Math.pow(pt.lng - current[1], 2);
          if (dist < minDist) {
            minDist = dist;
            closestIdx = i;
          }
        }
        current = [unvisited[closestIdx].lat, unvisited[closestIdx].lng];
        route.push(current);
        unvisited.splice(closestIdx, 1);
      }

      route.push(SAN_VITTORE);
      return route;
    };

    const routes: { id: string, color: string, points: [number, number][] }[] = [];
    if (themes.corpi) {
      const pts = data.filter((item: any) => item.lat && item.lng && (item.raw?.corpi === 1 || item.raw?.corpi === '1'));
      routes.push({ id: 'corpi', color: '#dc2626', points: buildRoute(pts) }); // red-600
    }
    if (themes.case) {
      const pts = data.filter((item: any) => item.lat && item.lng && (item.raw?.case === 1 || item.raw?.case === '1'));
      routes.push({ id: 'case', color: '#16a34a', points: buildRoute(pts) }); // green-600
    }
    if (themes.cose) {
      const pts = data.filter((item: any) => item.lat && item.lng && (item.raw?.cose === 1 || item.raw?.cose === '1' || item.raw?.['cose '] === 1 || item.raw?.['cose '] === '1'));
      routes.push({ id: 'cose', color: '#2563eb', points: buildRoute(pts) }); // blue-600
    }
    if (themes.amore) {
      const pts = data.filter((item: any) => item.lat && item.lng && (item.raw?.amore === 1 || item.raw?.amore === '1'));
      routes.push({ id: 'amore', color: '#db2777', points: buildRoute(pts) }); // pink-600
    }
    return routes;
  }, [themes]);

  return (
    <div className="relative flex flex-col md:flex-row h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {showSplash && (
        <div className={`fixed inset-0 z-[2000] flex items-center justify-center bg-background/95 backdrop-blur-md transition-opacity duration-700 ${fadeSplash ? 'opacity-0' : 'opacity-100'}`}>
          <div className="mx-6 flex max-w-md flex-col items-center text-center">
            <div className="relative mb-6 h-20 w-20">
              <span className="absolute inset-0 rounded-2xl border border-primary/20 animate-pulse" />
              <span className="absolute left-2 top-2 h-4 w-4 rounded-sm bg-orange-500/80" />
              <span className="absolute left-8 top-8 h-4 w-4 rounded-sm bg-purple-500/80 animate-pulse" />
              <span className="absolute left-14 top-14 h-4 w-4 rounded-sm bg-orange-500/80" />
              <span className="absolute left-[18px] top-[18px] h-px w-11 rotate-45 bg-muted-foreground/60" />
              <span className="absolute left-[42px] top-[42px] h-px w-11 rotate-45 bg-muted-foreground/60" />
            </div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">le vie della parità</p>
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Memoria che cammina</h2>
            <p className="mt-3 text-sm text-muted-foreground">{appDescription}</p>
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

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 border-slate-200 bg-white/50 text-slate-700 hover:bg-white/80 rounded-full px-4 backdrop-blur-md">
              <Filter className="w-4 h-4" />
              <span>Filtri</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[50vh] bg-white/90 backdrop-blur-xl border-t border-white/50 rounded-t-2xl sm:max-w-none">
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
            {appDescription}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto pt-4">
          <FilterPanel
            gender={gender} setGender={setGender}
            ageRange={ageRange} setAgeRange={setAgeRange}
            minAge={minAge} maxAge={maxAge}
            themes={themes} setThemes={setThemes}
          />
        </div>

        <div className="p-4 border-t border-white/50 bg-white/30 text-center">
          <p className="text-xs text-slate-500 font-medium font-sans">
            Mostrando {filteredMarkers.length} su {data.length}
          </p>
        </div>
      </div>

      {/* MAPPA */}
      <div className="flex-1 relative z-0">
        {/* Badge Fluttuante Desktop */}
        <div className="hidden md:block absolute top-4 right-4 z-[999]">
          <Card className="px-5 py-2.5 shadow-xl border border-white/40 bg-white/70 backdrop-blur-xl rounded-full">
            <p className="text-sm font-bold text-slate-700"> {filteredMarkers.length} Pietre filtrate</p>
          </Card>
        </div>
        <MapComponent markers={filteredMarkers} routes={thematicRoutes} />
      </div>

    </div>
  )
}

import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import data from '../data.json';
import MapComponent from './MapComponent';
import FilterPanel from './FilterPanel';
import type { GenderFilter } from './FilterPanel';
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
  // Parsing Age from data
  const validAges = data
    .map((d: any) => parseInt(d.age))
    .filter((a: number) => !isNaN(a) && a > 0);

  const minAge = validAges.length ? Math.min(...validAges) : 0;
  const maxAge = validAges.length ? Math.max(...validAges) : 100;

  const [gender, setGender] = useState<GenderFilter>('all');
  const [ageRange, setAgeRange] = useState<[number, number]>([minAge, maxAge]);

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

      return true;
    });
  }, [gender, ageRange]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 overflow-hidden font-sans">

      {/* MOBILE HEADER (Visibile solo su schermi piccoli) */}
      <div className="md:hidden flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-white/40 px-4 py-3 shadow-sm z-10 relative">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Le vie della parità</h1>
          <p className="text-xs text-slate-600 font-medium">Mappa di Milano</p>
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
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* SIDEBAR DESKTOP (Visibile solo da schermi medi in su) */}
      <div className="hidden md:flex flex-col w-80 min-w-80 bg-white/70 backdrop-blur-xl border-r border-white/50 shadow-[10px_0_30px_-5px_rgba(0,0,0,0.1)] z-50 relative h-full">
        <div className="p-6 border-b border-white/40 bg-gradient-to-br from-white/40 to-transparent">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent leading-tight mb-2">
            Le vie <br />della parità
          </h1>
          <p className="text-sm font-medium text-slate-600">
            Esplora le {data.length} pietre posate nella città di Milano.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto pt-4">
          <FilterPanel
            gender={gender} setGender={setGender}
            ageRange={ageRange} setAgeRange={setAgeRange}
            minAge={minAge} maxAge={maxAge}
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
        <MapComponent markers={filteredMarkers} />
      </div>

    </div>
  )
}

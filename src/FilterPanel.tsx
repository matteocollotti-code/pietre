import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export type GenderFilter = 'all' | 'm' | 'f';

interface FilterPanelProps {
    gender: GenderFilter;
    setGender: (g: GenderFilter) => void;
    ageRange: [number, number];
    setAgeRange: (r: [number, number]) => void;
    minAge: number;
    maxAge: number;
}

export default function FilterPanel({
    gender, setGender, ageRange, setAgeRange, minAge, maxAge
}: FilterPanelProps) {
    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Filtra per Genere</Label>
                <div className="flex gap-2 w-full">
                    <Button
                        variant={gender === 'all' ? 'default' : 'outline'}
                        className={`flex-1 ${gender === 'all' ? 'bg-slate-800 text-white' : 'bg-white/50 border-slate-200 backdrop-blur-sm'}`}
                        onClick={() => setGender('all')}
                    >
                        Tutti
                    </Button>
                    <Button
                        variant={gender === 'm' ? 'default' : 'outline'}
                        className="flex-1 bg-purple-50/50 backdrop-blur-sm text-purple-700 border-purple-200 hover:bg-purple-100 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                        data-state={gender === 'm' ? 'active' : 'inactive'}
                        onClick={() => setGender('m')}
                    >
                        Uomo
                    </Button>
                    <Button
                        variant={gender === 'f' ? 'default' : 'outline'}
                        className="flex-1 bg-orange-50/50 backdrop-blur-sm text-orange-700 border-orange-200 hover:bg-orange-100 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                        data-state={gender === 'f' ? 'active' : 'inactive'}
                        onClick={() => setGender('f')}
                    >
                        Donna
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Filtra per Età</Label>
                    <span className="text-sm font-bold text-slate-800 bg-white/50 px-2 py-1 rounded-md backdrop-blur-sm border border-slate-200">
                        {ageRange[0]} - {ageRange[1]} anni
                    </span>
                </div>
                <Slider
                    defaultValue={[minAge, maxAge]}
                    value={ageRange}
                    max={maxAge}
                    min={minAge}
                    step={1}
                    onValueChange={(val: any) => setAgeRange(val as [number, number])}
                    className="my-4"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>{minAge} anni</span>
                    <span>{maxAge} anni</span>
                </div>
            </div>
        </div>
    );
}

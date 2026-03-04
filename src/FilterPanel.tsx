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
                        className="flex-1"
                        onClick={() => setGender('all')}
                    >
                        Tutti
                    </Button>
                    <Button
                        variant={gender === 'm' ? 'default' : 'outline'}
                        className="flex-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        data-state={gender === 'm' ? 'active' : 'inactive'}
                        onClick={() => setGender('m')}
                    >
                        Uomo
                    </Button>
                    <Button
                        variant={gender === 'f' ? 'default' : 'outline'}
                        className="flex-1 bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 data-[state=active]:bg-pink-600 data-[state=active]:text-white"
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
                    <span className="text-sm font-bold text-amber-600">
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

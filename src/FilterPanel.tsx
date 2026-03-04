import { useWebHaptics } from 'web-haptics/react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export type GenderFilter = 'all' | 'm' | 'f';
export type ThemesState = { corpi: boolean; case: boolean; cose: boolean; amore: boolean; };

interface FilterPanelProps {
    gender: GenderFilter;
    setGender: (g: GenderFilter) => void;
    ageRange: [number, number];
    setAgeRange: (r: [number, number]) => void;
    minAge: number;
    maxAge: number;
    themes: ThemesState;
    setThemes: (t: ThemesState) => void;
}

export default function FilterPanel({
    gender, setGender, ageRange, setAgeRange, minAge, maxAge, themes, setThemes
}: FilterPanelProps) {
    const { trigger } = useWebHaptics();

    const handleGenderChange = (value: GenderFilter) => {
        trigger('nudge');
        setGender(value);
    };

    const handleThemeChange = (key: keyof ThemesState, checked: boolean) => {
        trigger(checked ? 'success' : 'nudge');
        setThemes({ ...themes, [key]: checked });
    };

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Filtra per Genere</Label>
                <div className="flex gap-2 w-full">
                    <Button
                        variant={gender === 'all' ? 'default' : 'outline'}
                        className={`flex-1 ${gender === 'all' ? 'bg-slate-800 text-white' : 'bg-white/50 border-slate-200 backdrop-blur-sm'}`}
                        onClick={() => handleGenderChange('all')}
                    >
                        Tutti
                    </Button>
                    <Button
                        variant={gender === 'm' ? 'default' : 'outline'}
                        className="flex-1 bg-purple-50/50 backdrop-blur-sm text-purple-700 border-purple-200 hover:bg-purple-100 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                        data-state={gender === 'm' ? 'active' : 'inactive'}
                        onClick={() => handleGenderChange('m')}
                    >
                        Uomo
                    </Button>
                    <Button
                        variant={gender === 'f' ? 'default' : 'outline'}
                        className="flex-1 bg-orange-50/50 backdrop-blur-sm text-orange-700 border-orange-200 hover:bg-orange-100 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                        data-state={gender === 'f' ? 'active' : 'inactive'}
                        onClick={() => handleGenderChange('f')}
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
                    onValueChange={(val: any) => { trigger(30); setAgeRange(val as [number, number]); }}
                    className="my-4"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>{minAge} anni</span>
                    <span>{maxAge} anni</span>
                </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-200/50">
                <Label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Percorsi Tematici</Label>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between bg-white/50 p-2 py-3 rounded-lg backdrop-blur-sm border border-slate-200 shadow-sm">
                        <Label htmlFor="corpi" className="cursor-pointer font-medium text-slate-700">Corpi</Label>
                        <Switch id="corpi" checked={themes.corpi} onCheckedChange={(c) => handleThemeChange('corpi', c)} />
                    </div>
                    <div className="flex items-center justify-between bg-white/50 p-2 py-3 rounded-lg backdrop-blur-sm border border-slate-200 shadow-sm">
                        <Label htmlFor="case" className="cursor-pointer font-medium text-slate-700">Casa</Label>
                        <Switch id="case" checked={themes.case} onCheckedChange={(c) => handleThemeChange('case', c)} />
                    </div>
                    <div className="flex items-center justify-between bg-white/50 p-2 py-3 rounded-lg backdrop-blur-sm border border-slate-200 shadow-sm">
                        <Label htmlFor="cose" className="cursor-pointer font-medium text-slate-700">Cose</Label>
                        <Switch id="cose" checked={themes.cose} onCheckedChange={(c) => handleThemeChange('cose', c)} />
                    </div>
                    <div className="flex items-center justify-between bg-white/50 p-2 py-3 rounded-lg backdrop-blur-sm border border-slate-200 shadow-sm">
                        <Label htmlFor="amore" className="cursor-pointer font-medium text-slate-700">Amore</Label>
                        <Switch id="amore" checked={themes.amore} onCheckedChange={(c) => handleThemeChange('amore', c)} />
                    </div>
                </div>
            </div>
        </div>
    );
}

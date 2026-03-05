import { useWebHaptics } from 'web-haptics/react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { THEME_CONFIG } from '@/lib/themeConfig';

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
    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Filtra per Genere</Label>
                <div className="flex gap-2 w-full">
                    <Button
                        variant={gender === 'all' ? 'default' : 'outline'}
                        className={`flex-1 ${gender === 'all' ? 'bg-slate-800 text-white' : 'bg-white/50 border-slate-200 backdrop-blur-sm'}`}
                        onClick={() => { trigger('nudge'); setGender('all'); }}
                    >
                        Tutti
                    </Button>
                    <Button
                        variant={gender === 'm' ? 'default' : 'outline'}
                        className="flex-1 bg-purple-50/50 backdrop-blur-sm text-purple-700 border-purple-200 hover:bg-purple-100 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                        data-state={gender === 'm' ? 'active' : 'inactive'}
                        onClick={() => { trigger('nudge'); setGender('m'); }}
                    >
                        Uomo
                    </Button>
                    <Button
                        variant={gender === 'f' ? 'default' : 'outline'}
                        className="flex-1 bg-orange-50/50 backdrop-blur-sm text-orange-700 border-orange-200 hover:bg-orange-100 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                        data-state={gender === 'f' ? 'active' : 'inactive'}
                        onClick={() => { trigger('nudge'); setGender('f'); }}
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

            <div className="space-y-4 pt-2 border-t border-slate-200/50">
                <Label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Percorsi Tematici</Label>
                <div className="flex flex-col gap-3">
                    {(Object.keys(THEME_CONFIG) as Array<keyof typeof THEME_CONFIG>).map((key) => {
                        const theme = THEME_CONFIG[key];
                        const Icon = theme.icon;
                        const themeKey = key as keyof ThemesState;
                        return (
                            <div
                                key={key}
                                className="flex items-center justify-between bg-white/50 p-2 py-3 rounded-lg backdrop-blur-sm border shadow-sm transition-colors"
                                style={{ borderColor: themes[themeKey] ? theme.color + '66' : undefined }}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0"
                                        style={{ backgroundColor: theme.color + '1a', color: theme.color }}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </span>
                                    <span
                                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: theme.color }}
                                    />
                                    <Label htmlFor={key} className="cursor-pointer font-medium text-slate-700">{theme.label}</Label>
                                </div>
                                <Switch
                                    id={key}
                                    checked={themes[themeKey]}
                                    onCheckedChange={(c) => { trigger('nudge'); setThemes({ ...themes, [key]: c }); }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

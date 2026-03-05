import { PersonStanding, House, Package, Heart, type LucideIcon } from 'lucide-react';

export interface ThemeConfig {
    label: string;
    color: string;
    icon: LucideIcon;
}

export const THEME_CONFIG: Record<string, ThemeConfig> = {
    corpi: {
        label: 'Corpi',
        color: '#dc2626',
        icon: PersonStanding,
    },
    case: {
        label: 'Casa',
        color: '#16a34a',
        icon: House,
    },
    cose: {
        label: 'Cose',
        color: '#2563eb',
        icon: Package,
    },
    amore: {
        label: 'Amore',
        color: '#db2777',
        icon: Heart,
    },
};

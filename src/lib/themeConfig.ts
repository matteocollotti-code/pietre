import { PersonStanding, House, Package, Heart, type LucideIcon } from 'lucide-react';

export interface ThemeConfig {
    label: string;
    color: string;
    icon: LucideIcon;
    description: string;
}

export const THEME_CONFIG: Record<string, ThemeConfig> = {
    corpi: {
        label: 'Corpi',
        color: '#eab308',
        icon: PersonStanding,
        description: `Il percorso dei Corpi traccia attraverso la città i luoghi dove vivevano le vittime delle deportazioni nazifasciste. Ogni pietra d'inciampo segna il punto dove una persona fu strappata dalla sua quotidianità, dal suo corpo nello spazio urbano.\n\nQuesto itinerario invita a camminare lentamente, a soffermarsi, a riconoscere le assenze nel tessuto fisico della città. Milano porta ancora i segni di quelle violenze: nelle vie, nei cortili, nei palazzi dove queste donne e questi uomini vissero la loro vita prima che qualcuno decidesse di cancellarne l'esistenza.\n\nOgni tappa è un atto di memoria incarnata: il corpo che cammina incontra il corpo che manca.`,
    },
    case: {
        label: 'Casa',
        color: '#16a34a',
        icon: House,
        description: `Il percorso delle Case attraversa i quartieri milanesi dove la quotidianità domestica fu interrotta dalla persecuzione. La casa, rifugio e identità, divenne anche trappola quando le retate nazifasciste irrupsero nelle abitazioni private.\n\nQuesto itinerario racconta come lo spazio domestico fu violato, come le famiglie furono disperse, come certi indirizzi divennero luoghi di ultima resistenza prima della deportazione.\n\nCamminare tra questi portoni significa riconoscere che la storia non avviene solo nei luoghi pubblici, ma si annida nei corridoi e nelle cucine di ogni casa.`,
    },
    cose: {
        label: 'Cose',
        color: '#2563eb',
        icon: Package,
        description: `Il percorso delle Cose segue le tracce materiali lasciate dalle vittime: gli oggetti, le proprietà, i beni confiscati o abbandonati. La persecuzione nazifascista non si limitò a deportare le persone: ne distrusse anche le vite materiali, sottrasse proprietà, cancellò ogni presenza dall'orizzonte urbano.\n\nQuesto itinerario interroga il valore delle cose come estensione delle persone, come memoria tangibile di chi non c'è più.\n\nOgni indirizzo è anche il luogo dove una storia personale fu brutalmente interrotta, dove oggetti di uso quotidiano divennero reperti di una scomparsa.`,
    },
    amore: {
        label: 'Amore',
        color: '#ef4444',
        icon: Heart,
        description: `Il percorso dell'Amore raccoglie le storie di legami affettivi spezzati dalla persecuzione: coppie separate, famiglie divise, amicizie interrotte dalla violenza della storia.\n\nQuesto itinerario ricorda che ogni vittima era inserita in una rete di relazioni, che ogni deportazione lasciò solitudini e silenzi nelle vite di chi rimase. Camminare su questi passi significa onorare non solo chi fu portato via, ma anche chi aspettò, chi cercò, chi non smise mai di sperare.\n\nL'amore come resistenza, come memoria che sopravvive alla violenza della storia.`,
    },
};

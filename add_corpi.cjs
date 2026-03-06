const fs = require('fs');
const textsStr = fs.readFileSync('src/texts.json', 'utf8');
let texts = JSON.parse(textsStr);

const corpiTexts = [
    {
        "name": "JENIDE RUSSO",
        "theme": "Corpi",
        "text": "Lettera alla madre dell’11 maggio 1944 dal campo di Fossoli\n\n“E ora ti racconto come sono stata arrestata, sono partita alle 8.30 di casa, ti ricordi? Sono andata a prendere delle cose e poi sono andata a portarle a destinazione. Intanto che do la roba mi sono sentita dietro otto persone con rivoltelle spianate: mi hanno perquisita. Poi mi hanno portata in macchina fino a Monza, e lì mi hanno interrogata. Siccome non volevo parlare con le buone allora hanno cominciato con nerbate e schiaffi (non spaventarti). Mi hanno rotto una mascella (ora è di nuovo a posto). Il mio corpo era pieno di lividi per le bastonate; però non hanno avuto la soddisfazione di vedermi gridare, piangere e tanto meno parlare. Sono stata per cinque giorni a Monza, in isolamento in una cella quasi senza mangiare e con un freddo da cani. [...] Poi mi hanno portato a San Vittore.”"
    },
    {
        "name": "IGINIA FIORENTINO",
        "theme": "Corpi",
        "text": "Lettera di Iginia al prefetto di Milano del 5 dicembre 1938 in cui chiede di poter continuare ad avere una donna di servizio: \n\n“La sottoscritta, più che settantenne, è affetta da debolezza cardiaca e non può sopportare alcuna fatica. La sorella Iginia, più che sessantaseienne, fratturatasi circa un anno fa, per una caduta, il collo del femore sinistro, è rimasta impedita. Ha l’arto rigido e ha bisogno di sostegno e di aiuto continuo”"
    },
    {
        "name": "ADELE BASEVI",
        "theme": "Corpi",
        "text": "Testimonianza della figlia Renata dopo la fine della guerra: \n\n“Un brutto giorno [3 dicembre 1943] vennero [...] ad arrestare mia madre, [...] si portarono via la mia - dolce mamma - davanti ai miei occhi, mentre, in quel momento, io che rientravo in casa, venni nuovamente salvata dalla portiera della casa che mi chiuse a chiave in una stanza per impedirmi di subire la stessa sorte. Vidi mia madre passare con la testa alta in mezzo a due guardie e questa visione mi fece impazzire e mi accompagnò e mi accompagnerà per tutto il resto della mia vita”"
    },
    {
        "name": "ANGELO COLOMBO",
        "aliases": ["ERNESTINA LATTES"],
        "theme": "Corpi",
        "text": "Milano, 13/12/1944 XXIII\nOggetto: Colombo Angelo fu Donato e Moglie Lattes Ernestina fu Raffaele = ebrei =\nAl Capo della Provincia\nSegreteria Particolare\n\n“I coniugi Colombo Lattes come risulta dall'unita relazione sanitaria del dott. Gian Maria Bellinzona, vistata anche dal primario medico prof. dott. Ferruccio Marcom, del detto Ospedale non risultano fisicamente idonei a sopportare il regime di detenzione o di internamento”."
    },
    {
        "name": "LILIANA LATIS",
        "theme": "Corpi",
        "text": "Annotazione riportata nel registro compilato alla frontiera svizzera di Pugerna–Caprino accanto al nome di Lilliana dalla guardia di turno alla dogana, caso unico in tutto il registro di una nota personale, il commento è sottolineato in rosso: \n\n«quella che mi è piaciuta di più»"
    },
    {
        "name": "AURELIA FINZI",
        "aliases": ["ALLEGRA FINZI", "EMMA FINZI"],
        "theme": "Corpi",
        "text": "Lettera dell’estate del 1945 di Anna Bertolaso, l’amica “ariana” che ha accompagnato le donne nel loro viaggio indirizzata a Giulio figlio di Aurelia e fratello di Emma che era emigrato in Inghilterra nel 1938 \n \n“Io rimasi dentro [a an Vittore] ancora tre settimane durante le quali io vidi parecchie volte l’Emmina passando davanti al cancello del suo raggio per recarmi o al laboratorio o agli interrogatori; ma purtroppo lei non mi vide mai. Il giorno in cui fui liberata chiesi di affacciarmi al cancello e ottenni di farlo, purché non rivolgessi la parola a nessuno. Lei era in fondo al corridoio, rivolta verso il finestrone; qualcuno andò ad avvertirla, lei si voltò, ma in quel momento il secondino mi portò via ed i nostri occhi non poterono incontrarsi”"
    },
    {
        "name": "IDA MAFALDA MORAIS",
        "aliases": ["GRAZIELLA MORAIS"],
        "theme": "Corpi",
        "text": "Deposizione del comandante della Guardia di Finanza a Sasso del Gallo dell’11 novembre 1944\n\n“Verso le ore 12.30 vidi quattro persone che si dirigevano verso la caserma; erano stanche, bagnate e avvilite. Domandai loro cosa cercassero e mi raccontarono che due guide avevano preteso L. 7000 per accompagnare loro alla guida di confine”\n\nAldo Zargani, nell’autobiografia Per violino solo, ricorda i cugini Morais: la zia Ida Mafalda e la cugina Graziella, ‘p.73\n\n“La zia Mafalda non assomigliava affatto di carattere alla mamma, era fisicamente trepidante e apparentemente indifesa, i capelli un po’ scompigliati, a me non sembrava neppure bella invece lo era ma di una bellezza connessa all’indolenza che a me, bambino, sfuggiva [...] Graziella, la sorella di Alberto, linfatica era una “signorinetta” vestita di pizzi e velluti leggeri come un’adolescente regale e tutte dicevano che era identica alla sua mamma: non giocava con me perché era grande, ma mi trattava con affetto e molti sorrisi”"
    },
    {
        "name": "ANTONIA FRIGERIO CONTE",
        "theme": "Corpi",
        "text": "Maria Massariello Arata, Il ponte dei corvi, Mursia, p. 78\n\nTorno ad appollaiarmi nel mio giaciglio accanto alla mia compagna fedele Antonia Conte. Trascorriamo alcuni giorni nel Block 21, iniziando col terribile appello mattutino e terminando con l'estenuante appello serale. Naturalmente ogni giorno porta con sé una sua particolare, imprevista tortura. «Achtung! In Reihe!». Portate fuori del Block in fila per cinque, marciamo verso il Revier (l'infermeria). Qui giunte, con zoccoli in mano, entriamo: ora a porta aperta dobbiamo denudarci, sfilare davanti ad un medico SS, indi sdraiarci su un lettino a gambe divaricate per un prelievo ginecologico. L'ansa per il prelievo viene passata da una prigioniera all'altra frettolosamente, con un rapido insignificante passaggio sopra un'invisibile fiammella ad alcool. Ancora una dura prova per il nostro morale ed il nostro fisico. Il giorno dopo: «Aufstehen!». Ancora marcia in fila per cinque al Revier. Nel corridoio al solito dobbiamo denudarci e, nude, in fila, attendere lungamente il nostro turno di visita. Per questa siamo introdotte in una stanza con due-tre finestre completamente spalancate, quindi in un terribile vortice d'aria. [...]Si capisce: ogni momento della vita del Lager deve rappresentare un'umiliazione della nostra personalità, una dura prova per il nostro fisico, un'occasione di sperimentare l'«homo homini lupus». [...]. Avanti a me marcia Antonia con la sua testa scheletrica in cui brillano i due occhi nerissimi. Le spalle piagate e piene di lividi, i seni svuotati, le gambe fortemente edematose con estese piaghe violacee crostose. La sua espressione è quella di un docile agnello spaurito. Fa tanta tenerezza questa mia cara gentile compagna di martirio ed il grido di «Heraus» che la colpisce mi pietrifica, mi oscura la mente[...]. Guardo con desolazione la mia cara amica di cui riesco ancora a cogliere un ultimo sguardo accorato e i nostri destini si sono divisi per sempre."
    },
    {
        "name": "LUIGIA GIACOBBI",
        "aliases": ["CARLO FERRETTI"],
        "theme": "Corpi",
        "text": "Relazione del prefetto di Como alla direzione generale di pubblica sicurezza del 25 gennaio 1930\n\nNei confronti dei suddetti viene comunque esercitata una continua e ininterrotta vigilanza.\n\nRelazione del prefetto di Como alla direzione generale di pubblica sicurezza del I febbraio 1930\n\nNegli atti della locale Questura non risultano pregiudizi penali a carico della predetta che presenta i seguenti connotati:\nEtà: anni 31\nOcchi: castani\nCapelli: neri\nStatura: giusta"
    },
    {
        "name": "ARIANE DUFAUX",
        "aliases": ["OTTO POPPER"],
        "theme": "Corpi",
        "text": "Lettera di Ariane Dufaux a Giuseppe Speroni detenuto a San Vittore dell’ 11 novembre 1944\n\n[...]Un'altra grande gioia per me sarebbe sapere esattamente dove si trova il corpo di Otto.\nLe parole del vostro amico mi lasciano sperare che non sia stato né cremato, né gettato in una fossa comune, ma... Insomma, chiedeteglielo. Otto mi disse di aver espresso due desideri nella sua vita: il primo nel battistero di Pisa dove eravamo insieme, quando chiese che io fossi la donna di tutta la sua vita e che lo amassi più di ogni cosa. Il secondo, in prigione, fu che quella separazione forzata fosse l'ultima. Vorrei quindi con tutta la mia anima che il suo secondo voto fosse esaudito come il primo e che, quando il mio compito quaggiù sarà finito, io possa dormire accanto a lui[...].\n\nLettera di Ariane Dufaux a Giuseppe Speroni detenuto a San Vittore dell’ 1 aprile 1944 \n\n“Mio amore adorato, ti amo, ti amo. Sono grassa! E brutta, ho delle piccole macchie gialle sul viso a causa dei piedi del n°2. Ma in compenso ho finalmente i capelli di una bella tonalità rossa! Non so se li valorizzo appieno ma pazienza!”"
    },
    {
        "name": "ENRICA FOA’",
        "aliases": ["ENRICA FOA", "GIORGIO FOA"],
        "theme": "Corpi",
        "text": "Lettera della zia di Enrica al Questore di Como\nComo, 23 Febbraio 1944-XXII\nSig. QUESTORE DI COMO\n\nLa sottoscritta LUCIA BIANCOTTI [...] implora alla S.V. il suo valido appoggio per quanto segue:\nLa scrivente è a conoscenza che nel novembre scorso sono stati arrestati a Ponte Chiasso il cognato Foà Prof. precedentemente del liceo Berchet di Milano unitamente alla propria figlia Enrica di anni 17 ed il figlio Giorgio di anni 12 perché ritenuti ebrei.\nI parenti di cui trattasi come ascendenza sono figli di madre italiana, di razza Ariana di religione Cattolica.\nRivolge quindi caldo appello alla S. V. Ill.ma perché si compiaccia provvedere per ridonare la libertà negata ai parenti di cui sopra rivolgendosi al Comando Tedesco."
    },
    {
        "name": "GIANLUIGI BANFI",
        "aliases": ["JIULIA BANFI", "GIULIA BANFI", "JULIA BANFI"],
        "theme": "Corpi",
        "text": "Gian Luigi Banfi, Amore e speranza: corrispondenza tra Julia e Giangio dal campo di Fossoli, aprile-luglio 1944, Archinto, 2009\n\nDiario di Julia Bertolotti Banfi 21 agosto 1944\n\nDa una settimana sono qua a Lanzo a riposarmi. Mi lascio vivere senza voglia di niente, solo dormire, dormire: mi sembra veramente di esser morta, come un fantoccio floscio. Solo mi dà piacere vedere la vita esuberante e prepotente nel Giuliano: vedere muovere i muscoli nuovi sotto la pelle scura delle sue gambotte, sentire la sua mano nella mia."
    },
    {
        "name": "META MARIE KUH",
        "aliases": ["EMILIO WINTER", "MARIA META KUH"],
        "theme": "Corpi",
        "text": "Lettera di Meta Marie Kuh al Ministero degli Interni, 4 agosto 1941\n\n“La sottoscritta sofferente da qualche tempo di acuti dolori al lato destro del petto si decise a recarsi da un medico specialista, per una visita, che diagnosticò trattarsi di un tumore alla mammella destra per cui è indispensabile un urgente intervento chirurgico. Data la gravità e l’urgenza della cosa la sottoscritta prega codesto Ministero di voler concedere al proprio marito una licenza per assisterla nel doloroso frangente ed accudire il figlio in tenera età (sei anni)”"
    },
    {
        "name": "OLGA LOEWY",
        "aliases": ["GIUSEPPE SEGRE"],
        "theme": "Corpi",
        "text": "Lettera del comandante della Polizia di Sicurezza di Milano al Capo della Provincia di Milano del 23 maggio 1944\n\nOggetto: Ebreo Giuseppe Segre, nato il 30.3.1873, Milano, cittadino italiano, ammogliato, residente a Inverigo via Armando Diaz 2 \nIl suddetto ebreo venne arrestato il 22 maggio 1944 unitamente alla moglie Olga nata Levi il 12.11.1878 a Torino. Gli stessi trovansi al presente nella prigione di S. Vittore di Milano e sono compresi nelle misure di evacuazione disposte per gli ebrei."
    },
    {
        "name": "BAHIA SILVERA",
        "theme": "Corpi",
        "text": "Lettera di Bahia al figlio Salomone che viveva in Egitto del 20 febbraio 1939\n\n“Per il freddo ti raccomando di stare attento, e metti i golf con le maniche di lana, l’hai fatti mai lavare?”. \n\nLettera di Bahia al figlio del 31 maggio 1940\n\n“Da voi com'è il tempo sono sicura bastansa caldo, fai tanta attenzione che non prendi qualche colpo di sole nella testa e non bere acqua quando sei accaldato, e asciughi bene il sudore e non stare alla corrente”"
    },
    {
        "name": "VIOLETTA SILVERA",
        "theme": "Corpi",
        "text": "Lettera del padre di Violetta, Salomone Silvera, al prefetto di Milano del 27 marzo 1939: \n\n“Violetta è studentessa al IV corso magistrale e deve conseguire il diploma di insegnante onde mettersi in condizione di aiutare, un domani, la mia famiglia, essendo io per età inabile al lavoro”"
    },
    {
        "name": "MARIA FONTANIN FILLINICH",
        "aliases": ["MARIA FONTANIN", "MARIA FILLINICH"],
        "theme": "Corpi",
        "text": "Lettera a la figlia Liliana dal campo di Merano 4 ottobre 1944\n\nDomani stesso partiamo quasi tutte per Bolzano, mi rincresce molto andare via da qui ero ambientata e non si aveva l’impressione del campo, pure lavorando e sottoposte a disciplina eravamo contente dell’ambiente, ci rincresce molto questo spostamento, per quanto eravamo preparate e questa per noi è un’incognita se staremo a Bolzano oppure se ci manderanno ad altra destinazione. \nQuesto movimento manderà all’aria tutto, spero questo movimento non sia proprio sfavorevole me lo auguro e tutta un’incognita che Iddio ci aiuti sono sempre assieme alle mie compagne e siamo rassegnate ad ogni sorte, unica cosa c’è da augurarsi che tutto finisca presto e liberarci tutto da questa situazione penosa, scusami se non ti scrivo come vorrei non so coordinare le idee, mi rincresce molto questo movimento, mi sentirò sempre vicina benché lontana, ed ora non sappiamo quali disposizioni ci saranno, se ci mandano ad Innsbruck, così si crede ne dicono tante le vere disposizioni non si conoscono mai, un ordine improvviso cambia tutto, sono situazioni che ti senti tremendamente schiava."
    }
];

texts = texts.concat(corpiTexts);
fs.writeFileSync('src/texts.json', JSON.stringify(texts, null, 2));


const fs = require('fs');

const dataStr = fs.readFileSync('data.json', 'utf8');
const data = JSON.parse(dataStr);

const textsStr = fs.readFileSync('src/texts.json', 'utf8');
let texts = JSON.parse(textsStr);

// --- Append CASE texts ---
const caseTexts = [
    {
        "name": "JENIDE RUSSO",
        "theme": "Casa",
        "text": "Lettera alla madre del 9 maggio 1944 dal campo di Fossoli\n\n“Sono contenta di avere qui con me una fotografia scattata sul nostro pianerottolo. Così mi sembra di essere a casa [...] Quello che più mi preoccupava era il fatto che volevano venire a casa a perquisire [...] Mamma, come mi dispiace di averti fatto passare delle ore così angosciose. Quando mi hanno preso quello che mi faceva più soffrire era il pensiero di te mamma, il dispiacere che tu dovevi provare. Non potevo fare niente per farti avvisare. L’ossessione che potessi ammalarti o disperati per quello che è successo era insopportabile”"
    },
    {
        "name": "ANGELO AGLIERI",
        "theme": "Casa",
        "text": "Testimonianza della moglie, Aldina Maria, nel libro Mai più. Testimonianze e storie pavesi dai Lager nazisti, 1997\n\n\"Non preoccuparti, stai tranquilla, vedrai che tutto si risolve, verrò a casa presto. Devi fare solo una cosa\". E così vengo a sapere che nella stufa in casa — una di quelle stufe di una volta, alte, di ghisa — Angelo ha nascosto una bomba” «Devi portarla via subito, non c'è un minuto da perdere, o sarà peggio per te e per me. Ti spiego io come fare». Non avevo mica scelta. M'infilo l'impermeabile e con una paura santissima che ancora oggi, ricordando quei momenti, mi vengono i brividi metto in tasca la bomba. Corro da un'amica. «Dai, vieni anche tu con me». È maledettamente rischioso, ma lei ci sta. Dopo otto giorni, o forse più, arrivano a perquisirmi la casa, tutto previsto. Allora abitavo in viale Monza 23. Un pomeriggio sento bussare alla porta: era la portinaia con questi qua. Chiedo che rimanga anche lei, sennò non apro. Figurarsi. Mi dicono che se anche non apro, aprono da sé. La portinaia, però, resta lì. Tagliano la fodera del divano, squarciano i quadri, buttano per aria tutta la casa. Poi finalmente se ne vanno.”"
    },
    {
        "name": "FRIEDA LEHMANN",
        "theme": "Casa",
        "text": "Lettera di Siegfried Lehmann al questore di Milano del 28 febbraio 1939: \n\n“Egli è vedovo e convive colle uniche due figlie che non sono in grado di sostituirsi alla domestica nel disbrigo dei lavori di casa. Difatti la prima, Frieda, di anni 24, non è fisicamente idonea allo scopo, come risulta dall accluso certificato medico, mentre la seconda, di nome Isolde, di anni 23, è studentessa di agraria dell’Università di Milano, sta per laurearsi e deve dedicare tutte le sue attività e tutto il suo tempo agli studi stessi”"
    },
    {
        "name": "ARIANE DUFAUX",
        "aliases": ["OTTO POPPER"],
        "theme": "Casa",
        "text": "Lettera di Ariane al marito Popper mentre lui era detenuto a San Vittore del 14 marzo 1944\n\n[...]Abbiamo dovuto lasciare M. a causa degli sfollati nelle montagne che causano problemi agli altri. È un peccato, ma insomma, pazienza. La casa qui è molto bella, del tutto adeguata, ed è stata una vera impresa trovarla. E per le mie condizioni, forse è meglio essere vicini all'ospedale. La nuova casa ne disterà appena 200 metri. Pensiamo di entrarci verso il 20.[...].\nDa qualche giorno siamo in hotel (perché il tuo amico ospitava cognata e cognato) e Michel dorme con me; ne è entusiasta, ma il piccolo, per quanto sia, riesce a occupare quasi quanto te e dorme sempre di traverso. [...]Dal punto di vista dei bombardamenti, ovviamente non so se questo sia il luogo ideale e, se vedrò che ci sono inconvenienti, potrò cambiare.\n\nLettera di Ariane al marito Popper mentre lui era detenuto a San Vittore del 21 marzo 1944\n\nLunedì penso di andare nella casa nuova e, non appena troverò la macchina fotografica, ti scatterò nuove foto. Il nuovo appartamento è molto bello e siamo stati fortunati a trovarlo.\nIn montagna ci sono sempre più \"ribelli\" [partigiani], e tra una vicenda e l'altra non è più prudente abitarvi. Il giorno in cui siamo partiti, sono venuti a casa alle 3 del mattino (io non li ho visti ma solo sentiti), sono entrati direttamente nella camera da letto di Tina e hanno obbligato suo marito a seguirli!! Lo hanno condotto in montagna al loro rifugio; per fortuna sono arrivati i soldati tedeschi quasi contemporaneamente e \"i ribelli\" si sono dovuti mettere al riparo, mentre Ch. ne ha approfittato per andare verso i tedeschi e da allora abbiamo abbandonato la montagna. E ogni giorno continuano le storie lassù. Quindi abbiamo traslocato tutto e lasciato la casa (era proprio la fine dei tre mesi)."
    },
    {
        "name": "MARIA META KUH",
        "aliases": ["EMILIO WINTER", "META MARIE KUH"],
        "theme": "Casa",
        "text": "Lettera di Meta Maria Kuh inviata al Ministero dell'Interno il 3 maggio 1943.\n\n“La sottoscritta Maria Winter abitante a Milano in via Luisa Sanfelice 12, moglie di Emilio Winter internato nel Comune di Castelraimondo (Macerata) fa con la presente rispettosa domanda di potere col figlio Alfredo visitare il marito nella sua residenza. Egli fu in questi ultimi tempi ammalato e ricoverato all'ospedale di Camerino e da pochi giorni dimesso. Chiederebbe se possibile una permanenza di un mese presso il marito per prestargli le cure necessarie alla sua convalescenza”"
    },
    {
        "name": "EUGENIO GLUCKSMANN",
        "aliases": ["ELENA GLUCKSMANN"],
        "theme": "Casa",
        "text": "Lettera di Elena Gluksmann, figlia di Eugenio al ministero dell’interno del 16 luglio 1942.\n\n[...]la Direzione del Campo ebbe a communicate che codesto On. Ministero, non potè e non può aderire alla domanda da me fatta perchè al mio papà fosse concesso il confinamento nella provincia di Milano.\nForse io nella mia domanda o meglio, nella mia supplica, ho avuto il torto di limitarmi a chiedere la provincia di Milano, e questo errore io oggi cerco di correggere permettendomi di chiedere che almeno sia concesso al mio papà di essere trasferito anche per le ragioni suesposte in provincia di Como o di Varese."
    },
    {
        "name": "LEA BEHAR",
        "aliases": ["SARA DANA"],
        "theme": "Casa",
        "text": "Lettera dalla direzione ospedaliere sull’arresto di Sara Dana del 13 gennaio 1944\n\nNel pomeriggio del 29 dicembre u.s. a seguito della richiesta verbale di un ufficiale delle Truppe S.S. il Comandante la Stazione dei Carabinieri di Pietra Ligure, ha voluto essere informato se tra le ricoverate di questi Istituti, trovavasi la malata:\nDana Sara fu Giuseppe e di Behar Lea, nata a Milano il 16 ottobre 1927 - accolta nella divisione medica il 29 ottobre 1943 - con la diagnosi di \"mesenterite\".\n“L'inferma già sfollata prima del ricovero a Cantù, presso la famiglia Modena abitante in detta città Via Francesco Daverio N° 13, era ricercata perché di \"razza ebraica\".\nLa sera dello stesso giorno 29 dicembre, un Ufficiale ed un Sottufficiale che si ritengono appartenenti alla Truppe S.S. Sicherheitsdienst Leitstelle di Genova, si sono presentati a questi Istituti, accompagnati dal comandante la stazione dei Carabinieri di Pietra Ligure, ritirando la malata e trasportandola in automobile verso ignota destinazione.”"
    },
    {
        "name": "EGLE RIGOLA",
        "aliases": ["MINO STEINER"],
        "theme": "Casa",
        "text": "Lettera di Egle Rigola Steiner a Mino detenuto a Fossoli  19 maggio 1944\n\nMino mio caro\nmi pare ingiusto che io sia qui, nella nostra casa, con i nostri cocchi, che il mio occhio si riposi sulle cose nostre e tu non sia qui."
    },
    {
        "name": "HILDA SEMENZA",
        "aliases": ["ROBERTO LEPETIT"],
        "theme": "Casa",
        "text": "S.Sala Massari, Roberto Lepetit. Un industriale nella resistenza. Dal diario di Hilda, pp.175-177\n\n29 settembre 44 Comincia qui l’angosciosa lotta per un salvataggio, comincia il nostro vagare da una casa all’altra, da amici e parenti, un po’ restii ad ospitarci.\n20 ottobre. Arriviamo a Verona dove mi depositano all’albergo dove c’è Silvio a Prato, militare trait de union tra tedeschi e italiani. Speravo qualche appoggio…ma niente!\n21 ottobre. Verona. M'arrabatto da sola, non riesco a niente!\n22 ottobre [...]dormo clandestinamente all’albergo della città\n31 ottobre. Ho dormito ogni notte in un altro letto. Tutti molto gentili con me (ma non vogliono rischiare), io non avevo nè documenti nè permessi. \n27 aprile 1945\nPare che a Milano tedeschi e repubblichini siano scappati. Io ho il pensiero continuo del ritorno di Roby e voglio tornare a casa."
    },
    {
        "name": "CARLOTTA THOMAS",
        "theme": "Casa",
        "text": "Testimonianza di un operaio della Borletti dopo la fine della guerra:\n\n“E poi ricordo bene la Thomas Carlotta che, purtroppo, non ce la fece... Era una delle figure determinanti del settore macchine automatiche, dove c'era anche la Negri. La Thomas Carlotta era un'impiegata che con molta abilità riusciva a giustificare l'assenza di alcune figure - uomo o donna che fossero (le donne spesso dovevano uscire dalla fabbrica per stampare i volantini, distribuire la stampa...); loro risultavano sempre presenti in fabbrica; questo è il grande merito che ha avuto questa donna nell'ambito delle formazioni partigiane”"
    },
    {
        "name": "MARGHERITA BOHM",
        "aliases": ["MICHELANGELO BOHM"],
        "theme": "Casa",
        "text": "Lettera di Michelangelo Bohm al Questore di Como 6 gennaio 1944\n\n“Nell’età di oltre 76 anni di salute cagionevole che abbisogna di cure giornaliere dalla propria moglie in assenza di figlioli e di altri familiari, chiede di essere libero di uscire da questo luogo, fissando provvisoriamente il suo domicilio in un albergo di questa città, salvo di ritornare a casa a Maggio, non appena fosse concessa la libertà anche alla propria moglie, indisposta, pronta ad esser sottoposta a visita medica se necessario. Si permette far rilevare che la moglie stessa è pratica delle cure necessarie al proprio marito e del regime alimentare cui deve esser sottoposto, avendo già da anni dispensato questo compito”."
    }
];

// --- Append AMORE texts ---
const amoreTexts = [
    {
        "name": "JENIDE RUSSO",
        "theme": "Amore",
        "text": "Lettera alla madre dal campo di Fossoli del 9 maggio 1944\n\n“Mamma, come mi dispiace di averti fatto passare delle ore così angosciose. Quando mi hanno preso quello che mi faceva più soffrire era il pensiero di te mamma, il dispiacere che tu dovevi provare. Non potevo fare niente per farti avvisare. L’ossessione che potessi ammalarti o disperati per quello che è successo era insopportabile”.\n\nLettera al fidanzato Renato dal campo di Fossoli del 21 giugno 1944\n\n“Carissimo Renato, sono passati parecchi giorni, ma ancora non ho ricevuto tue nuove, come mai? Non credo che tu mi abbia dimenticato. E siccome non so quando potrò vederti, ti prego di scrivermi una lettera, perché così partendo per ignota destinazione avrò un tuo ricordo. [...] Ricordo i giorni lieti passati con te e anche però le belle sgridate che mi facevi. Qui i tuoi compagni mi dicono che sono un buon elemento e questo per me significa molto. Tu mi dicevi che non bisogna mai dire niente alle donne; ma dovevi sapere a che donna parlavi. Tu certo non lo sapevi.”"
    },
    {
        "name": "VIOLETTA SILVERA",
        "theme": "Amore",
        "text": "Liliana Segre ricorda l’incontro con Violetta Silvera e la madre nel carcere di Varese:\n\n“Mi appoggiai alla porta richiusasi alle mie spalle. Piangevo angosciata, a occhi chiusi per la paura non volevo guardare. L’idea di essere in prigione, dentro una cella, era troppo per me. Aprii gli occhi solo quando sentii che qualcuno mi stava abbracciando. Era una ragazza bellissima. Si chiamava Violetta Silvera, aveva diciannove anni ed era stata arrestata due giorni prima insieme ai suo genitori, anche loro respinti dalla Svizzera. Era la bella ebrea biblica: gli occhi viola, da qui il suo nome, e una magnifica corona di trecce nere intorno al volto. Sua madre invece aveva la treccia grigia lasciata sulla schiena. Anche lei era bellissima [...] «Non piangere, vieni vicino a me e stai sempre vicino a me e alla mia mamma» mi sussurrò Violetta. Restai abbracciata a loro, come un naufrago alla sua zattera, per tutto il tempo in cui rimasi a Varese”.\n\nLettera non datata di Violetta all’amica Nadia (circa 1939)\n\n“La sera mi dà la pace, ma non una pace di morte, di rinuncia; tutto il contrario: una pace che non esclude la vita, anzi ne è la sublimazione, il momento più bello: è armonia, ecco, e così si spiega ancora meglio anche la somiglianza che vedevi tra la sera e la musica. (…) Come vedi anche per lettera io discuto (malattia cronica) Ma il male è che manca proprio l’elemento essenziale e indispensabile per ogni discussione: e cioè l’opposizione. Era ben diverso sulla tua terrazza, là, in alto, sopra tutti gli altri tetti, da cui abbiamo visto tanti cieli. Ma quei tempi ritorneranno, ne sono certa”"
    },
    {
        "name": "ANGELO AGLIERI",
        "theme": "Amore",
        "text": "Testimonianza della moglie, Aldina Maria, nel libro Mai più. Testimonianze e storie pavesi dai Lager nazisti, 1997, pp.89-90\n\n“Un giorno venne da me una signora non mi ricordo come si chiamava, forse Campili o Campiglio che aveva anche lei il marito detenuto a Fossoli. Fu un incontro strano, furtivo, sempre con la paura addosso di essere viste, lei temeva di essere stata seguita. Non ci eravamo mai viste eppure ci abbracciammo come fossimo state amiche di vecchia data. [...] Non preoccuparti, stai tranquilla, vedrai che tutto si risolve, verrò a casa presto. Devi fare solo una cosa\". E così vengo a sapere che nella stufa in casa — una di quelle stufe di una volta, alte, di ghisa — Angelo ha nascosto una bomba. Devi portarla via subito, non c'è un minuto da perdere, o sarà peggio per te e per me. Ti spiego io come fare». Non avevo mica scelta. M'infilo l'impermeabile e con una paura santissima che ancora oggi, ricordando quei momenti, mi vengono i brividi metto in tasca la bomba.\nCorro da un'amica. «Dai, vieni anche tu con me». È maledettamente rischioso, ma lei ci sta. Dopo otto giorni, o forse più, arrivano a perquisirmi la casa, tutto previsto. Allora abitavo in viale Monza 23. Un pomeriggio sento bussare alla porta: era la portinaia con questi qua. Chiedo che rimanga anche lei, sennò non apro. Figurarsi. Mi dicono che se anche non apro, aprono da sé. La portinaia, però, resta lì. Tagliano la fodera del divano, squarciano i quadri, buttano per aria tutta la casa. Poi finalmente se ne vanno”."
    },
    {
        "name": "LILIANA LATIS",
        "theme": "Amore",
        "text": "Lettera di Liliana Latis scritta durante gli anni della guerra da Imbersago alla cugina Martina\n\n[...] Ebbene si, siamo nati per soffrire, ma io sono ancora nella primavera della vita e l’amore mi sorride e tante altre belle cose. [...]”"
    },
    {
        "name": "AURELIA FINZI",
        "aliases": ["ALLEGRA FINZI", "EMMA FINZI"],
        "theme": "Amore",
        "text": "Lettera dell’estate del 1945 di Anna Bertolaso, l’amica “ariana” che ha accompagnato le donne nel loro viaggio indirizzata a Giulio figlio di Aurelia e fratello di Emma che era emigrato in Inghilterra nel 1938 \n \n“Col treno andammo a Pino Tronzano, lì in una vecchia casa ci incontrammo con la guida e col Milite di Finanza che avrebbe dovuto essere addetto all’ispezione del confine e che avrebbe dovuto fingere di non incontrarci. Pernottammo alla meglio in casa di una buona donna: a noi si era aggiunta anche una povera donna con tre ragazzetti. Partimmo all’alba cercando di raggiungere il confine in una località chiamata “le Fornasette”. Per un po’ di tempo tutto andò bene, riuscimmo a superare la pattuglia tedesca senza essere visti, ma ad un certo punto ci trovammo di fronte alla pattuglia dei Militi confinari, lì per lì non ci spaventammo credendo si trattasse di quelli che avrebbero dovuto fingere di non vederci, figurati quindi la nostra meraviglia quando ci sentimmo intimare l’alt. Ci fermammo, ci chiesero le generalità e poi ci portarono alla caserma. [Le donne vengono poi portate tutte e tre a san Vittore e messe in raggi diversi] Per qualche giorno ci vedemmo alla passeggiata e, nonostante l’attenta sorveglianza delle sentinelle riuscimmo a comunicare. [...]"
    },
    {
        "name": "FRIEDA LEHMANN",
        "theme": "Amore",
        "text": "Lettera di Siegfried Lehmann al questore di Milano del 30 giugno 1940\n\nL’educazione impartita dallo scrivente alle sue figliuole, completamente affidata alla sue cure dopo la morte della loro madre, è stata sempre improntata a sentimenti di italianità quali sono quelli che oggi si richiedono in una futura madre italiana e fascista.”\n\nLettera di Frieda a “Carissima signorina”, 31 gennaio 1944: \n\n“Spero ottenere in seguito esposto Ministero la liberazione per matrimonio, purché parta poi subito con Salvatore per la Spagna. Nel periodo in carcere Como Salvatore si è dimostrato un tesoro con me e piangeva spesso per vedermi in un simile posto. Ormai si è stanchi e qui mi hanno dato buone speranze, diventando spagnola [...] Anche il mio tesoro mi ha mandato le dolcezze e mi ha fatto dire di stare tranquilla che farà tutto lui per riuscire a liberarmi e poi penseremo subito alla nostra felicità”.\n\nLettera di Frieda a  “Cara signora”  8 gennaio 1944\n\n“mi trovo ancora qui prigioniera nello stesso posto. Il mio Salvatorino è stato liberato quattro giorni fa come suddito spagnolo ed ora lui stesso sta facendo le pratiche per liberarmi. Tenta di sposarmi per farmi diventare spagnola, perché è l’unica strada per uscire di qui. Io ho anche scritto al Prefetto una lettera accompagnata da un certificato medico. Il mio tesoro è un vero tesoro, le parole dolci che mi ha scritto dopo uscito di qui, o il mangiare che mi manda per la paura che m’indebolisca troppo, è addirittura commovente. Quando era qui dentro in caserma anche lui, io mi facevo allegra anche se internamente mi sentivo abbattuta e a lui veniva da piangere al pensiero di vedermi anch’io detenuta. Ora lui non si darà pace come mi ha scritto finché non mi avrà liberato in qualche modo. [...]. Spero di uscire di qui e essere finalmente felice per sempre dopo tante sofferenze patite in due”."
    },
    {
        "name": "OLGA LOEWY",
        "aliases": ["OLGA LOEWY SEGRE", "GIUSEPPE SEGRE"],
        "theme": "Amore",
        "text": "Liliana Segre, Fino a quando la mia stella brillerà, Battello a vapore, p. 24\n\n“L’altra nonna, Olga, con la quale vivevo, la mamma del mio papà, era una donna molto diversa da Bianca. Era severa e riservata, e io non sono mai stata molto gentile con lei, anzi le facevo un sacco di dispetti! Povera nonnina! [...] Però poi mi sono ricreduta…Quanto coraggio in nonna Olga nei momenti tragici della sua vita, quando nonno Pippo era malato e stanco e i nazisti li portarono lo stesso ad Auscwhtiz…Nonna Olga non si perse mai d’animo e lo sostenne fino all’ultimo”"
    },
    {
        "name": "ANTONIA FRIGERIO CONTE",
        "aliases": ["ANTONIA CONTE"],
        "theme": "Amore",
        "text": "Maria Massariello Arata, Il ponte dei corvi, Mursia, p. 91\n\nIl mio pensiero va tristemente ad Antonia Conte che è stata una dolce compagna dal carcere di S. Vittore a Milano ed alla signora Cellini. Antonia nella sua debolezza molte volte mi aveva reso forte, nel desiderio di poterla aiutare. Mi sembrava tanto debole che mi faceva trovare dentro una forza che in realtà non avevo neppure per me, per proteggerla, per tenerla su. Con lei era bello pregare la sera in luridi pagliericci. Il nostro rosario per lo più non arrivava alla fine: lei si inquietava, per questo io ero più tranquilla: pensavo che la nostra preghiera avesse sempre valore anche se recitata in un dormiveglia. E quanta forza trovavamo insieme nel recitare il rosario, quando al Thazenberg le nostre braccia sanguinanti dal freddo dovevano trasportare pile di mattoni gelati!"
    },
    {
        "name": "EMILIA LEVI",
        "aliases": ["ALDO LEVI"],
        "theme": "Amore",
        "text": "Primo Levi, Se questo è un uomo, Einaudi, p. 34\n\n“Cosi morí Emilia, che aveva tre [in realtà 5] anni; poiché ai tedeschi appariva palese la necessità storica di mettere a morte i bambini degli ebrei. Emilia, figlia dell’ingegner Aldo Levi di Milano, che era una bambina curiosa, ambiziosa, allegra e intelligente; alla quale, durante il viaggio nel vagone gremito, il padre e la madre erano riusciti a fare il bagno in un mastello di zinco, in acqua tiepida che il degenere macchinista tedesco aveva acconsentito a spillare dalla locomotiva che ci trascinava tutti alla morte”"
    },
    {
        "name": "ELENA LEVI",
        "aliases": ["ALDO LEVI"],
        "theme": "Amore",
        "text": "Primo Levi, Se questo è un uomo, Einaudi, p. 34\n\n“Cosi morí Emilia, che aveva tre [in realtà 5] anni; poiché ai tedeschi appariva palese la necessità storica di mettere a morte i bambini degli ebrei. Emilia, figlia dell’ingegner Aldo Levi di Milano, che era una bambina curiosa, ambiziosa, allegra e intelligente; alla quale, durante il viaggio nel vagone gremito, il padre e la madre erano riusciti a fare il bagno in un mastello di zinco, in acqua tiepida che il degenere macchinista tedesco aveva acconsentito a spillare dalla locomotiva che ci trascinava tutti alla morte”"
    },
    {
        "name": "CLARA SORIAS",
        "theme": "Amore",
        "text": "Lettere di Clara dal carcere di San Vittore al marito Mosè 29 luglio 1944\n\n“Moisico caro,\nGrazie per il biglietto che ho ricevuto ieri sera. Una tua semplice parola mi è sempre di grande conforto[...].\nIl mio morale è piuttosto alto, quindi non preoccuparti di noi. Solo che, con il passare del tempo, trovo sempre più difficile resistere all’idea di una separazione prolungata.\nAbbi cura di te. Baci a Carmen e a te. Pino e io ti mandiamo i nostri abbracci di tutto cuore.\nPuoi mandarmi dei biscotti savoiardi?\nGrazie e baci.”\n\nLettera di Clara senza data al marito Moisè dal Carcere di San Vittore\n\n“[...]Pino preferisce molto i ceci alle caramelle. Egli si comporta molto bene. Comincia ad abituarsi con tutti. Inoltre è un po’ meno attaccato al mio petto.\nParla sovente di te e di Carmen; e tutte le mattine bisogna far finta di andare al balcone per salutarti. Gli manca un po’ l’aria, ma non ha sofferto la prigione, mangia bene e non manca di niente. Per favore, metti la sveglia; oggi sarà una bella giornata. Come fai a cambiare? Immagino quanto sarai preoccupato per noi. Ti giuro, Moisico, che con un po’ di pazienza e speranza, la vita è sopportabile.”"
    },
    {
        "name": "CORINNA CORINALDI SEGRE",
        "theme": "Amore",
        "text": "Lettera al figlio Uberto del 10 gennaio 1944 dal carcere di Como \n\n“[... ]La mia salute è buona: sto molto a letto perché fa freddo, ma il tempo non mi sembra troppo lungo a passare. Ricevo qualche visita, anche da una buona signorina conoscenza della mia padrona di casa che, pur non conoscendomi da prima, mi porta pane frutta e leccornie. E commovente vedere quante buone persone ci sono!\nAnche la mia padrona di casa verrà e ci poterà notizie dei nostri lontani. [...]Dunque evviva, mio caro, carissimo figlio, oggi sono veramente felice di non avere più preoccupazioni per nessuno di voi e di saperti riunito ad Anna e Nini che abbraccio con te[...]”."
    },
    {
        "name": "ARIANE DUFAUX",
        "aliases": ["OTTO POPPER"],
        "theme": "Amore",
        "text": "Lettera di Ariane al marito Popper mentre lui era detenuto a San Vittore del 14 marzo 1944\n\n“[...]Tina è la bontà e la dedizione in persona. Lui è bizzarro, ma questo non ha molta importanza; l'importante è lei, affinché Michel abbia una seconda madre nel momento in cui nascerà un fratellino o una sorellina. E finché sono con lei non mi occupo di nulla, il che è molto piacevole. Michel è un amore, ha sopportato molto bene il cambiamento (a parte una forte indigestione causata dalle caramelle che gli piacevano troppo) e ogni mattina Anilà (sarebbe la nuova perla) gli porta il latte ecc. [...].\n[...]adorato, ti amo sempre di più se possibile, penso costantemente a te e spero che saremo presto tutti e 3 o tutti e 4. Baci, baci (Busserle). Come vuoi chiamare il secondo bambino, Frederic, Christiane??Baci [...]”\n\nLettera di Ariane al marito Popper mentre lui era detenuto a San Vittore del 21 marzo 1944\n\n“[...]Michel è sempre più un amore. Va pazzo per la musica (io non c'entro nulla!!). Gli sta crescendo il settimo dente, è un molare inferiore. Ha i denti un po' disordinati; quelli davanti (4) sono adorabili e ora sono ben stretti l'uno contro l'altro. È molto vanitoso e la sua giacchetta rossa gli piace molto, così come il colletto di ....(?)....in un cappotto beige.”\n\nLettera di Ariane al marito Popper mentre lui era detenuto a San Vittore dell’1 aprile 1944 \n\n\"Amore adorato, nella mia lettera precedente ho dimenticato di dirti che ai miei genitori non parlavo del secondo bambino. Inutile preoccuparli e per te ho detto che eri stato chiamato in qualità di interprete, che eri a Milano ma che non potevi assentarti né occuparti dei tuoi affari.”\n\nLettera di Ariane Dufaux a Giuseppe Speroni, caro amico del marito, 11 novembre 1944\n\n“Otto un giorno, in una delle sue ultime lettere scritte in prigione, mi diceva che era fiero di avere un amico come voi; un amico che davanti alla sventura, a poco a poco, si trasforma in un genio e fa tutto ciò che è possibile per soccorrere, per aiutare. Caro Amico, siete stato ammirevole; grazie, grazie per Otto, per i suoi figli e per me stessa”[...].Che l’amore che Otto aveva per me, che questo amore che ha trasformato la mia esistenza sia il mio bene, la mia forza più preziosa e sia la mia guida nel compito meraviglioso che devo compiere prima di andare a raggiungerlo: l’educazione dei suoi due figli. Amico mio, soffro terribilmente fisicamente, mi sento come morta, ma moralmente sono tutt’altra cosa; vivo intensamente, penso a tutto ciò che Otto mi ha dato, al suo amore perfetto, alle gioie infinite che mi ha fatto conoscere e mi sento così felice di essere stata \"l'eletta\", di aver potuto dargli la più grande gioia della sua vita facendolo rivivere nei suoi due figli. Soffro atrocemente, ma sono felice di sentire che soffro perché lo amo tanto, e felice di sapere che lui non soffre più.[..]”"
    },
    {
        "name": "GIANLUIGI BANFI",
        "aliases": ["JIULIA BANFI", "GIULIA BANFI", "JULIA BANFI"],
        "theme": "Amore",
        "text": "Gian Luigi Banfi, Amore e speranza: corrispondenza tra Julia e Giangio dal campo di Fossoli, aprile-luglio 1944, Archinto, 2009\n\nDiario di Julia Bertolotti  Banfi 10 agosto 1944\n“[...]Mi sembra ingiusto che tu non sappia degli aquiloni del Giuliano, di quanto ti ho desiderato certe notti, e del terrore. Alcune di queste cose che ti racconterò le ho raccontate ad altri (tu conosci quanto grande è in me il bisogno di sentirmi vivere anche nei momenti peggiori, e di comunicare ad altri il gusto che le cose del mondo mi danno, – in questo tanto simile a te) altre sono tue e mie, altre stanno nel fondo di me stessa: ma anche queste ultime tu le hai sapute ugualmente.”\n\nDiario di Julia Bertolotti  Banfi 22  agosto 1944 \n“Dal terrore del 12 luglio s’è operato dentro a me come un disseccamento di quella che è sempre stata la mia natura sentimentale: i sogni, l’affettuosità, la tenerezza sono dei lussi che conservo intatti per quando torneranno tempi migliori (come le mie collane di fiori). Ora si deve salvare la vita, difenderla con accortezza, con durezza, con costanza. E questo spirito di conservazione non mi ha mai abbandonato, non credo di aver mai ceduto, di essermi mai scoraggiata: e prego il cielo e ho fiducia che anche Giangio abbia, nella sua posizione ben più difficile della mia, sempre conservato questa forte volontà di resistenza e di difesa. Così non è stato un colpo grave non trovarti più a Fossoli quando ci son venuta il giorno dopo la tua partenza (26 luglio),  né quando non t’ho trovato più a Bolzano perché già da una settimana, sapevo che eri vivo, eri partito. Qui però ho sofferto per te, caro, perché so di quanto conforto ti sarebbe stato vedere che ancora una volta ero riuscita a seguirti e ad esserti vicina anche fisicamente; [...]”\n\nDiario di Julia Banfi 9 febbraio 1945\n“[...]Oggi no, gli alleati avanzano su tutti i fronti e se questo per tutti significa l’avvicinarsi della fine del conflitto, per me si identifica col tuo ritorno: e anche penso che la durezza del carcere ti sarà meno penosa per le notizie che, anche se camuffate, ti arriveranno di quello che sta succedendo ai nostri nemici. E così oggi ho voglia di felicità, ho festeggiato le nostre nozze con l’allegria del mio cuore, raccontando al Giuliano del nostro matrimonio (S. Ambrogio e il magnifico sole che ci ha scaldato quel giorno), del nostro viaggio in Francia. E raccontando ero felice di tutta la gioia che abbiamo avuto: è questo un patrimonio che nessuno può toglierci. Ma quello che ancora è più pressante è la voglia di vivere insieme ancora tante ore così belle e la sicurezza che le avremo perché la cosa sostanziale che trasforma ogni cosa in felicità è l’amore che abbiamo l’uno per l’altra. E questo né la guerra, né gli incendi né i tedeschi possono togliercelo. In questo momento mi sembra che la tua lontananza sia una cosa momentanea, e che oggi più che mai tu possa tornare da me per camminare nella vita ancora tenendoci per mano”.  \n\nDiario di Julia Banfi 14  febbraio 1945\n“[...]Oltre ai mestieri di fatica (cavar patate, tagliar legna, far legna nel bosco col papà e il carro) che mi sostituiscono lo sport e nei quali consumo il bi sogno di muovermi e stancarmi, la compagnia del cucciolo è la mia cura continua. È un bambino esigente nel bisogno di accaparrarsi l’affetto ed ogni tanto gli do qualche piccolo dispiacere perché impari che la vita è dura e che è necessario dominarsi. È molto timido e pauroso ed anche lì faccio del mio meglio per fortificarlo, ma a questo penserà, credo, la scuola.\n[...]Il Giuliano prega ogni sera Gesù di proteggere il suo bel papino, di rimandarglielo presto… che Gesù ascolti la sua preghiera innocente.  \nQuando ho questi momenti di terrore cerco tutti i segni cabalistici che mi convincono che tornerai: segni sulla tua e sul la mia mano, le linee della vita, quelle del cuore, della fortuna.”"
    },
    {
        "name": "EUGENIO GLUCKSMANN",
        "aliases": ["ELENA GLUCKSMANN"],
        "theme": "Amore",
        "text": "Lettera di Elena Gluksmann, figlia di Eugenio, al Ministero dell’interno da Milano del 16 luglio 1942 \n\n“[..]Aggiungo che tanto nella provincia di Como come quella di Varese vi sono delle persone conoscenti del mio papà e con le quali facilmente potrebbe organizzare una vita in comune in modo da rinunciare a quel sussidio che codesto On. Ministero generosamente assegna agli internati.\nAnzi io a nome anche della mia mamma, dichiaro che al sussidio mio padre potrà rinunciare e rinuncerà senz'altro anche se dovendo aiutar lui tanto io come la mia mamma, dovremo assumerci delle privazioni.\nVoglio pertanto sperare ed augurarmi che la preghiera calda e sommessa che io bambina di dodici anni rivolgo a codesta Superiore Autorità verrà accolta e le mie preghiere si rivolgono a Dio perché la gioia ed il conforto che potranno derivarmi siano sentite dai bambini di tutte quelle brave e care persone che nella rigida applicazione della Legge, sanno informare le loro decisioni ad un senso di alta comprensione e di infinita bontà.”"
    },
    {
        "name": "GRETE WEISSENSTEIN",
        "theme": "Amore",
        "text": "Lettera del 7 dicembre 1944 alla domestica Tina dal campo di Bolzano\n\n“Tina cara mi crederà molto debole perché non ho forza…ma le assicuro che ci vuole più forza per provare a resistere. Mille volte mi dico: no così non si può vivere e e mille volte mi rispondo: sì! devi resistere per tornare e la vita mi sembra bella come non mai mi è sembrata prima, impossibile lasciarla. E’ stata colpa mia”"
    },
    {
        "name": "EGLE RIGOLA",
        "aliases": ["MINO STEINER"],
        "theme": "Amore",
        "text": "Lettera di Egle Rigola Steiner a Mino detenuto a Fossoli  26 maggio 1944\n\n“Ma credi che l’avremo Mino un giorno la nostra isola? Ho bisogno di noi, noi due, di calma, di serenità, di belle letture, di buoni discorsi, discorsi di pace, di belle cose, cosa darei per essere ancora sul divanino in sala vicino al caminetto e leggerti poesie.Ricordi?Ma tornerà. Ne ho la certezza.”\n\nLettera di Egle Rigola Steiner al capo della provincia di Milano 4 dicembre 1944\n\n“Passo giornate in un’angoscia inenarrabile, vi supplico, se non per me, per i miei due piccini, e per sua madre ridotta in uno stato pietoso a voler saper dire qualcosa a farci avere qualche notizia da lui e da lui”"
    },
    {
        "name": "MARIA FONTANIN FILLINICH",
        "aliases": ["MARIA FONTANIN", "MARIA FILLINICH"],
        "theme": "Amore",
        "text": "Lettera alla figlia Loredana del 9 agosto 1944 dal campo di Bolzano\n\n“Con vivo piacere ho ricevuto la tua cara e tanto attesa lettera ero preoccupata di questo tuo silenzio, ti so molto occupata, ma due semplici righe puoi sempre mandarle non farti ombra e solo a noi che non è concesso scrivere che una sola volta alla settimana.\nSpero le mie pratiche a buon punto e francamente non vedo motivo di tenerci lungamente qui dentro dove si sente tremendamente il disagio. \nHo ricevuto il tuo pacco, non mi aspettavo tanto dato le difficoltà del momento hai fatto miracoli ti ringrazio infinitamente se mi hai combinato bene me, meglio spero Luciano specialmente ora che deve intraprendere un lungo viaggio mi addolora questo distacco lo puoi bene immaginare e che mi rincresce ancora più che non fai in tempo a mandargli ciò che Luciano ti aveva chiesto, mi rattrista di più sapendolo non equipaggiato per dove deve andare, che Iddio lo protegga.\nSono qui che conto i minuti che passano e che sempre più si avvicina il momento di dovermi separare dal mio Luciano, qui malgrado l’ambiente me lo sentivo vicino, sii forte anche tu, e speriamo in Dio che presto la nostra famiglia possa essere riunita”\n\nLettera alla figlia Loredana del 13 agosto 1944 dal campo di Bolzano\n\n“Lori carissima, ero sempre preoccupata sapendoti scosso di salute, dopo il colloquio finalmente ho potuto tranquillizzarmi ho avuto la gioia di vederti e sincerarmi che stavi molto meglio, ora ti spero completamente ristabilita, nel frattempo avrai ricevuto notizie di Luciano, è il nostro pensiero che costantemente ci assilla, scrivimi che mi è di grande sollievo, vi penso sempre, e non vedo l’ora che la nostra famiglia possa essere ancora riunita ti abbraccio e ti bacio ricordami e salutami tutti chi s’interessano di me  tua mamma”"
    }
];

// Combine all
texts = texts.concat(caseTexts).concat(amoreTexts);

fs.writeFileSync('src/texts.json', JSON.stringify(texts, null, 2));
console.log(`Saved ${texts.length} texts to src/texts.json`);

// Check matching for everything
function normalizeNameForMatch(name) {
    // Replace simple quotes, smart quotes, make lowercase
    // But MORE IMPORTANTLY, also remove diacritical marks to be extremely robust
    return name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/['"’]/g, '').trim();
}

let unmatches = 0;
texts.forEach(t => {
    const normNames = [normalizeNameForMatch(t.name)];
    if (t.aliases) t.aliases.forEach(a => normNames.push(normalizeNameForMatch(a)));

    const matched = data.filter(d => {
        if (!d.raw) return false;

        // Convert DB name into parts, also normalizing
        const dNameNormalized = normalizeNameForMatch(d.name);
        // Split into words, but allow missing words or different order
        // In App.tsx I used every(), let's test if that's too strict
        const dNameParts = dNameNormalized.split(' ').filter(Boolean);

        // Instead of activeDetail.name's parts all being in texts.json's name,
        // let's do a much more robust match: check if ANY of the normNames
        // shares at least 2 consecutive words, or if they are just the same
        // The easiest robust way is checking if the provided textual name (e.g. "JENIDE RUSSO")
        // has ALL of its words inside the data.json name ("Russo Jenide").

        return normNames.some(nameToMatch => {
            const textNameParts = nameToMatch.split(' ').filter(Boolean);
            // Does data.json name contain all parts of the text's name?
            return textNameParts.every(part => dNameNormalized.includes(part));
        });
    });

    if (matched.length === 0) {
        console.log(`[x] NO MATCH FOR: ${t.name} (Theme: ${t.theme}, Aliases: ${t.aliases?.join(', ') || 'none'})`);
        unmatches++;
    } else {
        // console.log(`[v] MATCHED: ${t.name} -> ${matched.map(m => m.name).join(', ')}`);
    }
});
console.log(`Total Unmatched: ${unmatches}`);

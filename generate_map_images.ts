import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const themes = ['amore', 'case', 'corpi', 'cose'];
const SITE_URL = 'http://localhost:5173/pietre/'; // Assuming the dev server is running here

async function generateScreenshots() {
    console.log('Avvio Puppeteer...');
    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: { width: 800, height: 1200 }, // Portrait aspect ratio (like a mobile/sidebar view for the PDF)
    });

    const page = await browser.newPage();
    console.log(`Navigazione a ${SITE_URL}...`);
    await page.goto(SITE_URL, { waitUntil: 'networkidle2' });

    // Nascondiamo gli elementi della UI non necessari per lo screenshot
    await page.evaluate(() => {
        const style = document.createElement('style');
        style.innerHTML = `
      .leaflet-control-container, 
      .fixed.bottom-6, 
      header,
      .md\\:hidden,
      .md\\:flex,
      .z-\\[1000\\],
      .z-\\[2000\\],
      .z-\\[3000\\],
      .hidden.md\\:block {
        display: none !important;
      }
    `;
        document.head.appendChild(style);
    });

    // Aspettiamo che la mappa di Leaflet sia pronta
    await new Promise(r => setTimeout(r, 4000)); // Attendiamo lo splash screen

    // Forza Mapbox a renderizzare ad alta qualità e disattiva le interazioni
    await page.evaluate(() => {
        if ((window as any).resetMapToMilanOverview) {
            (window as any).resetMapToMilanOverview();
        }
    });
    await new Promise(r => setTimeout(r, 2000));

    for (const theme of themes) {
        console.log(`Generazione mappa per il tema: ${theme}...`);

        // Attiviamo solo questo tema, disattiviamo gli altri
        // Poiché non possiamo cliccare facilmente i bottoni di React da qui senza selettori stabili,
        // inietteremo un comando per triggerare la rotta. Il modo migliore è sfruttare i window object
        // ma siccome questo è un test, simuliamo il click via DOM se possibile.
        // La via più sicura per uno script una-tantum è mockare il render della mappa fornendo solo i punti.

        // Per semplicità, esporremo in App.tsx uno window hook solo in development per forzare i temi.
        const success = await page.evaluate((t) => {
            if ((window as any)._forceThemeForScreenshot) {
                (window as any)._forceThemeForScreenshot(t);
                return true;
            }
            return false;
        }, theme);

        if (!success) {
            console.error(`Errore: L'hook window._forceThemeForScreenshot non è definito. Aggiungilo temporarily a App.tsx`);
            break;
        }

        // Aspettiamo Leaflet renderizzi la linea
        await new Promise(r => setTimeout(r, 1000));

        // Assicuriamoci che i bordi siano ripristinati e i tile caricati
        await page.evaluate(() => {
            if ((window as any).resetMapToMilanOverview) {
                (window as any).resetMapToMilanOverview();
            }
        });

        await new Promise(r => setTimeout(r, 2000));

        // Prendiamo lo screenshot dell'area mappa
        const mapElement = await page.$('#route-map-container');
        if (mapElement) {
            await mapElement.screenshot({
                path: `public/maps/map_${theme}.jpg`,
                type: 'jpeg',
                quality: 90
            });
            console.log(`✅ map_${theme}.jpg salvata con successo.`);
        } else {
            console.error('Elemento #route-map-container non trovato!');
        }
    }

    await browser.close();
    console.log('Finito!');
}

generateScreenshots().catch(console.error);

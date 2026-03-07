const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const poppler = require('pdf-poppler');

const sourceDir = 'C:\\Users\\matte\\OneDrive\\Desktop\\pietre\\Fotografie-20260307T101258Z-3-001\\Fotografie';
const destDir = path.join(__dirname, 'public', 'photos');

const files = fs.readdirSync(sourceDir);

async function processPhotos() {
    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        const baseName = path.basename(file, path.extname(file));
        const cleanName = baseName.replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '_');
        const destPath = path.join(destDir, `${cleanName}.jpg`);
        const sourcePath = path.join(sourceDir, file);

        try {
            if (['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'].includes(ext)) {
                await sharp(sourcePath)
                    .resize({ width: 800, withoutEnlargement: true }) // optimize for web
                    .jpeg({ quality: 80 })
                    .toFile(destPath);
                console.log(`Processed: ${file} -> ${cleanName}.jpg`);
            } else if (ext === '.pdf') {
                // Convert PDF to image
                let opts = {
                    format: 'jpeg',
                    out_dir: destDir,
                    out_prefix: cleanName,
                    page: 1
                };
                await poppler.convert(sourcePath, opts);

                // Poppler appends -1 to exactly output name
                const popplerOut = path.join(destDir, `${cleanName}-1.jpg`);
                if (fs.existsSync(popplerOut)) {
                    // optimize that too
                    await sharp(popplerOut)
                        .resize({ width: 800, withoutEnlargement: true })
                        .jpeg({ quality: 80 })
                        .toFile(destPath);
                    fs.unlinkSync(popplerOut);
                    console.log(`Converted PDF: ${file} -> ${cleanName}.jpg`);
                }
            } else {
                console.log(`Skipping unsupported format: ${file}`);
            }
        } catch (e) {
            console.error(`Error processing ${file}:`, e);
        }
    }
}

processPhotos();

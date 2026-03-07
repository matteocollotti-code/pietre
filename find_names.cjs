const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

data.forEach(d => {
    const name = d.name.toLowerCase();
    if (name.includes('eugenio') || name.includes('clara') || name.includes('weissenstein') || name.includes('sorias') || name.includes('grete') || name.includes('margarethe')) {
        console.log("Found:", d.name);
    }
});

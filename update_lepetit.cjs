const fs = require('fs');
let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
for (const item of data) {
    if (item.name === 'Lepetit Roberto') {
        item.raw['cose '] = 1;
        item.raw.cose = 1;
    }
}
fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

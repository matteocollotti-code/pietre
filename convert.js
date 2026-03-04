const fs = require('fs');
const path = require('path');

const jsonData = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
const jsContent = `const markersData = ${jsonData};`;
fs.writeFileSync(path.join(__dirname, 'data.js'), jsContent, 'utf8');
console.log('Successfully created data.js');

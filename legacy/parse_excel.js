const xlsx = require('xlsx');
const path = require('path');

try {
    const workbook = xlsx.readFile(path.join(__dirname, 'pietre.xlsx'));
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert into an array of objects
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log(`Found ${data.length} rows.`);
    if (data.length > 0) {
        console.log("Columns:", Object.keys(data[0]));
        console.log("First row:");
        console.log(data[0]);
    }
} catch (e) {
    console.error("Error reading file:", e);
}

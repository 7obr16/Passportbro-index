const fs = require('fs');

const filterDataStr = fs.readFileSync('lib/countryFilterData.ts', 'utf8');

// A safer way to find the data
const dataLines = filterDataStr.split('\n');
let inside = false;
let map = {};
let currentKey = null;

for (let i = 0; i < dataLines.length; i++) {
  const line = dataLines[i];
  if (line.includes('export const COUNTRY_FILTER_DATA')) {
    inside = true;
    continue;
  }
  if (inside) {
    if (line.trim() === '};') break;
    
    let keyMatch = line.match(/^\s*"([a-z0-9-]+)":\s*\{/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      map[currentKey] = {};
    } else if (currentKey) {
      let valMatch = line.match(/"internetMbps":\s*([\d.]+)/);
      if (valMatch) {
        map[currentKey].internetMbps = parseFloat(valMatch[1]);
      }
      let speedMatch = line.match(/"internetSpeed":\s*"([^"]+)"/);
      if (speedMatch) {
        map[currentKey].internetSpeed = speedMatch[1];
      }
    }
  }
}

const africanSlugs = [
  "kenya", "nigeria", "uganda", "rwanda", "tanzania", "ethiopia", 
  "south-africa", "morocco", "algeria", "libya", "egypt", "benin", 
  "botswana", "burkina-faso", "burundi", "cameroon", "cape-verde", 
  "central-african-republic", "chad", "comoros", "dr-congo", 
  "republic-of-the-congo", "cote-divoire", "ivory-coast", "djibouti", 
  "equatorial-guinea", "eritrea", "eswatini", "gabon", "gambia", "ghana", 
  "guinea", "guinea-bissau", "lesotho", "liberia", "madagascar", "malawi", 
  "mali", "mauritania", "mauritius", "mozambique", "namibia", "niger", 
  "sao-tome-and-principe", "senegal", "seychelles", "sierra-leone", 
  "somalia", "south-sudan", "sudan", "togo", "zambia", "zimbabwe", "angola"
];

for (const slug of africanSlugs) {
  if (map[slug]) {
    console.log(`${slug}: Mbps: ${map[slug].internetMbps || 'missing'}, Speed: ${map[slug].internetSpeed}`);
  }
}

const fs = require('fs');
const https = require('https');

const url = 'https://raw.githubusercontent.com/ilyankou/passport-index-dataset/master/passport-index-matrix.csv';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const lines = data.trim().split('\n');
    const header = lines[0].split(',').map(s => s.trim());
    const countries = header.slice(1);
    
    const matrix = {};
    
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      const passport = parts[0].trim();
      matrix[passport] = {};
      
      for (let j = 1; j < parts.length; j++) {
        const dest = header[j];
        const req = parts[j].trim();
        matrix[passport][dest] = req;
      }
    }
    
    const output = {
      countries: countries.sort(),
      matrix: matrix
    };
    
    fs.writeFileSync('public/visa-matrix.json', JSON.stringify(output));
    console.log('Saved to public/visa-matrix.json');
  });
}).on('error', err => {
  console.error(err);
});

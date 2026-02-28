const https = require('https');
const fs = require('fs');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const male = await get('https://freesvg.org/storage/img/thumb/man-silhouette.png');
  const female = await get('https://freesvg.org/storage/img/thumb/female-silhouette-1.png');
  console.log(male.length, female.length);
}
run();

const https = require('https');
const fs = require('fs');

async function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = [];
      res.on('data', c => d.push(c));
      res.on('end', () => resolve(Buffer.concat(d).toString()));
    }).on('error', reject);
  });
}

async function run() {
  const male = await get('https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/walk.svg');
  console.log(male);
}
run();

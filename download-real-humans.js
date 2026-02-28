const https = require('https');
const fs = require('fs');

async function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let d = [];
      res.on('data', c => d.push(c));
      res.on('end', () => resolve(Buffer.concat(d)));
    }).on('error', reject);
  });
}

async function run() {
  // We can fetch from open sources or unpkg.
  // Using high quality vector paths from SVG repo
  const male = await get('https://www.svgrepo.com/show/15835/male-silhouette.svg');
  const female = await get('https://www.svgrepo.com/show/16723/female-silhouette.svg');
  fs.writeFileSync('public/male-real.svg', male);
  fs.writeFileSync('public/female-real.svg', female);
  console.log('done', male.length, female.length);
}
run();

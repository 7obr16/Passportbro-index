const fs = require('fs');
const https = require('https');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(dest, data);
        resolve();
      });
    }).on('error', reject);
  });
};

async function main() {
  // Free public domain realistic silhouette SVGs
  await download('https://upload.wikimedia.org/wikipedia/commons/1/1a/Anatomy_of_Male_Body.svg', 'public/male.svg');
  await download('https://upload.wikimedia.org/wikipedia/commons/d/da/Female_anatomy.svg', 'public/female.svg');
  console.log('Done');
}

main();

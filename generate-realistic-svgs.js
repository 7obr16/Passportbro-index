const fs = require('fs');
// Very detailed realistic male silhouette
const maleSvg = `<svg viewBox="0 0 100 300" xmlns="http://www.w3.org/2000/svg">
  <path d="M 48 9 C 51 9 53 11 54 14 C 54 18 52 23 48 24 C 44 23 42 18 42 14 C 43 11 45 9 48 9 Z M 48 26 C 53 26 60 28 64 32 C 67 36 68 40 69 46 L 73 85 C 73 88 71 90 69 90 C 67 90 65 88 64 85 L 61 50 C 60 55 59 60 59 68 C 59 80 58 100 58 120 L 59 150 C 60 170 61 200 62 250 C 62 260 62 280 62 285 C 62 288 60 290 58 290 C 56 290 55 288 55 285 L 53 160 L 50 160 L 48 160 L 46 285 C 46 288 44 290 42 290 C 40 290 39 288 39 285 C 39 280 39 260 40 250 C 41 200 42 170 42 150 L 43 120 C 43 100 42 80 42 68 C 42 60 41 55 40 50 L 37 85 C 36 88 34 90 32 90 C 30 90 28 88 28 85 L 32 46 C 33 40 34 36 37 32 C 40 28 44 26 48 26 Z" />
</svg>`;

// Detailed realistic female silhouette
const femaleSvg = `<svg viewBox="0 0 100 300" xmlns="http://www.w3.org/2000/svg">
  <path d="M 48 10 C 51 10 53 12 53 16 C 53 20 51 24 48 24 C 45 24 43 20 43 16 C 43 12 45 10 48 10 Z M 48 26 C 52 26 56 28 58 32 C 60 36 61 40 62 46 L 64 85 C 64 88 62 90 60 90 C 58 90 57 88 56 85 L 55 50 C 55 54 56 60 57 68 C 58 80 60 100 60 120 C 60 135 60 150 59 170 C 58 200 57 240 56 285 C 56 288 54 290 52 290 C 50 290 49 288 49 285 L 50 160 L 48 160 L 47 160 L 48 285 C 48 288 46 290 44 290 C 42 290 41 288 41 285 C 40 240 39 200 38 170 C 37 150 37 135 37 120 C 37 100 39 80 40 68 C 41 60 42 54 42 50 L 41 85 C 40 88 38 90 36 90 C 34 90 33 88 33 85 L 35 46 C 36 40 37 36 39 32 C 41 28 45 26 48 26 Z" />
</svg>`;

fs.writeFileSync('components/male.tsx', 'export const MalePath = "' + maleSvg.match(/d="([^"]+)"/)[1] + '";');
fs.writeFileSync('components/female.tsx', 'export const FemalePath = "' + femaleSvg.match(/d="([^"]+)"/)[1] + '";');
console.log('done');

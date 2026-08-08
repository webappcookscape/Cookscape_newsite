const fs = require('fs');

const siteDataContent = fs.readFileSync('src/data/siteData.js', 'utf-8');
const collectionMatch = siteDataContent.match(/export const GALLERY_COLLECTION = (\[[\s\S]*?\]);/);
const collection = eval(collectionMatch[1]);

const nonBedroom = collection.filter(item => item.category.toLowerCase() !== 'bedroom');

const output = nonBedroom.map((item, idx) => ({
  index: idx,
  category: item.category,
  title: item.title,
  url: item.url
}));

console.log(JSON.stringify(output, null, 2));
console.log(`Total non-bedroom items: ${nonBedroom.length}`);

const fs = require('fs');

const siteDataContent = fs.readFileSync('src/data/siteData.js', 'utf-8');
const collectionMatch = siteDataContent.match(/export const GALLERY_COLLECTION = (\[[\s\S]*?\]);/);
const collection = eval(collectionMatch[1]);

const genericRegex = /^\d+(\.\d+)?$|design\s+\d+|enscape|whatsapp|^[a-z]{1,8}$/i;

const remaining = [];
collection.forEach((item, index) => {
  if (item.category.toLowerCase() === 'bedroom') return;
  
  const isGeneric = genericRegex.test(item.title) || genericRegex.test(item.url.split('/').pop().split('.')[0]);
  if (isGeneric) {
    remaining.push({
      index,
      category: item.category,
      url: item.url,
      title: item.title
    });
  }
});

console.log(JSON.stringify(remaining, null, 2));
console.log(`Found ${remaining.length} generic items remaining.`);

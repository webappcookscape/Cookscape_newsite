const fs = require('fs');

const siteDataContent = fs.readFileSync('src/data/siteData.js', 'utf-8');

// Match the GALLERY_COLLECTION array content
const collectionMatch = siteDataContent.match(/export const GALLERY_COLLECTION = (\[[\s\S]*?\]);/);
if (!collectionMatch) {
  console.error("Could not find GALLERY_COLLECTION in siteData.js");
  process.exit(1);
}

let collection;
try {
  collection = JSON.parse(collectionMatch[1]);
} catch (e) {
  // Try evaluating it if it has JavaScript formatting rather than strict JSON
  try {
    collection = eval(collectionMatch[1]);
  } catch (err) {
    console.error("Could not parse GALLERY_COLLECTION:", err);
    process.exit(1);
  }
}

const genericItems = [];
const genericRegex = /design\s+\d+|enscape|whatsapp|^\d+$|^[a-z]+$/i;

collection.forEach((item, index) => {
  if (genericRegex.test(item.title) || genericRegex.test(item.url)) {
    genericItems.push({
      index,
      category: item.category,
      url: item.url,
      title: item.title
    });
  }
});

console.log(JSON.stringify(genericItems, null, 2));
console.log(`Found ${genericItems.length} generic items out of ${collection.length} total items.`);

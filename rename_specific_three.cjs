const fs = require('fs');
const path = require('path');

const siteDataPath = 'src/data/siteData.js';
let siteDataContent = fs.readFileSync(siteDataPath, 'utf-8');

const collectionMatch = siteDataContent.match(/export const GALLERY_COLLECTION = (\[[\s\S]*?\]);/);
const collection = eval(collectionMatch[1]);
const publicDir = path.join(__dirname, 'public');

const renameMap = {
  "/Website-Gallery/Modular kitchen/KS1 - Copy.png": {
    name: "Contemporary Matte Charcoal Modular Kitchen Setup",
    newUrl: "/Website-Gallery/Modular kitchen/contemporary-matte-charcoal-modular-kitchen-setup.png"
  },
  "/Website-Gallery/Modular kitchen/KS2 - Copy.png": {
    name: "Premium Parallel Modular Kitchen with LED Lighting",
    newUrl: "/Website-Gallery/Modular kitchen/premium-parallel-modular-kitchen-with-led-lighting.png"
  },
  "/Website-Gallery/Modular kitchen/opt2.png": {
    name: "Bespoke White and Oak Modular Kitchen Cabinets",
    newUrl: "/Website-Gallery/Modular kitchen/bespoke-white-and-oak-modular-kitchen-cabinets.png"
  }
};

const updatedCollection = collection.map(item => {
  if (renameMap[item.url]) {
    const map = renameMap[item.url];
    const oldDiskPath = path.join(publicDir, item.url);
    const newDiskPath = path.join(publicDir, map.newUrl);

    if (fs.existsSync(oldDiskPath)) {
      fs.renameSync(oldDiskPath, newDiskPath);
      console.log(`SUCCESS Renamed: ${item.url} -> ${map.newUrl}`);
    } else {
      console.warn(`WARNING File not found: ${oldDiskPath}`);
    }

    return {
      category: item.category,
      url: map.newUrl,
      title: map.name
    };
  }
  return item;
});

const newCollectionString = JSON.stringify(updatedCollection, null, 2);
const updatedSiteDataContent = siteDataContent.replace(
  /export const GALLERY_COLLECTION = \[\s*[\s\S]*?\s*\];/g,
  `export const GALLERY_COLLECTION = ${newCollectionString};`
);

fs.writeFileSync(siteDataPath, updatedSiteDataContent, 'utf-8');
console.log("Renamed the remaining sample/copy Modular kitchen images successfully!");

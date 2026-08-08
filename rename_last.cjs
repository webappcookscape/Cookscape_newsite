const fs = require('fs');
const path = require('path');

const siteDataPath = 'src/data/siteData.js';
let siteDataContent = fs.readFileSync(siteDataPath, 'utf-8');

const collectionMatch = siteDataContent.match(/export const GALLERY_COLLECTION = (\[[\s\S]*?\]);/);
const collection = eval(collectionMatch[1]);

const publicDir = path.join(__dirname, 'public');

const updatedCollection = collection.map(item => {
  if (item.url === '/Website-Gallery/Modular kitchen/0.1.png' && item.title === '0.1') {
    const selectedName = "Premium Dual Tone Modular Kitchen with Laminate Finish";
    const newUrl = '/Website-Gallery/Modular kitchen/premium-dual-tone-modular-kitchen-with-laminate-finish.png';
    
    const oldDiskPath = path.join(publicDir, item.url);
    const newDiskPath = path.join(publicDir, newUrl);
    
    if (fs.existsSync(oldDiskPath)) {
      fs.renameSync(oldDiskPath, newDiskPath);
      console.log(`Renamed: ${item.url} -> ${newUrl}`);
    } else {
      console.warn(`File not found: ${oldDiskPath}`);
    }
    
    return {
      category: item.category,
      url: newUrl,
      title: selectedName
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
console.log("Renamed the remaining '0.1' image successfully!");

const fs = require('fs');
const path = require('path');

const siteDataPath = 'src/data/siteData.js';
let siteDataContent = fs.readFileSync(siteDataPath, 'utf-8');

const collectionMatch = siteDataContent.match(/export const GALLERY_COLLECTION = (\[[\s\S]*?\]);/);
const collection = eval(collectionMatch[1]);
const publicDir = path.join(__dirname, 'public');

// Map exact old URLs of the 17 generic Bedroom files to new premium names
const renameMap = {
  "/Website-Gallery/Bedroom/MBR V1.png": {
    name: "Master Bedroom Wardrobe with Fluted Details",
    newUrl: "/Website-Gallery/Bedroom/master-bedroom-wardrobe-with-fluted-details.png"
  },
  "/Website-Gallery/Bedroom/mbr wr 2.png": {
    name: "Master Bedroom Walk In Wardrobe with Glass Drawers",
    newUrl: "/Website-Gallery/Bedroom/master-bedroom-walk-in-wardrobe-with-glass-drawers.png"
  },
  "/Website-Gallery/Bedroom/mbr wr 3.png": {
    name: "Premium Laminated Master Bedroom Wardrobe System",
    newUrl: "/Website-Gallery/Bedroom/premium-laminated-master-bedroom-wardrobe-system.png"
  },
  "/Website-Gallery/Bedroom/MBR.png": {
    name: "Elegant Matte Finish Master Bedroom Wardrobe",
    newUrl: "/Website-Gallery/Bedroom/elegant-matte-finish-master-bedroom-wardrobe.png"
  },
  "/Website-Gallery/Bedroom/son br study unit.png": {
    name: "Integrated Kids Study Desk and Wardrobe Cabinets",
    newUrl: "/Website-Gallery/Bedroom/integrated-kids-study-desk-and-wardrobe-cabinets.png"
  },
  "/Website-Gallery/Bedroom/wardrobe (2).png": {
    name: "Modern Sliding Bedroom Wardrobe with Mirror Panel",
    newUrl: "/Website-Gallery/Bedroom/modern-sliding-bedroom-wardrobe-with-mirror-panel.png"
  },
  "/Website-Gallery/Bedroom/wardrobe (3).png": {
    name: "Bespoke White Hinged Door Bedroom Wardrobe",
    newUrl: "/Website-Gallery/Bedroom/bespoke-white-hinged-door-bedroom-wardrobe.png"
  },
  "/Website-Gallery/Bedroom/wardrobe (4).png": {
    name: "Sleek Wardrobe and Dressing Vanity Layout",
    newUrl: "/Website-Gallery/Bedroom/sleek-wardrobe-and-dressing-vanity-layout.png"
  },
  "/Website-Gallery/Bedroom/wardrobe (5).png": {
    name: "Contemporary Warm Oak Finish Bedroom Wardrobe",
    newUrl: "/Website-Gallery/Bedroom/contemporary-warm-oak-finish-bedroom-wardrobe.png"
  },
  "/Website-Gallery/Bedroom/wardrobe (6).png": {
    name: "Minimalist Built In Sliding Bedroom Wardrobe",
    newUrl: "/Website-Gallery/Bedroom/minimalist-built-in-sliding-bedroom-wardrobe.png"
  },
  "/Website-Gallery/Bedroom/WARDROBE (7).png": {
    name: "Premium Dual Tone Hinged Bedroom Wardrobe",
    newUrl: "/Website-Gallery/Bedroom/premium-dual-tone-hinged-bedroom-wardrobe.png"
  },
  "/Website-Gallery/Bedroom/WARDROBE (8).png": {
    name: "Bespoke Walnut Bedroom Closet and Storage Shelves",
    newUrl: "/Website-Gallery/Bedroom/bespoke-walnut-bedroom-closet-and-storage-shelves.png"
  },
  "/Website-Gallery/Bedroom/wardrobe.png": {
    name: "Modern Sleek Sliding Bedroom Closet Console",
    newUrl: "/Website-Gallery/Bedroom/modern-sleek-sliding-bedroom-closet-console.png"
  },
  "/Website-Gallery/Bedroom/WhatsApp Image 2026-03-07 at 10.42.17 AM (1).jpeg": {
    name: "Cozy Kids Bedroom Study Corner with Toy Cabinets",
    newUrl: "/Website-Gallery/Bedroom/cozy-kids-bedroom-study-corner-with-toy-cabinets.jpeg"
  },
  "/Website-Gallery/Bedroom/WhatsApp Image 2026-03-07 at 10.42.17 AM (2).jpeg": {
    name: "Chic Mint Green Theme Kids Bedroom Storage Cabinets",
    newUrl: "/Website-Gallery/Bedroom/chic-mint-green-theme-kids-bedroom-storage-cabinets.jpeg"
  },
  "/Website-Gallery/Bedroom/WhatsApp Image 2026-03-07 at 10.42.17 AM (4).jpeg": {
    name: "Creative Playful Kids Room Study Desk Station",
    newUrl: "/Website-Gallery/Bedroom/creative-playful-kids-room-study-desk-station.jpeg"
  },
  "/Website-Gallery/Bedroom/WhatsApp Image 2026-03-07 at 10.42.18 AM (2).jpeg": {
    name: "Ergonomic Dual Kids Bedroom Study Desk Layout",
    newUrl: "/Website-Gallery/Bedroom/ergonomic-dual-kids-bedroom-study-desk-layout.jpeg"
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
console.log("Renamed all 17 generic/short Bedroom images successfully!");

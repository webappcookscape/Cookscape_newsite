const fs = require('fs');
const path = require('path');

const siteDataPath = 'src/data/siteData.js';
let siteDataContent = fs.readFileSync(siteDataPath, 'utf-8');

const collectionMatch = siteDataContent.match(/export const GALLERY_COLLECTION = (\[[\s\S]*?\]);/);
const collection = eval(collectionMatch[1]);
const publicDir = path.join(__dirname, 'public');

// Rules to identify generic or placeholder titles/filenames
const isGeneric = (title, url) => {
  const t = title.toLowerCase();
  const f = url.toLowerCase().split('/').pop();

  // If contains generic keywords or symbols
  if (t.includes('copy') || f.includes('copy') ||
      t.includes('opt') || f.includes('opt') ||
      t.includes('ks') || f.includes('ks') ||
      t.includes('lounge') || f.includes('lounge') ||
      t.includes('design') || f.includes('design') ||
      t.includes('enscape') || f.includes('enscape') ||
      t.includes('whatsapp') || f.includes('whatsapp') ||
      t.includes('untitled') || f.includes('untitled') ||
      /\b\d+\b/.test(t) || /\b\d+\b/.test(f) ||  // contains stand-alone numbers
      t.length < 9 || f.split('.')[0].length < 9 ||
      // exact generic matches
      t === 'kitchen' || t === 'tv unit' || t === 'pooja' || t === 'foyer' || t === 'living' || t === 'wardrobe' || t === 'crockery'
  ) {
    return true;
  }
  return false;
};

const remainingGenerics = [];
collection.forEach((item, index) => {
  if (item.category.toLowerCase() === 'bedroom') return;
  if (isGeneric(item.title, item.url)) {
    remainingGenerics.push({ index, category: item.category, title: item.title, url: item.url });
  }
});

console.log(`Found ${remainingGenerics.length} remaining generic/short items:`, JSON.stringify(remainingGenerics, null, 2));

// Lists of premium, descriptive names to pull from for the renaming
const customPremiumNames = {
  "Crockery unit": [
    "Luxury Built In Crockery Unit with Warm LED Shelves",
    "Minimalist Charcoal and Wood Dining Sideboard",
    "Contemporary Wall Hung Kitchen Crockery Cabinet",
    "Bespoke High Gloss White Dining Credenza",
    "Classic Glass Door Crockery Showcase with Drawers",
    "Elegant Walnut Veneer Dining Sideboard",
    "Modern Fluted Wood Dining Crockery Buffet"
  ],
  "Foyer": [
    "Bespoke Entrance Foyer Console with Backlit Mirror",
    "Modern Floating Foyer Panel and Key Holder"
  ],
  "Kids Furniture": [
    "Modular Twin Bedroom Wardrobe with Study Table",
    "Creative Multi Storage Kids Bedroom Toy Cabinet",
    "Ergonomic Compact Kids Study Desk Layout"
  ],
  "Living Room": [
    "Contemporary Fluted Wood Living Partition Wall",
    "Modern Accent Lounge Sofa Set Layout",
    "Luxury Quartz Coffee Table Entertainment Unit"
  ],
  "Modular kitchen": [
    "Premium U Shaped Dual Tone Acrylic Kitchen Layout",
    "Modern Parallel Kitchen Setup with Built In Hob",
    "Classic White Country Shaker Style Kitchen Cabinets",
    "Sleek Handleless Matte Finish Modular Kitchen",
    "Elegant Parallel Granite Top Kitchen System",
    "Contemporary Charcoal Modular Kitchen with Tall Units",
    "Compact Apartment Kitchen with High Gloss Cabinets",
    "Premium L Shaped Kitchen Layout with Quartz Counter",
    "Sleek Champagne Gold Profile Handle Kitchen Layout",
    "Modern Breakfast Island and Parallel Kitchen Layout",
    "Bespoke High Capacity Pull Out Pantry Drawer System",
    "Luxury Marble Wall Backsplash Modular Kitchen Setup"
  ],
  "Pooja Unit": [
    "Elegant Backlit CNC Lattice Pooja Mandir Cabinet",
    "Traditional Teak Wood Pooja Mandir Unit",
    "Modern Wall Mounted Floating Pooja Shelf Panel",
    "Contemporary Marble Wall Panels Pooja Mandir Setup",
    "Sleek High Gloss White Pooja Cabinet Setup",
    "Bespoke Jaali Pattern Door Pooja Mandir Cabinet",
    "Luxury Backlit Onyx Stone Pooja Mandir Layout"
  ],
  "TV unit": [
    "Luxury Wall Hung Fluted Panel TV Cabinet Console",
    "Modern Marble Panel Backdrop TV Unit setup",
    "Contemporary Floating Wooden TV Console Stand",
    "Sleek Low Profile High Gloss TV Unit Drawer Console",
    "Minimalist Backlit LED Wall Panel TV Unit Setup",
    "Bespoke Walnut Veneer Living Room TV Cabinet",
    "Sophisticated Dark Charcoal Floating TV Cabinet Setup",
    "Chic Multi Level Floating TV Console Setup",
    "Elegant False Partition Wall with Integrated TV Unit",
    "Contemporary White Gloss Media Center TV Console Layout",
    "Modern Compact Bedroom TV Console with Shelves",
    "Premium Matte Finish Living Lounge TV Unit Setup",
    "Luxury Integrated Backlit Display TV Console Cabinet"
  ],
  "Wardrobe": [
    "Sleek Built In Sliding Glass Wardrobe Closets",
    "Modern Matte Finish Hinged Door Bedroom Wardrobe",
    "Luxury Master Bedroom Walk In Closet Wardrobe Layout",
    "Contemporary Fluted Front Hinged Wardrobe Cabinetry",
    "Chic Gold Profile Handle Bedroom Wardrobe System",
    "Bespoke Walnut Grain Master Bedroom Wardrobe Layout"
  ]
};

const categoryCounters = {};
Object.keys(customPremiumNames).forEach(cat => {
  categoryCounters[cat] = 0;
});

const updatedCollection = collection.map(item => {
  if (item.category.toLowerCase() === 'bedroom') return item;

  if (isGeneric(item.title, item.url)) {
    const cat = item.category;
    const namesList = customPremiumNames[cat];
    const counter = categoryCounters[cat] || 0;

    if (namesList && counter < namesList.length) {
      const selectedName = namesList[counter];
      categoryCounters[cat] = counter + 1;

      // Generate clean filename
      const ext = path.extname(item.url);
      const slugName = selectedName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      
      const newFileName = `${slugName}${ext}`;
      const newUrl = `/Website-Gallery/${cat}/${newFileName}`.replace(/\\/g, '/');

      // Rename physically
      const oldDiskPath = path.join(publicDir, item.url);
      const newDiskPath = path.join(publicDir, newUrl);

      if (fs.existsSync(oldDiskPath)) {
        fs.mkdirSync(path.dirname(newDiskPath), { recursive: true });
        fs.renameSync(oldDiskPath, newDiskPath);
        console.log(`SUCCESS Renamed: ${item.url} -> ${newUrl}`);
      } else {
        console.warn(`WARNING File not found: ${oldDiskPath}`);
      }

      return {
        category: cat,
        url: newUrl,
        title: selectedName.replace(/\b\w/g, l => l.toUpperCase())
      };
    }
  }
  return item;
});

// Update siteData.js file content
const newCollectionString = JSON.stringify(updatedCollection, null, 2);
const updatedSiteDataContent = siteDataContent.replace(
  /export const GALLERY_COLLECTION = \[\s*[\s\S]*?\s*\];/g,
  `export const GALLERY_COLLECTION = ${newCollectionString};`
);

fs.writeFileSync(siteDataPath, updatedSiteDataContent, 'utf-8');
console.log("Batch renamed all remaining generic/sample/numbered images successfully!");

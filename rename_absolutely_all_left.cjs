const fs = require('fs');
const path = require('path');

const siteDataPath = 'src/data/siteData.js';
let siteDataContent = fs.readFileSync(siteDataPath, 'utf-8');

const collectionMatch = siteDataContent.match(/export const GALLERY_COLLECTION = (\[[\s\S]*?\]);/);
const collection = eval(collectionMatch[1]);
const publicDir = path.join(__dirname, 'public');

const isGeneric = (title, url) => {
  const t = title.toLowerCase();
  const f = url.toLowerCase().split('/').pop();

  if (t.includes('copy') || f.includes('copy') ||
      t.includes('opt') || f.includes('opt') ||
      t.includes('ks') || f.includes('ks') ||
      t.includes('design') || f.includes('design') ||
      t.includes('enscape') || f.includes('enscape') ||
      t.includes('whatsapp') || f.includes('whatsapp') ||
      t.includes('untitled') || f.includes('untitled') ||
      /\b\d+\b/.test(t) || /\b\d+\b/.test(f) ||
      t.length < 9 || f.split('.')[0].length < 9 ||
      t === 'kitchen' || t === 'tv unit' || t === 'pooja' || t === 'foyer' || t === 'living' || t === 'wardrobe' || t === 'bedroom' || t === 'crockery' || t === 'son bedroom'
  ) {
    return true;
  }
  return false;
};

// Custom lists of premium titles for the remaining generic items
const premiumBedroomNames = [
  "Modern Scandinavian Bedroom with Fluted Wood Paneled Headboard",
  "Luxury Master Bedroom with Glass Wardrobe and Velvet Seating",
  "Chic Minimalist Bedroom featuring Neutral Tones and Draped Curtains",
  "Elegant Blue Accent Wall Bedroom with Backlit Fluted Wardrobe",
  "Contemporary Warm Oak Bedroom Suite with Floating Bedside Tables",
  "Sophisticated Matte Black Sliding Door Wardrobe Bedroom Setup",
  "Playful Mint Green Kids Bedroom Bed with Space Wallpaper",
  "Cozy Window Seat Bedroom Setup with Mint Wardrobes and Toy Shelves",
  "Creative Chess Mural Kids Bedroom with Mint Study Desk",
  "Chic Dual Tone Kids Room with Built in Rabbit Space Wallpaper",
  "Minimalist Matte Mint Kids Wardrobe and Study Nook Layout",
  "Elegant Neutral Abstract Art Bedroom with Pendant Lighting",
  "Modern Master Bed Setup with Dark Wood Overhead Cabinets",
  "Luxury Bedroom Design with Backlit Arch Headboard Detail",
  "Contemporary Sliding Closet Bedroom Setup with Geometric Wallpaper",
  "Premium Laminate Finish Wardrobe Master Bedroom Layout",
  "Sleek Compact Wardrobe Bedroom Setup with Integrated Dresser",
  "Master Bedroom Lounge Corner with Tufted Armchair",
  "Chic Teen Bedroom with Study Desk and mountain Silhouette Wall",
  "Elegant Glass Front Wardrobe Bedroom Layout with Spotlights",
  "Modern Bedroom Suite featuring Fluted Wooden Headboard Panel",
  "Luxury Suite Bed Setup with Integrated Leather Bench",
  "Contemporary Wardrobe System Bedroom Layout with Gold Profiles",
  "Sleek Mirror Accent Sliding Wardrobe Bedroom Setup",
  "Bespoke Walk In Closet Dressing Area Bedroom Layout",
  "Chic Bedroom with Chevron Headboard and Metallic Accents",
  "Modern Minimalist Bed Frame Setup with Concrete Texture Wall",
  "Warm Maple Finish Bedroom Wardrobe and TV Panel setup",
  "Contemporary Accent Wall Bedroom with Hanging Edison Bulbs",
  "Luxury Bedroom Suite with Floating Bed and LED Cove Lighting",
  "Sleek Champagne Gold Profile Wardrobe Bedroom Setup",
  "Chic Compact Bedroom Layout with Built In Storage Bench",
  "Modern Minimalist Bedroom with Fluted Oak Backing",
  "Premium Sliding Shutter Wardrobe Bedroom Layout",
  "Contemporary Master Bed Setup with Integrated Reading Lights"
];

const premiumPoojaNames = [
  "Bespoke Wooden Arch Pooja Mandir with Backlit CNC Board",
  "Traditional Mandir Pooja Unit with Storage Drawers",
  "Modern Floating Pooja Cabinet with CNC Lattice Frame",
  "Elegant Marble Accent Pooja Unit with LED Spotlights",
  "Contemporary Sacred Pooja Mandir with Jaali Partition Screen"
];

const premiumTvNames = [
  "Contemporary Minimalist Media TV Console with Floating Drawer",
  "Modern Fluted TV Wall Console with Brass Inlays"
];

const premiumWardrobeNames = [
  "Bespoke Dual Tone Kids Wardrobe with Built In Study Desk",
  "Luxury Walk In Dressing Wardrobe System with Glass Drawers"
];

let bedroomCounter = 0;
let poojaCounter = 0;
let tvCounter = 0;
let wardrobeCounter = 0;

const updatedCollection = collection.map(item => {
  const isItemGeneric = isGeneric(item.title, item.url);
  
  if (isItemGeneric) {
    let selectedName = "";
    
    if (item.category === 'Bedroom') {
      if (bedroomCounter < premiumBedroomNames.length) {
        selectedName = premiumBedroomNames[bedroomCounter++];
      }
    } else if (item.category === 'Pooja Unit') {
      if (poojaCounter < premiumPoojaNames.length) {
        selectedName = premiumPoojaNames[poojaCounter++];
      }
    } else if (item.category === 'TV unit') {
      if (tvCounter < premiumTvNames.length) {
        selectedName = premiumTvNames[tvCounter++];
      }
    } else if (item.category === 'Wardrobe') {
      if (wardrobeCounter < premiumWardrobeNames.length) {
        selectedName = premiumWardrobeNames[wardrobeCounter++];
      }
    }

    if (selectedName) {
      const ext = path.extname(item.url);
      const slugName = selectedName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      
      const newFileName = `${slugName}${ext}`;
      const newUrl = `/Website-Gallery/${item.category}/${newFileName}`.replace(/\\/g, '/');

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
        category: item.category,
        url: newUrl,
        title: selectedName.replace(/\b\w/g, l => l.toUpperCase())
      };
    }
  }
  return item;
});

const newCollectionString = JSON.stringify(updatedCollection, null, 2);
const updatedSiteDataContent = siteDataContent.replace(
  /export const GALLERY_COLLECTION = \[\s*[\s\S]*?\s*\];/g,
  `export const GALLERY_COLLECTION = ${newCollectionString};`
);

fs.writeFileSync(siteDataPath, updatedSiteDataContent, 'utf-8');
console.log("Renamed ALL remaining generic bedroom and balance unit images successfully!");

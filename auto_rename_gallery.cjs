const fs = require('fs');
const path = require('path');

const siteDataPath = 'src/data/siteData.js';
let siteDataContent = fs.readFileSync(siteDataPath, 'utf-8');

// Parse GALLERY_COLLECTION array content
const collectionMatch = siteDataContent.match(/export const GALLERY_COLLECTION = (\[[\s\S]*?\]);/);
if (!collectionMatch) {
  console.error("Could not find GALLERY_COLLECTION in siteData.js");
  process.exit(1);
}

let collection;
try {
  collection = eval(collectionMatch[1]);
} catch (e) {
  console.error("Failed to parse GALLERY_COLLECTION:", e);
  process.exit(1);
}

const publicDir = path.join(__dirname, 'public');

// Lists of premium, descriptive titles to assign dynamically for each category
const namesByCategory = {
  "Crockery unit": [
    "Modern Glass Front Crockery Console",
    "Classic Wooden Buffet Crockery Unit",
    "Contemporary Wall Mounted Crockery Cabinet",
    "Sleek High Gloss Acrylic Crockery Unit",
    "Minimalist Kitchen Breakfast Counter with Crockery",
    "Premium Painted Finish Crockery Showcase",
    "Luxury Floating Glass Crockery Cabinet",
    "Rustic Oak Dining Room Crockery Console",
    "Scandinavian Style Built In Crockery Unit",
    "Sophisticated Dark Wood Crockery Bar",
    "Elegant White Lacquered Crockery Unit",
    "Warm Walnut Dining Sideboard Cabinet",
    "Modern Fluted Glass Crockery Showcase",
    "Chic Compact Crockery Unit with LED Lighting",
    "Transitional Style Kitchen Crockery Buffet",
    "Luxury Quartz Top Dining Sideboard",
    "Minimalist Matte Gray Crockery Cabinet",
    "Industrial Style Metal Frame Crockery Rack",
    "Bespoke Tall Pantry and Crockery Cabinet"
  ],
  "Foyer": [
    "Contemporary Floating Foyer Console",
    "Luxury Paneled Foyer Entrance Unit"
  ],
  "Kids Furniture": [
    "Vibrant Pastel Themed Study Desk",
    "Modern Modular Bunk Bed with Storage",
    "Playful Activity Area Storage Cabinet",
    "Ergonomic Height Adjustable Kids Study Station",
    "Chic Pastel Mint Kids Wardrobe Unit",
    "Space Themed Kids Room Bedside Drawer",
    "Creative Modular Toy Storage Organizer",
    "Compact Dual Share Study Table",
    "Cozy Window Seat Toy Cabinet System",
    "Playful Montessori Style Low Bookshelf",
    "Delightful Pastel Pink Kids Vanity Table"
  ],
  "Living Room": [
    "Luxury Fluted Wooden Living Room Panel",
    "Contemporary L Shape Sofa Lounge Set",
    "Minimalist Marble Finish Coffee Table Console",
    "Elegant Floating Living Room Shelving",
    "Bespoke Fluted Partition Screen Wall",
    "Modern Accent Armchair Cozy Seating Corner",
    "Premium Textured Wall Panel Living Setup",
    "Sophisticated False Ceiling Lighting Living Lounge",
    "Chic Open Concept Living Dining Partition",
    "Luxury Velvet Upholstered Sofa Entertainment Unit"
  ],
  "Modular kitchen": [
    "Premium U Shaped Acrylic Modular Kitchen",
    "Elegant Parallel Granite Top Modular Kitchen",
    "Modern L Shaped High Gloss Kitchen Cabinetry",
    "Sophisticated Island Kitchen with Breakfast Counter",
    "Chic Matte Finish Modular Kitchen Cabinets",
    "Luxury Handleless Soft Close Kitchen Setup",
    "Contemporary Seamless Kitchen Drawers and Pantry",
    "Modern Industrial Plywood Finish Kitchen Setup",
    "Classic White Country Style Modular Kitchen",
    "Bespoke Dual Tone Modular Kitchen Cabinets",
    "Urban Compact Apartment Kitchen with Hob",
    "Sleek Metallic Finish Modular Kitchen Cabinetry",
    "Elegant Quartz Countertop Parallel Kitchen Layout",
    "High End Glass Shutter Modular Kitchen Cabinets",
    "Contemporary Charcoal Gray High Gloss Kitchen Setup",
    "Bright Pastel Blue Acrylic Modular Kitchen",
    "Premium Built In Appliance Oven Tall Pantry Cabinet",
    "Minimalist Concrete Finish Modular Kitchen",
    "Warm Walnut and White Dual Tone Kitchen System",
    "Chic Olive Green Modular Kitchen Cabinets",
    "Luxury Marble Backsplash L Shaped Modular Kitchen",
    "Modern Parallel Kitchen Layout with Tall Units",
    "Classic Wooden Texture Shaker Style Kitchen Cabinets",
    "Compact Studio Apartment Modular Kitchen Cabinetry",
    "Sophisticated Matte Black Modular Kitchen Setup",
    "Ergonomic Modular Kitchen Drawers with Peg Organizers",
    "Premium Under Cabinet LED Lit Modular Kitchen",
    "Contemporary Modular Kitchen with Stainless Steel Top",
    "Sleek Champagne Gold Profile Handle Kitchen System",
    "Modern Oak Finish Laminate Modular Kitchen Cabinets",
    "Chic Emerald Green High Gloss Modular Kitchen",
    "Elegant Beige Acrylic Finish Modular Kitchen Cabinets",
    "Minimalist Seamless Modular Kitchen Layout",
    "High Capacity Pull Out Basket Kitchen Cabinets",
    "Modern Breakfast Island Modular Kitchen System",
    "Premium Acrylic Finished L Shape Kitchen Cabinets",
    "Elegant Quartz Finish Modular Kitchen Island Unit",
    "Luxury Granite Countertop Modular Kitchen setup",
    "Sleek Parallel Modular Kitchen Cabinets Layout",
    "Bespoke Compact Modular Kitchen Layout",
    "Contemporary High Gloss Dual Tone Modular Kitchen",
    "Modern Curved Edge Modular Kitchen Countertop",
    "Chic Dark Indigo Modular Kitchen Cabinets",
    "Elegant L Shaped Dual Level Kitchen Island Setup",
    "Minimalist Matte Charcoal Modular Kitchen Cabinetry",
    "Premium Oak Woodgrain Parallel Modular Kitchen Layout",
    "Contemporary Champagne High Gloss Acrylic Kitchen Cabinets",
    "Modern Breakfast Counter Extension Kitchen Layout",
    "Sleek Modular Kitchen Setup with Built In Sink",
    "Luxury Textured Backsplash Parallel Modular Kitchen Layout",
    "High Gloss White and Oak Parallel Kitchen Layout",
    "Contemporary Floating Shelves Modular Kitchen Cabinetry"
  ],
  "Pooja Unit": [
    "Traditional Teak Wood Carved Pooja Mandir",
    "Modern Backlit CNC Cutting Pooja Unit Design",
    "Elegant Wall Mounted Compact Pooja Shelf",
    "Contemporary Marble Finish Pooja Cabinet",
    "Sleek High Gloss White Pooja Unit Cabinetry",
    "Bespoke Jaali Door Pooja Mandir Cabinet",
    "Luxury Backlit Onyx Stone Pooja Mandir Setup",
    "Traditional Sacred Space Pooja Cabinet with Drawers",
    "Minimalist Floating Wooden Pooja Shelf Layout",
    "Contemporary Lattice Door Wooden Pooja Cabinet Setup",
    "Sophisticated LED Lit Marble Pooja Mandir Unit",
    "Chic Compact Corner Pooja Unit Cabinetry",
    "Elegant Walnut Texture Tall Pooja Mandir Cabinet",
    "Premium Painted Finish Jaali Door Pooja Cabinet",
    "Classic Temple Style Pooja Cabinet Setup",
    "Modern Compact Apartment Pooja Shelf Unit",
    "Bespoke Semi Partition Pooja Unit Cabinetry",
    "Contemporary Sacred Nook Pooja Mandir Panel"
  ],
  "TV unit": [
    "Luxury Fluted Wall Mounted TV Cabinet Unit",
    "Contemporary Floating Wood Texture TV Console",
    "Modern Marble Paneled Media Center TV Stand",
    "Sleek High Gloss Low Profile TV Unit Console",
    "Minimalist TV Wall Panel with Backlit LED",
    "Bespoke Walnut Veneer TV Cabinet Panel",
    "Sophisticated Dark Charcoal Floating TV console",
    "Chic Dual Level Living Room TV Stand Layout",
    "Elegant False Panel TV Console Storage Unit",
    "Contemporary White Gloss TV Entertainment Center",
    "Modern Compact TV Console Bedside Media Unit",
    "Premium Matte Finish Living Room TV Cabinet Setup",
    "Luxury Gold Trim Accent TV Wall Panel Unit",
    "Sleek Modular Floating Shelves TV Cabinet Setup",
    "Contemporary Laminated TV Console Drawer Unit",
    "Bespoke Tall Media Wardrobe and TV Panel Unit",
    "Modern Wall Mounted Fluted TV Cabinet Unit",
    "Elegant Marble Base Wall Hung TV Console Setup",
    "Chic Floating Woodgrain TV Console Drawer Unit",
    "Minimalist Textured Backing TV Console Console",
    "Premium Acrylic Living Room TV Cabinet Unit",
    "Bespoke Slatted Panel TV Entertainment Center",
    "Contemporary Compact Wall Hung TV Console Cabinet",
    "Luxury Integrated Backlit Shelf TV Unit Console"
  ],
  "Wardrobe": [
    "Modern Glass Sliding Door Wardrobe Console",
    "Sleek Matte Finish Hinged Wardrobe Closet",
    "Luxury Walk In Wardrobe Glass Cabinet System",
    "Contemporary Fluted Front Hinged Door Wardrobe Closet",
    "Chic Champagne Gold Handle Bedroom Wardrobe Cabinets",
    "Minimalist Built In Sliding Door Wardrobe Wardrobe",
    "Bespoke Walnut Texture Master Bedroom Wardrobe Closet",
    "Modern Dual Tone Hinged Door Wardrobe Storage",
    "Sleek Integrated Mirror Sliding Door Wardrobe Unit",
    "Premium High Gloss Acrylic Bedroom Wardrobe Closet",
    "Contemporary Walk In Wardrobe Cabinetry Layout",
    "Luxury Walk In Dressing Closet Wardrobe System",
    "Chic Compact Bedroom Wardrobe Drawer Unit Layout",
    "Elegant Warm Oak Finish Bedroom Wardrobe Closet",
    "Minimalist Matte Charcoal Wardrobe Cabinet Closet",
    "Bespoke Multi Tier Sliding Wardrobe Closet System",
    "Contemporary Champagne High Gloss Bedroom Wardrobe Closet",
    "Modern High Capacity Wardrobe Shelf System",
    "Premium Glass Panel Sliding Door Wardrobe Wardrobe"
  ]
};

// Index counters to track assigned descriptive names per category
const categoryCounters = {};
Object.keys(namesByCategory).forEach(cat => {
  categoryCounters[cat] = 0;
});

const genericRegex = /design\s+\d+|enscape|whatsapp|^\d+$|^[a-z]+$/i;

const renamedCollection = collection.map(item => {
  // Check if it belongs to Bedroom (skip per user request)
  if (item.category.toLowerCase() === 'bedroom') {
    return item;
  }

  // Check if title or url is generic
  const isGeneric = genericRegex.test(item.title) || genericRegex.test(item.url);
  
  if (isGeneric) {
    const cat = item.category;
    const namesList = namesByCategory[cat];
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
        // Create directory recursively if it doesn't exist
        fs.mkdirSync(path.dirname(newDiskPath), { recursive: true });
        fs.renameSync(oldDiskPath, newDiskPath);
        console.log(`Renamed: ${item.url} -> ${newUrl}`);
      } else {
        console.warn(`File not found on disk: ${oldDiskPath}`);
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
const newCollectionString = JSON.stringify(renamedCollection, null, 2);
// Replace the old array inside export const GALLERY_COLLECTION = [...]
const updatedSiteDataContent = siteDataContent.replace(
  /export const GALLERY_COLLECTION = \[\s*[\s\S]*?\s*\];/g,
  `export const GALLERY_COLLECTION = ${newCollectionString};`
);

fs.writeFileSync(siteDataPath, updatedSiteDataContent, 'utf-8');
console.log("Automatically renamed all generic images and updated siteData.js configuration successfully!");

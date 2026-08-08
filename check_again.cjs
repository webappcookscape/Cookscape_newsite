const fs = require('fs');

const siteDataContent = fs.readFileSync('src/data/siteData.js', 'utf-8');
const collectionMatch = siteDataContent.match(/export const GALLERY_COLLECTION = (\[[\s\S]*?\]);/);
const collection = eval(collectionMatch[1]);

const isGeneric = (title, url) => {
  const t = title.toLowerCase();
  const f = url.toLowerCase().split('/').pop();

  if (t.includes('copy') || f.includes('copy') ||
      t.includes('opt') || f.includes('opt') ||
      t.includes('ks') || f.includes('ks') ||
      t.includes('lounge') || f.includes('lounge') ||
      t.includes('design') || f.includes('design') ||
      t.includes('enscape') || f.includes('enscape') ||
      t.includes('whatsapp') || f.includes('whatsapp') ||
      t.includes('untitled') || f.includes('untitled') ||
      /\b\d+\b/.test(t) || /\b\d+\b/.test(f) ||
      t.length < 9 || f.split('.')[0].length < 9 ||
      t === 'kitchen' || t === 'tv unit' || t === 'pooja' || t === 'foyer' || t === 'living' || t === 'wardrobe' || t === 'crockery'
  ) {
    return true;
  }
  return false;
};

const remaining = [];
collection.forEach((item, index) => {
  if (item.category.toLowerCase() === 'bedroom') return;
  if (isGeneric(item.title, item.url)) {
    remaining.push({
      category: item.category,
      url: item.url,
      title: item.title
    });
  }
});

console.log(JSON.stringify(remaining, null, 2));
console.log(`Found ${remaining.length} remaining items.`);

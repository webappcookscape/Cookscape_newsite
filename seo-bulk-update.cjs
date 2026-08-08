const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, 'src', 'pages', 'blogs');

if (!fs.existsSync(blogsDir)) {
  console.error('Blogs directory not found!');
  process.exit(1);
}

const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.jsx'));

let updatedCount = 0;

files.forEach(file => {
  const filePath = path.join(blogsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let hasChanges = false;

  // Replace empty alt attributes with something descriptive based on the component or general SEO
  // e.g. alt="" -> alt="Cookscape Interior Design Blog"
  // e.g. <img src={...} /> -> <img src={...} alt="Cookscape Interior Design Blog" />
  
  // 1. Replace empty alt=""
  const altRegex = /alt=["']([^"']*)["']/g;
  const newContent1 = content.replace(altRegex, (match, p1) => {
    if (p1.trim() === '') {
      hasChanges = true;
      return `alt="Cookscape Interior Design Blog Image"`;
    }
    return match;
  });
  
  // 2. Add loading="lazy" to all img tags if missing
  const imgRegex = /<img([^>]+)>/g;
  const newContent2 = newContent1.replace(imgRegex, (match, attributes) => {
    let updatedMatch = match;
    let modified = false;
    if (!/alt=/.test(attributes)) {
       updatedMatch = updatedMatch.replace('<img', '<img alt="Cookscape Interior Design Blog Image"');
       modified = true;
    }
    if (!/loading=/.test(attributes)) {
       updatedMatch = updatedMatch.replace('<img', '<img loading="lazy"');
       modified = true;
    }
    if (modified) {
       hasChanges = true;
       return updatedMatch;
    }
    return match;
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, newContent2, 'utf8');
    updatedCount++;
  }
});

console.log(`Successfully updated ${updatedCount} blog files with SEO attributes.`);

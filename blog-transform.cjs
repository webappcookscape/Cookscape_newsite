const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, 'src', 'pages', 'blogs');
const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.jsx'));

// Skip Blog2d.jsx (already has custom redesign) and main index pages
const skipFiles = ['Blog2d.jsx'];
// Index pages: Blog.jsx, Blog2.jsx, Blog3.jsx, Blog4.jsx, Blog5.jsx, Blog6.jsx, Blog7.jsx, Blog8.jsx
const indexPages = ['Blog.jsx', 'Blog2.jsx', 'Blog3.jsx', 'Blog4.jsx', 'Blog5.jsx', 'Blog6.jsx', 'Blog7.jsx', 'Blog8.jsx'];

let updated = 0;
let skipped = 0;
let errors = [];

for (const file of files) {
  if (skipFiles.includes(file) || indexPages.includes(file)) {
    console.log(`SKIP: ${file}`);
    skipped++;
    continue;
  }

  const filePath = path.join(blogsDir, file);
  
  // Read the ORIGINAL backup or current content
  const backupPath = filePath + '.bak';
  let content;
  if (fs.existsSync(backupPath)) {
    content = fs.readFileSync(backupPath, 'utf-8');
  } else {
    content = fs.readFileSync(filePath, 'utf-8');
  }

  // If file already uses BlogLayout and doesn't have old patterns, it was already transformed
  // We need the original content. Check if it still has Helmet (original pattern)
  if (!content.includes('Helmet') && !content.includes('services-breadcrumb')) {
    console.log(`ALREADY TRANSFORMED (no original): ${file}`);
    skipped++;
    continue;
  }

  const componentName = file.replace('.jsx', '');

  // Extract all const variable declarations for images
  const varDeclarations = [];
  const varRegex = /const\s+(\w+)\s*=\s*['"]([^'"]+)['"]/g;
  let varMatch;
  while ((varMatch = varRegex.exec(content)) !== null) {
    const varName = varMatch[1];
    const varPath = varMatch[2];
    // Skip 'interior' var (logo for modal we're removing)
    if (varName === 'interior') continue;
    varDeclarations.push({ name: varName, path: varPath });
  }

  // Separate hero/author image vars
  let heroVar = null;
  let authorVar = null;
  const otherVars = [];

  for (const v of varDeclarations) {
    if (!heroVar && v.name.startsWith('blog')) {
      heroVar = v;
    } else if (!authorVar && (v.name.startsWith('ar') || v.path.includes('architect') || v.path.includes('Architect'))) {
      authorVar = v;
    } else {
      otherVars.push(v);
    }
  }

  // Find the title
  const titleMatch = content.match(/<h1\s+className=['"]blog-page-title[^'"]*['"][^>]*>([\s\S]*?)<\/h1>/);
  const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : componentName;

  // Find canonical URL
  const canonicalMatch = content.match(/href=["'](https:\/\/www\.cookscape\.com\/[^"']*)["']/);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1] : 'https://www.cookscape.com/blog';

  // Find author name
  const authorNameMatch = content.match(/<h1\s+className=['"]blog-title[^'"]*['"][^>]*>([\s\S]*?)<\/h1>/);
  const authorName = authorNameMatch ? authorNameMatch[1].replace(/\s+/g, ' ').trim() : 'Cookscape Team';

  // Extract body content (between title h1 and author img)
  let bodyContent = '';
  const bodyStartMatch = content.match(/<h1\s+className=['"]blog-page-title[^'"]*['"][^>]*>[\s\S]*?<\/h1>/);
  const bodyEndMatch = content.match(/<img\s[^>]*(?:class|className)=['"][^'"]*blog-page-author-img/);

  if (bodyStartMatch && bodyEndMatch) {
    const startIdx = bodyStartMatch.index + bodyStartMatch[0].length;
    const endIdx = bodyEndMatch.index;
    bodyContent = content.substring(startIdx, endIdx).trim();
  } else if (bodyStartMatch) {
    // No author image found - grab content up to closing divs before modal
    const startIdx = bodyStartMatch.index + bodyStartMatch[0].length;
    const modalIdx = content.indexOf('class="modal fade"');
    if (modalIdx > -1) {
      bodyContent = content.substring(startIdx, modalIdx).trim();
      // Clean trailing </div> tags
      bodyContent = bodyContent.replace(/\s*<\/div>\s*<\/div>\s*<\/div>\s*$/, '');
      bodyContent = bodyContent.replace(/\s*<\/div>\s*<\/div>\s*$/, '');
    }
  }

  // Remove old author section from body
  bodyContent = bodyContent.replace(/<img[^>]*blog-page-author-img[^>]*\/?>\s*/g, '');
  bodyContent = bodyContent.replace(/<h1\s+className=['"]blog-title[^'"]*['"][^>]*>[\s\S]*?<\/h1>/g, '');
  bodyContent = bodyContent.replace(/\s*<\/div>\s*<\/div>\s*$/, '');
  bodyContent = bodyContent.trim();

  // Build variable declarations for the new file
  let varLines = '';
  if (heroVar) {
    varLines += `const heroImage = '${heroVar.path}';\n`;
  } else {
    varLines += `const heroImage = '/logo.jpeg';\n`;
  }
  if (authorVar) {
    varLines += `const authorImage = '${authorVar.path}';\n`;
  } else {
    varLines += `const authorImage = '/logo.jpeg';\n`;
  }
  // Include other image vars that are referenced in the body
  for (const v of otherVars) {
    if (bodyContent.includes(`{${v.name}}`)) {
      varLines += `const ${v.name} = '${v.path}';\n`;
    }
  }
  // Also check if heroVar's name is used in body (for inline images)
  if (heroVar && bodyContent.includes(`{${heroVar.name}}`)) {
    varLines += `const ${heroVar.name} = '${heroVar.path}';\n`;
  }
  // Check if authorVar name used in body
  if (authorVar && bodyContent.includes(`{${authorVar.name}}`)) {
    varLines += `const ${authorVar.name} = '${authorVar.path}';\n`;
  }

  // Escape title for JSX attribute
  const escapedTitle = title.replace(/"/g, '&quot;').replace(/&/g, '&amp;');

  const newContent = `import React from 'react';
import BlogLayout from '../../components/BlogLayout';

${varLines}
const ${componentName} = () => {
  return (
    <BlogLayout
      title="${escapedTitle}"
      heroImage={heroImage}
      authorImage={authorImage}
      authorName="${authorName.replace(/"/g, '&quot;')}"
      canonicalUrl="${canonicalUrl}"
    >
      ${bodyContent}
    </BlogLayout>
  );
};

export default ${componentName};
`;

  fs.writeFileSync(filePath, newContent, 'utf-8');
  updated++;
  console.log(`DONE: ${file} -> "${title.substring(0, 60)}..."`);
}

console.log(`\nFinished! Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors.length}`);
if (errors.length > 0) {
  errors.forEach(e => console.log(`  ERROR: ${e}`));
}

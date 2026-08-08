const fs = require('fs');
const path = require('path');

// Fix blogsData.js
const dataFile = path.join(__dirname, 'src', 'data', 'blogsData.js');
let dataContent = fs.readFileSync(dataFile, 'utf8');
dataContent = dataContent.replace(/ \.webp/g, '.webp');
fs.writeFileSync(dataFile, dataContent);

// Fix blog JSX files
const blogsDir = path.join(__dirname, 'src', 'pages', 'blogs');
const blogFiles = fs.readdirSync(blogsDir).filter(file => file.endsWith('.jsx'));

blogFiles.forEach(file => {
    let content = fs.readFileSync(path.join(blogsDir, file), 'utf8');
    content = content.replace(/ \.webp/g, '.webp');
    fs.writeFileSync(path.join(blogsDir, file), content);
});

console.log(`Cleaned image paths in data and ${blogFiles.length} blog files.`);

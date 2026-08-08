const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'src', 'data', 'blogsData.js');
let content = fs.readFileSync(dataFile, 'utf8');

// Lowercase all image paths
content = content.replace(/"image": "(.*?)"/g, (match, p1) => {
    return `"image": "${p1.toLowerCase()}"`;
});

fs.writeFileSync(dataFile, content);
console.log('Normalized image paths in blogsData.js to lowercase.');

const fs = require('fs');
const path = require('path');

const mappings = JSON.parse(fs.readFileSync('C:/Users/aravi/.gemini/antigravity-ide/brain/5f06429a-0ee8-4a75-b6f0-a213aea27b13/scratch/mappings.json', 'utf-8'));
let siteData = fs.readFileSync('src/data/siteData.js', 'utf-8');

const publicDir = path.join(__dirname, 'public');

for (const [oldPath, newName] of Object.entries(mappings)) {
    const ext = path.extname(oldPath);
    const newFileName = newName.endsWith(ext) ? newName : newName + ext;
    const dir = path.dirname(oldPath); // e.g. /Website-Gallery/Bedroom
    
    const newPath = path.join(dir, newFileName).replace(/\\/g, '/');
    
    const oldDiskPath = path.join(publicDir, oldPath);
    const newDiskPath = path.join(publicDir, newPath);
    
    if (fs.existsSync(oldDiskPath)) {
        fs.renameSync(oldDiskPath, newDiskPath);
        
        // Update siteData.js - simple string replace for the url string
        siteData = siteData.replace(oldPath, newPath);
        
        // Update title based on the new filename (without extension)
        const nameWithoutExt = newName.replace(ext, '');
        const newTitle = nameWithoutExt.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        // Find the title right after this url. This is a bit tricky with regex, let's just do a specific regex.
        // It looks like:
        // "url": "/Website-Gallery/Bedroom/old.png",
        // "title": "Old Title"
        const regex = new RegExp(`"url": "${newPath}",\\s*"title": "[^"]*"`, 'g');
        siteData = siteData.replace(regex, `"url": "${newPath}",\n    "title": "${newTitle}"`);
        
        console.log(`Renamed ${oldPath} to ${newPath}`);
    } else {
        console.log(`File not found: ${oldDiskPath}`);
    }
}

fs.writeFileSync('src/data/siteData.js', siteData, 'utf-8');
console.log('Update complete.');

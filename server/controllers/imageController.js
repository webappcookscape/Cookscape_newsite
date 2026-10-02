import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Controller to rename gallery images on disk and sync src/data/siteData.js
 */
export const renameImage = (req, res) => {
  const { oldUrl, newName, category } = req.body;

  if (!oldUrl || !newName || !category) {
    return res.status(400).json({ error: 'Missing required fields (oldUrl, newName, category).' });
  }

  try {
    const publicDir = path.join(__dirname, '../../public');
    const oldDiskPath = path.join(publicDir, oldUrl);

    if (!fs.existsSync(oldDiskPath)) {
      return res.status(404).json({ error: `Image file not found on disk at: ${oldUrl}` });
    }

    const ext = path.extname(oldUrl);
    const slugName = newName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const newFileName = `${slugName}${ext}`;
    const categoryFolder = category;

    const newUrl = `/Website-Gallery/${categoryFolder}/${newFileName}`.replace(/\\/g, '/');
    const newDiskPath = path.join(publicDir, newUrl);

    fs.renameSync(oldDiskPath, newDiskPath);
    console.log(`Physically renamed file from ${oldDiskPath} to ${newDiskPath}`);

    const siteDataPath = path.join(__dirname, '../../src/data/siteData.js');
    if (fs.existsSync(siteDataPath)) {
      let siteDataContent = fs.readFileSync(siteDataPath, 'utf-8');
      const newTitle = newName.replace(/\b\w/g, (l) => l.toUpperCase());

      const escapedOldUrl = oldUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      siteDataContent = siteDataContent.replace(
        new RegExp(`"url":\\s*"${escapedOldUrl}"`, 'g'),
        `"url": "${newUrl}"`
      );

      const escapedNewUrl = newUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const titleRegex = new RegExp(`("url":\\s*"${escapedNewUrl}",\\s*"title":\\s*")[^"]*(")`, 'g');
      siteDataContent = siteDataContent.replace(titleRegex, `$1${newTitle}$2`);

      fs.writeFileSync(siteDataPath, siteDataContent, 'utf-8');
      console.log(`Updated siteData.js for ${oldUrl} -> ${newUrl} with title "${newTitle}"`);
    } else {
      console.warn(`siteData.js not found at: ${siteDataPath}`);
    }

    return res.status(200).json({ success: true, newUrl, newTitle: newName });
  } catch (err) {
    console.error('Error during image renaming:', err);
    return res.status(500).json({ error: `Internal error: ${err.message}` });
  }
};

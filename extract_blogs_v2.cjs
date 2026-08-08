const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, 'src', 'pages', 'blogs');
const outputDir = path.join(__dirname, 'src', 'data');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const blogFiles = fs.readdirSync(blogsDir).filter(file => file.endsWith('.jsx'));

const blogData = blogFiles.map(file => {
    const content = fs.readFileSync(path.join(blogsDir, file), 'utf8');
    
    // Prioritize blog-page-title which is the actual article title
    let titleMatch = content.match(/<h1 className='blog-page-title pt-3'>(.*?)<\/h1>/);
    if (!titleMatch) {
        titleMatch = content.match(/<h1 className='blog-title pt-3'>(.*?)<\/h1>/);
    }
    
    // Clean title (remove "Architect" if it was accidentally picked up)
    let title = titleMatch ? titleMatch[1].trim() : 'Untitled';
    if (title.startsWith('Architect')) {
        // Look for a secondary title if the first one was an architect name
        const secondaryTitleMatch = content.match(/<h2 className='blog-page-title-2'>(.*?)<\/h2>/);
        if (secondaryTitleMatch) title = secondaryTitleMatch[1].trim();
    }

    const paraMatch = content.match(/<p className='blog-para'>(.*?)<\/p>/) ||
                      content.match(/<p className='blog-page-para'>(.*?)<\/p>/);
    const authorMatch = content.match(/Architect (.*?)<\/h1>/) || 
                        content.match(/Architect (.*?)<\/h1>/);
    
    // Fix image matching - search for the FIRST blog image used in the file
    const imageMatch = content.match(/const blog\d+[a-z]? = '\/blog-images\/(.*?)\.webp'/);
    
    const slug = file.replace('.jsx', '').toLowerCase();
    
    return {
        id: slug,
        title: title,
        excerpt: paraMatch ? paraMatch[1].trim() : '',
        author: authorMatch ? authorMatch[1].trim().replace('Architect ', '') : 'Cookscape Expert',
        image: imageMatch ? `/blog-images/${imageMatch[1]}.webp` : '/blog-images/cookscape-blog-1 .webp',
        file: file
    };
});

// Remove duplicates based on title (some blog files are just variations)
const uniqueBlogs = [];
const seenTitles = new Set();
blogData.forEach(blog => {
    if (!seenTitles.has(blog.title)) {
        uniqueBlogs.push(blog);
        seenTitles.add(blog.title);
    }
});

fs.writeFileSync(path.join(outputDir, 'blogsData.js'), `export const blogs = ${JSON.stringify(uniqueBlogs, null, 2)};`);

console.log(`Extracted data for ${uniqueBlogs.length} unique blogs (filtered from ${blogData.length} files).`);

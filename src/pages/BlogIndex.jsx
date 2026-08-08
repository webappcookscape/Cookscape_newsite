import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogs } from '../data/blogsData';

const CATEGORIES = [
  { id: 'all', name: 'All Stories' },
  { id: 'kitchens', name: 'Modular Kitchens' },
  { id: 'bedrooms', name: 'Wardrobes & Bedrooms' },
  { id: 'living', name: 'Living & Pooja' },
  { id: 'variants', name: 'Materials & Variants' },
  { id: 'guides', name: 'Design Guides & Tips' }
];

const getBlogCategory = (blog) => {
  const text = `${blog.title} ${blog.excerpt}`.toLowerCase();
  
  if (text.includes('kitchen') || text.includes('modular') || text.includes('hob') || text.includes('sink') || text.includes('cabinet')) {
    return 'kitchens';
  }
  if (text.includes('wardrobe') || text.includes('bedroom') || text.includes('bed') || text.includes('kids room') || text.includes('closet')) {
    return 'bedrooms';
  }
  if (text.includes('living') || text.includes('pooja') || text.includes('family room') || text.includes('dining') || text.includes('stairs') || text.includes('staircase')) {
    return 'living';
  }
  if (text.includes('variant') || text.includes('suede') || text.includes('veneer') || text.includes('glass') || text.includes('plywood') || text.includes('paint') || text.includes('lighting') || text.includes('capricoast') || text.includes('iris') || text.includes('classic') || text.includes('alumix') || text.includes('tuff gloss') || text.includes('vanity') || text.includes('surabhi')) {
    return 'variants';
  }
  return 'guides';
};

const BlogIndex = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Filter and search logic
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      // Category filter
      if (activeCategory !== 'all' && getBlogCategory(blog) !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = blog.title?.toLowerCase().includes(query);
        const matchesExcerpt = blog.excerpt?.toLowerCase().includes(query);
        const matchesAuthor = blog.author?.toLowerCase().includes(query);
        return matchesTitle || matchesExcerpt || matchesAuthor;
      }
      return true;
    });
  }, [searchQuery, activeCategory]);

  const isBrowsingDefault = activeCategory === 'all' && searchQuery.trim() === '';
  
  // Featured blog: always prioritize Architect Raakesh Natarajan's story
  const featuredBlog = useMemo(() => {
    if (!isBrowsingDefault) return null;
    return filteredBlogs.find(b => b.id === 'blog1c') || filteredBlogs[0] || null;
  }, [isBrowsingDefault, filteredBlogs]);

  const gridBlogs = useMemo(() => {
    if (!isBrowsingDefault) return filteredBlogs;
    return filteredBlogs.filter(b => b !== featuredBlog);
  }, [isBrowsingDefault, filteredBlogs, featuredBlog]);

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentGridBlogs = gridBlogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(gridBlogs.length / postsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        end = 4;
      }
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      if (start > 2) {
        pages.push('ellipsis1');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push('ellipsis2');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="blog-index-page">
      <Helmet>
        <title>Interior Design Blog | Tips, Trends & Insights — Cookscape</title>
        <meta name="description" content="Explore 80+ articles on modular kitchens, wardrobe design, home renovation tips, and interior design trends from Cookscape's expert architects in Chennai." />
        <meta name="keywords" content="interior design blog, modular kitchen tips, wardrobe ideas, home decor trends, interior design Chennai, cookscape blog" />
        <link rel="canonical" href="https://cookscape.in/blog" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Cookscape Interiors" />
        <meta property="og:url" content="https://cookscape.in/blog" />
        <meta property="og:title" content="Interior Design Blog | Tips, Trends & Insights — Cookscape" />
        <meta property="og:description" content="Explore 80+ articles on modular kitchens, wardrobe design, home renovation tips, and interior design trends from Cookscape's expert architects." />
        <meta property="og:image" content="https://cookscape.in/og-image.jpg" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Interior Design Blog | Tips, Trends & Insights — Cookscape" />
        <meta name="twitter:description" content="Explore 80+ articles on modular kitchens, wardrobe design, home renovation tips, and interior design trends from Cookscape's expert architects." />
        <meta name="twitter:image" content="https://cookscape.in/og-image.jpg" />

        {/* Breadcrumb JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://cookscape.in/"},
              {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://cookscape.in/blog"}
            ]
          })}
        </script>
      </Helmet>
      
      <header className="blog-header">
        <div className="container">
          <div className="blog-eyebrow">DESIGN INSIGHTS</div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="blog-main-title"
          >
            Our Design <span>Stories</span>
          </motion.h1>
          <p className="blog-intro">Insights, trends, and inspiration from the world of premium interiors.</p>
        </div>
      </header>

      {/* Featured Post Hero Banner */}
      {featuredBlog && currentPage === 1 && (
        <section className="blog-featured-section container">
          <motion.div 
            className="blog-featured-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="featured-image-container">
              <img 
                src={featuredBlog.image} 
                alt={featuredBlog.title} 
                onError={(e) => { e.target.onerror = null; e.target.src = '/blog-images/cookscape-blog-1.webp'; }}
              />
              <div className="featured-badge">FEATURED ARTICLE</div>
            </div>
            <div className="featured-content">
              <div className="featured-meta">
                <span className="featured-category">
                  {CATEGORIES.find(c => c.id === getBlogCategory(featuredBlog))?.name || 'Design'}
                </span>
                <span className="featured-dot">•</span>
                <span className="featured-read-time">5 MIN READ</span>
              </div>
              <h2 className="featured-title">{featuredBlog.title}</h2>
              <p className="featured-excerpt">{featuredBlog.excerpt}</p>
              
              <div className="featured-author-row">
                <div className="author-info">
                  <img 
                    className="author-avatar"
                    src={`/architects/cookscape--architect-${featuredBlog.author.toLowerCase().replace(' ', '-')}.webp`} 
                    alt={featuredBlog.author}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/logo.jpeg'; }}
                  />
                  <div className="author-text">
                    <span className="author-name">Architect {featuredBlog.author}</span>
                    <span className="author-role">Senior Interior Designer</span>
                  </div>
                </div>
                
                <Link to={`/blog/${featuredBlog.id}`} className="featured-cta-btn">
                  Explore Story
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Controls Bar: Search & Categories */}
      <section className="blog-controls-section container">
        <div className="blog-controls-wrapper">
          <div className="category-pills-container">
            <div className="category-pills">
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  className={`category-pill ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setCurrentPage(1);
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="blog-search-box">
            <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => { setSearchQuery(''); setCurrentPage(1); }}>
                &times;
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="blog-grid-section container">
        {currentGridBlogs.length > 0 ? (
          <div className="blog-grid">
            {currentGridBlogs.map((blog, index) => {
              const categoryObj = CATEGORIES.find(c => c.id === getBlogCategory(blog));
              return (
                <motion.div 
                  key={blog.id}
                  className="blog-card-v2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 3) * 0.05 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="blog-card-media">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      onError={(e) => { e.target.onerror = null; e.target.src = '/blog-images/cookscape-blog-1.webp'; }}
                    />
                    <div className="blog-card-badge">{categoryObj ? categoryObj.name.split(' ')[0] : 'Interiors'}</div>
                    <div className="blog-card-overlay-v2"></div>
                    
                    <div className="blog-author-float">
                      <img 
                        src={`/architects/cookscape--architect-${blog.author.toLowerCase().replace(' ', '-')}.webp`} 
                        alt={blog.author}
                        onError={(e) => { e.target.onerror = null; e.target.src = '/logo.jpeg'; }}
                      />
                    </div>
                  </div>

                  <div className="blog-card-body-v2">
                    <div className="blog-card-meta-v2">
                      <span className="author-name-v2">Architect {blog.author}</span>
                      <span className="read-time-v2">5 min read</span>
                    </div>
                    
                    <h2 className="blog-card-title-v2">{blog.title}</h2>
                    <p className="blog-card-excerpt-v2">
                      {blog.excerpt.length > 120 ? blog.excerpt.substring(0, 120) + '...' : blog.excerpt}
                    </p>
                    
                    <div className="blog-card-footer-v2">
                      <Link to={`/blog/${blog.id}`} className="read-more-link-v2">
                        Explore Story
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="blog-no-results">
            <h3>No design stories found</h3>
            <p>We couldn't find any articles matching your search query or filters. Try checking spelling or switching categories.</p>
            <button className="reset-filter-btn" onClick={() => { setSearchQuery(''); setActiveCategory('all'); setCurrentPage(1); }}>
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="blog-pagination-container">
          <div className="blog-pagination">
            <button 
              className="pagination-arrow" 
              onClick={() => {
                setCurrentPage(prev => Math.max(prev - 1, 1));
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Prev
            </button>
            
            <div className="pagination-numbers">
              {getPageNumbers().map((item, idx) => {
                if (item === 'ellipsis1' || item === 'ellipsis2') {
                  return <span key={`ellipsis-${idx}`} className="pagination-dots">...</span>;
                }
                return (
                  <button
                    key={item}
                    className={`pagination-number ${currentPage === item ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentPage(item);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            
            <button 
              className="pagination-arrow" 
              onClick={() => {
                setCurrentPage(prev => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
            >
              Next
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogIndex;

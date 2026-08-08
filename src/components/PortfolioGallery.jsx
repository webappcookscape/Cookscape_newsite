import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_COLLECTION } from '../data/siteData';

// Category icons mapping
const CATEGORY_ICONS = {
  'All': '◈',
  'Bedroom': '🛏',
  'Crockery unit': '🍽',
  'Foyer': '🚪',
  'Full home interiors': '🏠',
  'Home renovation': '🔨',
  'Kids Furniture': '🎨',
  'Laundry unit': '🧺',
  'Living Room': '🛋',
  'Modular kitchen': '🍳',
  'Pooja Unit': '🪔',
  'TV unit': '📺',
  'Wardrobe': '👗',
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
};

const PortfolioCard = ({ item, index, sizeClass, isHovered, onHoverStart, onHoverEnd, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.article
      className={`pf-card ${sizeClass}`}
      variants={cardVariants}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.title}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Image */}
      <div className="pf-card-media">
        {!isLoaded && <div className="pf-shimmer-loader" />}
        <motion.img
          src={item.url}
          alt={item.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0 }}
          animate={{ 
            scale: isHovered && isLoaded ? 1.08 : 1,
            opacity: isLoaded ? 1 : 0 
          }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        />
        {/* Gradient overlay */}
        <div className="pf-card-gradient" />
      </div>

      {/* Category badge */}
      <div className="pf-card-badge">
        {CATEGORY_ICONS[item.category] || '◈'} {item.category}
      </div>

      {/* Hover reveal content */}
      <motion.div
        className="pf-card-reveal"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 15 }}
        transition={{ duration: 0.35 }}
      >
        <h3 className="pf-card-title">{item.title}</h3>
        <div className="pf-card-cta">
          <span>Explore Design</span>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </motion.div>

      {/* Expand icon on hover */}
      <motion.div
        className="pf-expand-icon"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
        transition={{ duration: 0.25 }}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </motion.div>
    </motion.article>
  );
};

const PortfolioGallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);
  const filterRef = useRef(null);
  const location = useLocation();
  const [visibleCount, setVisibleCount] = useState(12);

  // Get unique categories with counts
  const categories = useMemo(() => {
    return ['All', ...new Set(GALLERY_COLLECTION.map(item => item.category))];
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');
    if (categoryParam) {
      const decodedParam = decodeURIComponent(categoryParam).toLowerCase();
      const matched = categories.find(
        (cat) => cat.toLowerCase() === decodedParam
      );
      if (matched) {
        setActiveCategory(matched);
        
        // Smooth scroll to the portfolio container
        setTimeout(() => {
          const galleryElement = document.querySelector('.portfolio-v2-root');
          if (galleryElement) {
            galleryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 40);
      }
    }
  }, [location.search, categories]);

  // Reset pagination count on category change
  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts = { All: GALLERY_COLLECTION.length };
    GALLERY_COLLECTION.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return activeCategory === 'All'
      ? GALLERY_COLLECTION
      : GALLERY_COLLECTION.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  // Paginated/displayed items
  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  // Lightbox navigation
  const openLightbox = useCallback((item, index) => {
    setSelectedImage(item);
    setSelectedIndex(index);
  }, []);

  const navigateLightbox = useCallback((dir) => {
    const newIndex = (selectedIndex + dir + filteredItems.length) % filteredItems.length;
    setSelectedIndex(newIndex);
    setSelectedImage(filteredItems[newIndex]);
  }, [selectedIndex, filteredItems]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedImage, navigateLightbox]);

  // Determine card size class
  const getCardSize = (index) => {
    // Create a pattern: large, small, small, medium, small, small, large...
    const pattern = index % 7;
    if (pattern === 0) return 'card-hero';
    if (pattern === 3) return 'card-wide';
    return 'card-std';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  return (
    <div className="portfolio-v2-root">

      {/* ── Premium Filter Bar ── */}
      <div className="pf-filter-bar">
        <div className="pf-filter-inner" ref={filterRef}>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              className={`pf-filter-btn ${activeCategory === cat ? 'pf-filter-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span className="pf-cat-icon">{CATEGORY_ICONS[cat] || '◈'}</span>
              <span className="pf-cat-name">{cat}</span>
              <span className="pf-cat-count">{categoryCounts[cat]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Results Bar ── */}
      <div className="pf-results-bar">
        <div className="pf-results-inner">
          <span className="pf-results-count">
            Showing <strong>{filteredItems.length}</strong> spaces
            {activeCategory !== 'All' && <> in <em>{activeCategory}</em></>}
          </span>
        </div>
      </div>

      {/* ── Main Editorial Grid ── */}
      <div className="pf-canvas">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="pf-editorial-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {displayedItems.map((item, index) => {
              const sizeClass = getCardSize(index);
              const isHovered = hoveredId === `${item.category}-${index}`;
              return (
                <PortfolioCard
                  key={`${item.category}-${index}`}
                  item={item}
                  index={index}
                  sizeClass={sizeClass}
                  isHovered={isHovered}
                  onHoverStart={() => setHoveredId(`${item.category}-${index}`)}
                  onHoverEnd={() => setHoveredId(null)}
                  onClick={() => openLightbox(item, index)}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Load More Button */}
        {visibleCount < filteredItems.length && (
          <div className="pf-load-more-wrap">
            <button className="btn-load-more-v2" onClick={() => setVisibleCount(prev => prev + 12)}>
              <span>Load More Designs</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ── Cinematic Lightbox ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="pf-lightbox-overlay"
            id="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedImage(null)}
          >
            {/* Counter */}
            <div className="pf-lb-counter">
              {selectedIndex + 1} / {filteredItems.length}
            </div>

            {/* Close */}
            <button
              className="pf-lb-close"
              onClick={() => setSelectedImage(null)}
              aria-label="Close lightbox"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Prev */}
            <button
              className="pf-lb-nav pf-lb-prev"
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
              aria-label="Previous image"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Image Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                className="pf-lb-panel"
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pf-lb-image-wrap">
                  <img src={selectedImage.url} alt={selectedImage.title} />
                </div>
                <div className="pf-lb-info">
                  <div className="pf-lb-category">
                    {CATEGORY_ICONS[selectedImage.category]} {selectedImage.category}
                  </div>
                  <h2 className="pf-lb-title">{selectedImage.title}</h2>
                  <p className="pf-lb-brand">Designed by Cookscape</p>
                  <div className="pf-lb-thumb-strip">
                    {filteredItems.slice(
                      Math.max(0, selectedIndex - 2),
                      Math.min(filteredItems.length, selectedIndex + 3)
                    ).map((t, i) => {
                      const absIdx = Math.max(0, selectedIndex - 2) + i;
                      return (
                        <button
                          key={absIdx}
                          className={`pf-lb-thumb ${absIdx === selectedIndex ? 'active' : ''}`}
                          onClick={() => { setSelectedIndex(absIdx); setSelectedImage(filteredItems[absIdx]); }}
                          aria-label={`Go to image ${absIdx + 1}`}
                        >
                          <img src={t.url} alt={t.title} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Next */}
            <button
              className="pf-lb-nav pf-lb-next"
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
              aria-label="Next image"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioGallery;

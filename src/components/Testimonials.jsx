import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TESTIMONIALS } from '../data/siteData';

const VideoModal = ({ isOpen, videoId, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="video-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="video-modal-container"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal-btn" onClick={onClose}>
              <span>Close</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <iframe 
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TestimonialCard = ({ testimonial, onClick }) => {
  // Use a unified, clean layout for all cards to keep UI consistent
  const cardTypeClass = "card-type-unified";

  return (
    <motion.div 
      className={`testimonial-card-premium ${cardTypeClass}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="video-thumb-container">
        <img 
          src={`https://img.youtube.com/vi/${testimonial.id}/hqdefault.jpg`} 
          alt={testimonial.name} 
          loading="lazy" 
          onError={(e) => { e.target.onerror = null; e.target.src = `https://img.youtube.com/vi/${testimonial.id}/0.jpg`; }}
        />
        <div className="play-btn-overlay">
          <div className="play-btn-circle">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="watch-story-tag">Watch Story</span>
        </div>
      </div>
      <div className="testimonial-content-block">
        <div className="testimonial-header-meta">
          <div className="stars-row">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="star-icon" viewBox="0 0 24 24" width="16" height="16" fill="#FFB800">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="verified-badge">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Verified Client
          </span>
        </div>
        <p className="testimonial-quote">"{testimonial.desc}"</p>
        <div className="testimonial-footer-meta">
          <h3 className="client-name">{testimonial.name}</h3>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [displayCount, setDisplayCount] = useState(6);

  const showMore = () => {
    setDisplayCount(prev => Math.min(prev + 6, TESTIMONIALS.length));
  };

  const showLess = () => {
    setDisplayCount(6);
  };

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="testimonials-focal-wrapper">
        
        {/* Section Header (Cleanly separated at the top) */}
        <div className="testimonials-section-header">
          <span className="testimonial-tag-pill">Testimonials</span>
          <h2 className="section-title">Loved by Families, <span className="highlight-text">Trusted by Homeowners</span></h2>
          <p className="section-subtitle">Real stories of home transformation from our happy clients across cities.</p>
        </div>

        {/* Responsive, Balanced Grid Layout */}
        <div className="testimonials-grid-premium">
          {TESTIMONIALS.slice(0, displayCount).map((item) => (
            <TestimonialCard 
              key={item.id} 
              testimonial={item} 
              onClick={() => setSelectedVideo(item.id)} 
            />
          ))}
        </div>

        {/* Dynamic Pagination Controls */}
        <div className="testimonials-actions">
          {displayCount < TESTIMONIALS.length ? (
            <button className="btn-primary-v3 show-more-btn" onClick={showMore}>
              Load More Stories
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ) : (
            TESTIMONIALS.length > 6 && (
              <button className="btn-secondary-v3 show-less-btn" onClick={showLess}>
                Show Less
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 15l7-7 7 7" />
                </svg>
              </button>
            )
          )}
        </div>

      </div>

      <VideoModal isOpen={!!selectedVideo} videoId={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </section>
  );
};

export default Testimonials;

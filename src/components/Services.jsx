import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useAnimationFrame, useTransform, useSpring } from 'framer-motion';
import { SERVICES } from '../data/siteData';

const MotionLink = motion.create(Link);

const ServiceMarqueeItem = ({ service, trackX }) => {
  const ref = useRef(null);
  const centerScale = useTransform(trackX, (latest) => {
    if (!ref.current) return 0.85;
    const rect = ref.current.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const distanceFromCenter = Math.abs(centerX - (rect.left + rect.width / 2));
    const maxDistance = window.innerWidth / 2;
    const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
    const curve = Math.cos(normalizedDistance * (Math.PI / 2));
    const intensity = Math.pow(curve, 2);
    return 0.85 + (1.1 - 0.85) * intensity;
  });

  const smoothScale = useSpring(centerScale, { stiffness: 300, damping: 40 });

  return (
    <MotionLink 
      ref={ref}
      to={`/portfolio?category=${encodeURIComponent(service.title.toLowerCase())}`}
      className="service-card-premium marquee-item-service"
      style={{ scale: smoothScale }}
      whileHover={{ }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="service-card-image-wrap">
        <img src={service.img} alt={service.title} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = '/hero-image.png'; }} />
        <div className="service-card-overlay-premium"></div>
      </div>
      <div className="service-card-content-premium">
        <h3 className="service-title-premium">{service.title}</h3>
        <div className="service-divider-premium"></div>
        <span className="service-explore-premium">Discover Designs</span>
      </div>
    </MotionLink>
  );
};

const MarqueeServices = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const baseVelocity = -1.0; 
  const baseX = useMotionValue(0);

  // Sync cardWidth with CSS
  const cardWidth = windowWidth < 768 ? 280 : 340; 
  const totalWidth = SERVICES.length * cardWidth;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useAnimationFrame((t, delta) => {
    if (!isPaused) {
      let moveBy = baseVelocity * (delta / 16);
      let nextX = baseX.get() + moveBy;
      if (nextX <= -totalWidth) nextX = 0;
      baseX.set(nextX);
    }
  });

  return (
    <div 
      className="marquee-wrapper services-marquee"
      onClick={() => setIsPaused(!isPaused)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <div className="marquee-mask left"></div>
      <div className="marquee-mask right"></div>
      
      {/* Animated Scroll Indicator for Mobile/Small Screens */}
      <div className="scroll-indicator-v2">
        <motion.div 
          animate={{ x: [-10, 10, -10] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="scroll-arrow"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.div>
        <span className="scroll-text">Explore Our Portfolio</span>
        <motion.div 
          animate={{ x: [10, -10, 10] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="scroll-arrow"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.div>
      </div>

      <motion.div className="marquee-track" style={{ x: baseX, gap: windowWidth < 768 ? '20px' : '40px' }}>
        {[...SERVICES, ...SERVICES, ...SERVICES].map((service, index) => (
          <ServiceMarqueeItem 
            key={index} 
            service={service}
            trackX={baseX}
          />
        ))}
      </motion.div>
    </div>
  );
};

const Services = () => {
  return (
    <section id="services" className="services-section">
      <div className="container" style={{ marginBottom: '40px' }}>
        <motion.div 
          className="section-header-v2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="section-title">Our <span>Services</span></h2>
          <p className="section-subtitle">Exquisite design solutions tailored for your lifestyle.</p>
        </motion.div>
      </div>
      <MarqueeServices />
    </section>
  );
};

export default Services;

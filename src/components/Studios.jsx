import React from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCE_CENTERS } from '../data/siteData';

const Studios = () => {
  return (
    <section id="studios" className="studios-section">
      <div className="container">
        <motion.div 
          className="section-header-v2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="about-tag-v3">VISIT OUR CENTERS</span>
          <h2 className="section-title">Our Experience <span>Studios</span></h2>
          <p className="section-subtitle">Cookscape Home Interiors, an exclusive Indian brand, meets all the functional challenges of Designs with its finest finish.</p>
        </motion.div>

        <div className="studios-grid">
          {EXPERIENCE_CENTERS.map((studio, idx) => (
            <motion.div 
              key={idx}
              className="studio-card-premium"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="studio-city-tag">{studio.city}</div>
              <h3 className="studio-name">{studio.name}</h3>
              <div className="studio-divider"></div>
              <p className="studio-address">{studio.address}</p>
           
              
            </motion.div>
          ))}
        </div>
        
        <div className="studios-footer-cta">
          <p>If you have any question or need help, feel free to contact with our team.</p>
          <a href="tel:+919600005679" className="btn-primary-v3">Call +91 96000 05679</a>
        </div>
      </div>
    </section>
  );
};

export default Studios;

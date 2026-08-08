import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="about-section-premium">
      <div className="container">
        <div className="about-grid-premium">
          <motion.div 
            className="about-content-v3"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="about-tag-v3">WELCOME TO COOKSCAPE</span>
            <h2 className="about-title-v3">One Stop Solution Provider</h2>
            <p className="about-desc-v3">
              We are the <strong>Largest Home Interiors Store in Chennai with 25 years of Expertise</strong>. 
              With our interior design services, you will be able to create a unique and creative space 
              for your home. No other company offers a guarantee.
            </p>
            <p className="about-cta-text-v3">Let us help you design a luxurious home.</p>
            
            <div className="about-contact-box-v3">
              <div className="contact-icon-v3">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.72 11.72 0 003.7.59 1 1 0 011 1V20a1 1 0 01-1 1A16 16 0 013 5a1 1 0 011-1h3.41a1 1 0 011 1 11.72 11.72 0 00.59 3.7 1 1 0 01-.27 1.11l-2.2 2.2z"/>
                </svg>
              </div>
              <div className="contact-info-v3">
                <span>Call Now :</span>
                <a href="tel:+919600005679">+91 96000 05679</a>
              </div>
            </div>

            <div className="about-btns-v3">
              <a href="#services" className="btn-primary-v3">Get Services</a>
              <a href="#contact" className="btn-secondary-v3">Book Consultation</a>
            </div>
          </motion.div>

          <motion.div 
            className="about-visual-v3"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="blob-container-v3">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="about-blob-svg-v3">
                <defs>
                  <clipPath id="blob-clip-v3">
                    <path d="M39.7,-58C50.6,-46.8,57.8,-34,63.9,-19.7C70,-5.4,74.9,10.3,73.6,26.8C72.2,43.4,64.5,60.8,51.2,67.9C37.9,75.1,18.9,72,2.1,69.1C-14.8,66.2,-29.6,63.7,-42.2,56.3C-54.8,48.9,-65.2,36.7,-72.7,21.7C-80.1,6.7,-84.6,-11.1,-79.9,-26.1C-75.2,-41,-61.3,-53.1,-46.4,-63C-31.6,-72.9,-15.8,-80.6,-0.7,-79.7C14.5,-78.7,28.9,-69.2,39.7,-58Z" transform="translate(100 100)" />
                  </clipPath>
                </defs>
                <foreignObject x="0" y="0" width="200" height="200" clipPath="url(#blob-clip-v3)">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    preload="metadata"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  >
                    <source src="/about-video.mp4" type="video/mp4" />
                  </video>
                </foreignObject>
              </svg>
              {/* Decorative background blob */}
              <div className="blob-bg-decoration"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="footer-premium">
      <div className="footer-top-accent"></div>
      <div className="container">
        <div className="footer-main-grid">
          {/* Brand Column */}
          <motion.div 
            className="footer-brand-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <img src="/logo.jpeg" alt="Cookscape" className="footer-brand-logo" loading="lazy" />
            <p className="footer-tagline">
              Transforming spaces into luxury experiences for over 25 years. Chennai's most trusted interior design partner.
            </p>
            <div className="footer-social-row">
              <a href="https://www.facebook.com/cookscape/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/cookscape_interior/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/cookscape/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="footer-links-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4>Navigation</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#about">About</a></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div 
            className="footer-links-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4>Expertise</h4>
            <ul>
              <li><Link to="/portfolio?category=modular%20kitchen">Modular Kitchen</Link></li>
              <li><Link to="/portfolio?category=full%20home%20interiors">Full Home Interiors</Link></li>
              <li><Link to="/portfolio?category=home%20renovation">Home Renovation</Link></li>
              <li><Link to="/portfolio?category=wardrobe">Wardrobes</Link></li>
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div 
            className="footer-contact-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4>Get In Touch</h4>
            <p>Chennai, Tamil Nadu, India</p>
            <a href="tel:+919600005679" className="footer-phone-link">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.79 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 013.33 2h3a2 2 0 012 1.72 12.81 12.81 0 00.59 2.81 2 2 0 01-.45 2.11L7.09 10.12a16 16 0 006.79 6.79l1.48-1.48a2 2 0 012.11-.45 12.81 12.81 0 002.81.59A2 2 0 0122 16.92z" />
              </svg>
              +91 96000 05679
            </a>
            <p className="footer-email-text">contact@cookscape.in</p>

            <div className="footer-map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.150044909521!2d80.2322999!3d13.0261154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267851192d819%3A0x678b29ed166574ee!2sCookscape%20Studio%20-%20Experience%20Center!5e0!3m2!1sen!2sin!4v1779194860462!5m2!1sen!2sin"
                width="100%"
                height="160"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Cookscape Studio Location"
              />
            </div>

            <a 
              href="https://wa.me/919677081181?text=Hi%20Cookscape%2C%20I%20am%20interested%20in%20designing%20my%20dream%20home%21%20Can%20we%20discuss%20the%20process%3F" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-whatsapp-btn"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>&copy; {new Date().getFullYear()} Cookscape Interiors. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

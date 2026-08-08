import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <section id="contact" className="contact-premium-section">
      <div className="container">
        <motion.div 
          className="contact-wrapper"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="contact-info-side">
            <span className="contact-eyebrow">GET IN TOUCH</span>
            <h2 className="contact-heading">Start Your <em>Design Journey</em></h2>
            <p className="contact-subtext">
              Ready to transform your space? Get a free consultation and let our experts craft a design that's uniquely yours.
            </p>
            <div className="contact-details-list">
              <div className="contact-detail-item">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.79 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 013.33 2h3a2 2 0 012 1.72 12.81 12.81 0 00.59 2.81 2 2 0 01-.45 2.11L7.09 10.12a16 16 0 006.79 6.79l1.48-1.48a2 2 0 012.11-.45 12.81 12.81 0 002.81.59A2 2 0 0122 16.92z" />
                </svg>
                <a href="tel:+919600005679">+91 96000 05679</a>
              </div>
              <div className="contact-detail-item">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>contact@cookscape.in</span>
              </div>
            </div>
          </div>

          <div className="contact-form-side">
            <form className="premium-contact-form">
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="contact-name">Full Name</label>
                  <input type="text" id="contact-name" placeholder="John Doe" />
                </div>
                <div className="form-field">
                  <label htmlFor="contact-email">Email</label>
                  <input type="email" id="contact-email" placeholder="john@example.com" />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="contact-phone">Phone Number</label>
                <input type="tel" id="contact-phone" placeholder="+91 98765 43210" />
              </div>
              <div className="form-field">
                <label htmlFor="contact-message">Your Project Details</label>
                <textarea id="contact-message" rows="4" placeholder="Tell us about your dream space..." />
              </div>
              <button type="submit" className="contact-submit-btn">
                Send Message
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;

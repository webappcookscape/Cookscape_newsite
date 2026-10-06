import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackLeadConversion } from '../utils/analytics';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    houseType: 'Apartment',
    bhk: '3 BHK',
    message: ''
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    const field = id.replace('contact-', '');
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    let phone = formData.phone.trim().replace(/[\s\-\(\)]/g, '');
    const location = formData.location ? formData.location.trim() : '';
    const houseType = formData.houseType || 'Apartment';
    const bhk = formData.bhk || '3 BHK';

    // Normalize phone numbers (stripping leading country code)
    if (phone.startsWith('+91')) {
      phone = phone.substring(3);
    } else if (phone.startsWith('91') && phone.length === 12) {
      phone = phone.substring(2);
    } else if (phone.startsWith('0') && phone.length === 11) {
      phone = phone.substring(1);
    }

    // Validation
    if (!name || name.length < 2) {
      setErrorMessage('Please enter your full name (at least 2 letters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!location || location.length < 2) {
      setErrorMessage('Please enter your city / location (e.g., Chennai).');
      return;
    }

    setStatus('submitting');

    const payload = {
      name,
      email,
      phone,
      location,
      houseType,
      bhk,
      message: `${formData.message ? formData.message.trim() + '\n\n' : ''}Location: ${location} | Property: ${houseType} | BHK: ${bhk}`,
      source: 'Website Consultation Form'
    };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to submit enquiry. Please try again.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', location: '', houseType: 'Apartment', bhk: '3 BHK', message: '' });

      // Track Lead conversion across Google Ads (with Enhanced Conversions) and Meta Pixel
      trackLeadConversion({
        name,
        email,
        phone,
        location,
        houseType,
        bhk,
        source: 'Website Consultation Form'
      });
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus('error');
      setErrorMessage(
        err.message || 'Could not send enquiry via server. Please contact us directly via WhatsApp or Call.'
      );
    }
  };

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
                <a href="mailto:contact@cookscape.in">contact@cookscape.in</a>
              </div>
            </div>
          </div>

          <div className="contact-form-side">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding: '30px',
                    textAlign: 'center',
                    background: 'rgba(37, 211, 102, 0.08)',
                    borderRadius: '16px',
                    border: '1px solid rgba(37, 211, 102, 0.3)'
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#25d366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    color: '#fff'
                  }}>
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: '#111', marginBottom: '10px', fontWeight: 700 }}>
                    Consultation Request Received!
                  </h3>
                  <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px' }}>
                    Thank you for reaching out to Cookscape. Our interior design expert has received your details and will get in touch with you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ name: '', email: '', phone: '', message: '' });
                      setErrorMessage('');
                      setStatus('idle');
                    }}
                    style={{
                      background: '#1a1a1a',
                      color: '#fff',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '100px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  className="premium-contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: '12px 16px',
                        background: '#fdf2f2',
                        borderLeft: '4px solid #b81c22',
                        borderRadius: '8px',
                        color: '#b81c22',
                        fontSize: '0.9rem',
                        lineHeight: '1.5'
                      }}
                    >
                      <strong>Note: </strong>{errorMessage}
                    </motion.div>
                  )}

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="contact-name">Full Name *</label>
                      <input 
                        type="text" 
                        id="contact-name" 
                        placeholder="John Doe" 
                        required
                        value={formData.name}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="contact-email">Email Address *</label>
                      <input 
                        type="email" 
                        id="contact-email" 
                        placeholder="john@example.com" 
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="contact-phone">Mobile Number *</label>
                      <input 
                        type="tel" 
                        id="contact-phone" 
                        placeholder="+91 98765 43210" 
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="contact-location">Location / City *</label>
                      <input 
                        type="text" 
                        id="contact-location" 
                        placeholder="e.g. Chennai" 
                        required
                        value={formData.location}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                      />
                    </div>
                  </div>

                  {/* Type of House Selection */}
                  <div className="form-field">
                    <label>Type of House *</label>
                    <div className="festive-pill-group">
                      {['Apartment', 'Individual House'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={`festive-pill-btn ${formData.houseType === type ? 'active' : ''}`}
                          onClick={() => setFormData((prev) => ({ ...prev, houseType: type }))}
                          disabled={status === 'submitting'}
                        >
                          {type === 'Apartment' ? '🏢 Apartment' : '🏡 Individual House'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* BHK Requirement Selection */}
                  <div className="form-field">
                    <label>BHK Requirement *</label>
                    <div className="festive-pill-group bhk-grid">
                      {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map((bhkOption) => (
                        <button
                          key={bhkOption}
                          type="button"
                          className={`festive-pill-btn ${formData.bhk === bhkOption ? 'active' : ''}`}
                          onClick={() => setFormData((prev) => ({ ...prev, bhk: bhkOption }))}
                          disabled={status === 'submitting'}
                        >
                          {bhkOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-message">Project Details</label>
                    <textarea 
                      id="contact-message" 
                      rows="4" 
                      placeholder="Tell us about your space (e.g., 3BHK Modular Kitchen & Wardrobes in Chennai)..." 
                      value={formData.message}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="contact-submit-btn"
                    disabled={status === 'submitting'}
                    style={{ opacity: status === 'submitting' ? 0.7 : 1, cursor: status === 'submitting' ? 'not-allowed' : 'pointer' }}
                  >
                    {status === 'submitting' ? (
                      <>
                        Sending Enquiry...
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }} />
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { trackLeadConversion } from '../utils/analytics';

const OfferModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    houseType: 'Apartment',
    bhk: '3 BHK'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  const timerRef = useRef(null);

  // Helper to schedule the popup after delayMs if user hasn't submitted yet
  const schedulePopup = (delayMs = 20000) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Bypass check if testing with ?popup=true in URL
    const isTestMode = window.location.search.includes('popup=true');
    const hasSubmitted =
      localStorage.getItem('hasSubmittedOfferModal') ||
      localStorage.getItem('hasSubmittedFestiveModal');

    if (!isTestMode && hasSubmitted === 'true') {
      console.log('📢 [OfferPopup] Suppressed because you previously submitted the form. Type window.resetOfferPopup() in console or add ?popup=true to URL to test.');
      return;
    }

    console.log(`⏱️ [OfferPopup] Scheduled to appear in ${delayMs / 1000} seconds...`);

    timerRef.current = setTimeout(() => {
      const stillNotSubmitted =
        localStorage.getItem('hasSubmittedOfferModal') ||
        localStorage.getItem('hasSubmittedFestiveModal');
      if (isTestMode || stillNotSubmitted !== 'true') {
        console.log('🎉 [OfferPopup] Opening modal now.');
        setIsOpen(true);
      }
    }, isTestMode ? 1000 : delayMs);
  };

  // Initial appearance after 20 seconds
  useEffect(() => {
    schedulePopup(20000);

    // Helper exposed on window for developer testing
    window.resetOfferPopup = () => {
      localStorage.removeItem('hasSubmittedOfferModal');
      localStorage.removeItem('hasSubmittedFestiveModal');
      console.log('✓ [OfferPopup] Reset. Opening now...');
      setIsOpen(true);
    };
    window.resetFestivePopup = window.resetOfferPopup;

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Listen for custom trigger event to open the modal programmatically
  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-offer-modal', handleOpenModal);
    window.addEventListener('open-festive-modal', handleOpenModal);
    return () => {
      window.removeEventListener('open-offer-modal', handleOpenModal);
      window.removeEventListener('open-festive-modal', handleOpenModal);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setErrorMessage('');
    // Re-schedule for another reminder after 45 seconds if user didn't submit
    const hasSubmitted =
      localStorage.getItem('hasSubmittedOfferModal') ||
      localStorage.getItem('hasSubmittedFestiveModal');
    if (hasSubmitted !== 'true') {
      schedulePopup(45000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (errorMessage) setErrorMessage('');
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.location) {
      setErrorMessage('Please fill in all details including your location.');
      return;
    }

    // Form input validation for real vs dummy/invalid data
    const nameTrimmed = formData.name.trim();
    const phoneTrimmed = formData.phone.trim();
    const emailTrimmed = formData.email.trim().toLowerCase();
    const locationTrimmed = formData.location.trim();
    const houseType = formData.houseType || 'Apartment';
    const bhk = formData.bhk || '3 BHK';

    // 1. Name checks
    if (nameTrimmed.length < 2) {
      setErrorMessage('Name must be at least 2 characters long.');
      return;
    }
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(nameTrimmed)) {
      setErrorMessage('Name should contain only letters and spaces.');
      return;
    }
    const dummyNames = ['test', 'asdf', 'admin', 'user', 'dummy', 'abc', 'xyz', 'qwer'];
    if (dummyNames.includes(nameTrimmed.toLowerCase())) {
      setErrorMessage('Please enter a valid, real name.');
      return;
    }

    // 2. Mobile Number checks
    let rawPhone = phoneTrimmed.replace(/[\s\-\(\)]/g, '');
    if (rawPhone.startsWith('+91')) {
      rawPhone = rawPhone.substring(3);
    } else if (rawPhone.startsWith('91') && rawPhone.length === 12) {
      rawPhone = rawPhone.substring(2);
    } else if (rawPhone.startsWith('0') && rawPhone.length === 11) {
      rawPhone = rawPhone.substring(1);
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(rawPhone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    const repeatingPatterns = [
      '0000000000', '1111111111', '2222222222', '3333333333', '4444444444',
      '5555555555', '6666666666', '7777777777', '8888888888', '9999999999',
      '1234567890', '0987654321', '9876543210'
    ];
    if (repeatingPatterns.includes(rawPhone)) {
      setErrorMessage('Please enter a valid mobile number (avoid sequential/repeated digits).');
      return;
    }

    // 3. Email checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    const dummyEmails = ['test@test.com', 'test@gmail.com', 'dummy@gmail.com', 'abc@gmail.com', 'asdf@asdf.com', 'admin@gmail.com'];
    const dummyDomains = ['example.com', 'test.com', 'dummy.com', 'tempmail.com', 'mailinator.com'];
    const domain = emailTrimmed.split('@')[1];
    if (dummyEmails.includes(emailTrimmed) || dummyDomains.includes(domain)) {
      setErrorMessage('Please use a valid non-dummy email address.');
      return;
    }

    // 4. Location checks
    if (locationTrimmed.length < 2) {
      setErrorMessage('Please enter your location/city (e.g. Chennai).');
      return;
    }
    
    // Clear any pending timers forever
    if (timerRef.current) clearTimeout(timerRef.current);
    localStorage.setItem('hasSubmittedOfferModal', 'true');

    setIsSubmitting(true);
    setErrorMessage('');

    const payload = {
      name: nameTrimmed,
      phone: rawPhone,
      email: emailTrimmed,
      location: locationTrimmed,
      houseType: houseType,
      bhk: bhk,
      message: `Special Offer - Flat 20% OFF Unlock Request | Location: ${locationTrimmed} | Property: ${houseType} | BHK: ${bhk}`,
      source: 'Exclusive Offer Pop-up'
    };

    // Send lead info directly to Node.js backend endpoint
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Lead submission error:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', phone: '', email: '', location: '', houseType: 'Apartment', bhk: '3 BHK' });

      // Track Lead conversion across Google Ads (with Enhanced Conversions) and Meta Pixel
      trackLeadConversion({
        name: nameTrimmed,
        phone: rawPhone,
        email: emailTrimmed,
        location: locationTrimmed,
        houseType: houseType,
        bhk: bhk,
        source: 'Exclusive Offer Pop-up'
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="festive-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="festive-modal-card"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              className="festive-modal-close"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Premium Gold Top Strip */}
            <div className="festive-decor-top"></div>

            <div className="festive-modal-body">
              {isSubmitted ? (
                <div className="festive-modal-body festive-success-body">
                  <div className="success-icon-wrapper">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="festive-title">Congratulations!</h2>
                  <p className="festive-success-msg">
                    Your Flat 20% OFF offer voucher has been unlocked.
                  </p>
                  <p className="festive-success-sub">
                    One of our luxury design experts will contact you shortly to plan your dream space.
                  </p>
                  <button className="festive-submit-btn" onClick={handleClose} style={{ marginTop: '2rem' }}>
                    EXPLORE DESIGNS
                  </button>
                </div>
              ) : (
                <>
                  <div className="festive-badge">LIMITED TIME EXCLUSIVE OFFER</div>
                  <h2 className="festive-title">COOKSCAPE EXCLUSIVE OFFER</h2>
                  <h3 className="festive-discount">Flat 20% OFF</h3>
                  <p className="festive-tagline">on luxury interiors</p>
                  
                  <div className="festive-divider"></div>
                  <p className="festive-subtitle">Fill details to unlock your exclusive offer</p>

                  {errorMessage && <p className="festive-error-msg">{errorMessage}</p>}

                  <form onSubmit={handleSubmit} className="festive-form">
                    <div className="festive-input-group">
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your name *"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="festive-input-group">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter Mobile No *"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="festive-input-group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email *"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="festive-input-group">
                      <input
                        type="text"
                        name="location"
                        placeholder="Enter Location / City (e.g. Chennai) *"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* House Type Selection */}
                    <div className="festive-choice-section">
                      <label className="festive-choice-label">Type of House *</label>
                      <div className="festive-pill-group">
                        {['Apartment', 'Individual House'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`festive-pill-btn ${formData.houseType === type ? 'active' : ''}`}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, houseType: type }));
                              if (errorMessage) setErrorMessage('');
                            }}
                            disabled={isSubmitting}
                          >
                            {type === 'Apartment' ? '🏢 Apartment' : '🏡 Individual House'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* BHK Type Selection */}
                    <div className="festive-choice-section">
                      <label className="festive-choice-label">BHK Requirement *</label>
                      <div className="festive-pill-group bhk-grid">
                        {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map((bhkOption) => (
                          <button
                            key={bhkOption}
                            type="button"
                            className={`festive-pill-btn ${formData.bhk === bhkOption ? 'active' : ''}`}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, bhk: bhkOption }));
                              if (errorMessage) setErrorMessage('');
                            }}
                            disabled={isSubmitting}
                          >
                            {bhkOption}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="festive-checkbox-group">
                      <input
                        type="checkbox"
                        id="offer-agree-checkbox"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                        required
                        disabled={isSubmitting}
                      />
                      <label htmlFor="offer-agree-checkbox" className="festive-policy-text">
                        I agree to Cookscape’s{' '}
                        <Link to="/terms" onClick={handleClose}>
                          Terms of Use
                        </Link>{' '}
                        &{' '}
                        <Link to="/privacy" onClick={handleClose}>
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      className="festive-submit-btn" 
                      disabled={!isAgreed || isSubmitting}
                      style={{ opacity: isSubmitting ? 0.7 : 1 }}
                    >
                      {isSubmitting ? 'UNLOCKING...' : 'CLAIM 20% OFF NOW'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfferModal;

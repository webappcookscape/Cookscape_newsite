import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const FestiveOfferModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  // Open modal after 5 seconds initially, then every 30 seconds if not submitted
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      const hasSubmitted = localStorage.getItem('hasSubmittedFestiveModal');
      if (!hasSubmitted) {
        setIsOpen((prev) => (!prev ? true : prev));
      }
    }, 5000);

    const intervalTimer = setInterval(() => {
      const hasSubmitted = localStorage.getItem('hasSubmittedFestiveModal');
      if (!hasSubmitted) {
        setIsOpen((prev) => (!prev ? true : prev));
      }
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  // Listen for custom trigger event to open the modal programmatically
  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-festive-modal', handleOpenModal);
    return () => window.removeEventListener('open-festive-modal', handleOpenModal);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setErrorMessage('Please fill in all details.');
      return;
    }

    // Form input validation for real vs dummy/invalid data
    const nameTrimmed = formData.name.trim();
    const phoneTrimmed = formData.phone.trim();
    const emailTrimmed = formData.email.trim().toLowerCase();

    // 1. Name checks (length, alphabet only, common dummies)
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

    // 2. Mobile Number checks (normalize, validate 10-digit Indian pattern, common dummies)
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

    // 3. Email checks (RFC format compliance, block dummy domains)
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
    
    setIsSubmitted(true);
    setErrorMessage('');
    localStorage.setItem('hasSubmittedFestiveModal', 'true');
    
    // Send lead info to local Express SMTP server on port 6000
    const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:6000' : '';
    
    fetch(`${backendUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to send email via backend.');
      }
      return response.json();
    })
    .then(data => {
      console.log('Lead email sent successfully:', data);
    })
    .catch(err => {
      console.error('SMTP backend submission error:', err);
    });
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
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button className="festive-modal-close" onClick={handleClose} aria-label="Close modal">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Decorative Gold Festive Arc */}
            <div className="festive-decor-top"></div>

            {!isSubmitted ? (
              <div className="festive-modal-body">
                <div className="festive-badge">FESTIVE PROMO</div>
                <h2 className="festive-title">COOKSCAPE FESTIVE OFFER</h2>
                <h3 className="festive-discount">Flat 20% OFF</h3>
                <p className="festive-tagline">on interiors</p>
                
                <div className="festive-divider"></div>
                <p className="festive-subtitle">Fill details to unlock your offer</p>

                {errorMessage && <p className="festive-error-msg">{errorMessage}</p>}

                <form onSubmit={handleSubmit} className="festive-form">
                  <div className="festive-input-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="festive-input-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter Mobile No"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="festive-input-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="festive-checkbox-group">
                    <input
                      type="checkbox"
                      id="festive-agree-checkbox"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      required
                    />
                    <label htmlFor="festive-agree-checkbox" className="festive-policy-text">
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

                  <button type="submit" className="festive-submit-btn" disabled={!isAgreed}>
                    CONTINUE
                  </button>
                </form>
              </div>
            ) : (
              <div className="festive-modal-body festive-success-body">
                <div className="success-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="festive-title">Congratulations!</h2>
                <p className="festive-success-msg">
                  Your Flat 20% OFF offer has been unlocked.
                </p>
                <p className="festive-success-sub">
                  One of our luxury design experts will contact you shortly to plan your dream space.
                </p>
                <button className="festive-submit-btn" onClick={handleClose} style={{ marginTop: '2rem' }}>
                  EXPLORE DESIGNS
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FestiveOfferModal;

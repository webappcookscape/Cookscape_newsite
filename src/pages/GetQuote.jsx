import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FiPhoneCall,
  FiMessageSquare,
  FiStar,
  FiShield,
  FiClock,
  FiAward,
  FiCheck,
  FiArrowRight,
  FiCopy
} from 'react-icons/fi';
import { trackLeadConversion } from '../utils/analytics';
import './GetQuote.css';

const BHK_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];
const PROPERTY_TYPES = ['Apartment', 'Individual House', 'Villa', 'Other'];
const PROPERTY_STATUSES = ['Ready to Occupy', 'Under Construction', 'Planning Stage'];

const INTERIOR_OPTIONS = [
  'Complete Home Interiors',
  'Modular Kitchen',
  'Wardrobes & Bedroom Interiors',
  'Living Room & TV Unit',
  'False Ceiling & Lighting',
  'Other Interior Requirements',
];

const BUDGET_OPTIONS = [
  'Below ₹3 Lakhs',
  '₹3–5 Lakhs',
  '₹5–10 Lakhs',
  '₹10–15 Lakhs',
  '₹15–20 Lakhs',
  'Flexible budget — up to ₹20 Lakhs',
];

const TIMELINE_OPTIONS = [
  'Immediately',
  'Within 1 month',
  '1–3 months',
  '3–6 months',
  'After 6 months',
];

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  phone: '',
  bhk: '3 BHK',
  propertyType: 'Apartment',
  propertyStatus: 'Ready to Occupy',
  city: '',
  state: 'Tamil Nadu',
  interiors: ['Complete Home Interiors'],
  budget: '₹5–10 Lakhs',
  timeline: 'Within 1 month',
  company_website_url: '', // Honeypot field
};

const GetQuote = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [status, setStatus] = useState('idle');
  const [copied, setCopied] = useState(false);

  const formatEnquiryDetails = (data = formData) => {
    return [
      `1. Contact Details`,
      `Full Name: ${data.name || '-'}`,
      `Email Address: ${data.email || '-'}`,
      `Phone Number: ${data.phone || '-'}`,
      ``,
      `2. Property Details`,
      `How many BHK?: ${data.bhk || '-'}`,
      `Property Type: ${data.propertyType || '-'}`,
      `Property Status: ${data.propertyStatus || '-'}`,
      `City: ${data.city || '-'}`,
      `State: ${data.state || '-'}`,
      ``,
      `3. Interior Requirements`,
      `What interiors do you need?: ${
        Array.isArray(data.interiors) && data.interiors.length > 0
          ? data.interiors.join(', ')
          : '-'
      }`,
      `Budget: ${data.budget || '-'}`,
      `Expected Project Start Timeline: ${data.timeline || '-'}`,
    ].join('\n');
  };

  const handleCopyDetails = async (dataToCopy = formData) => {
    const text = formatEnquiryDetails(dataToCopy);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errorMsg) setErrorMsg('');
  };

  const toggleInteriorOption = (option) => {
    setFormData((prev) => {
      const exists = prev.interiors.includes(option);
      const updated = exists
        ? prev.interiors.filter((item) => item !== option)
        : [...prev.interiors, option];
      return { ...prev, interiors: updated };
    });
    if (fieldErrors.interiors) {
      setFieldErrors((prev) => ({ ...prev, interiors: '' }));
    }
    if (errorMsg) setErrorMsg('');
  };

  const normalizePhone = (raw) => {
    let cleaned = (raw || '').trim().replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith('+91')) {
      cleaned = cleaned.substring(3);
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = cleaned.substring(1);
    }
    return cleaned;
  };

  const validateForm = () => {
    const errors = {};
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = normalizePhone(formData.phone);
    const city = formData.city.trim();
    const state = formData.state.trim();

    if (!name || name.length < 2) {
      errors.name = 'Please enter your full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.bhk) {
      errors.bhk = 'Please select how many BHK.';
    }

    if (!formData.propertyType) {
      errors.propertyType = 'Please select your property type.';
    }

    if (!formData.propertyStatus) {
      errors.propertyStatus = 'Please select your property status.';
    }

    if (!city || city.length < 2) {
      errors.city = 'Please enter your city.';
    }

    if (!state || state.length < 2) {
      errors.state = 'Please enter your state.';
    }

    if (!formData.interiors || formData.interiors.length === 0) {
      errors.interiors = 'Please select at least one interior requirement.';
    }

    if (!formData.budget) {
      errors.budget = 'Please select your budget range.';
    }

    if (!formData.timeline) {
      errors.timeline = 'Please select your expected project start timeline.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) {
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }

    setStatus('submitting');

    const normalizedPhone = normalizePhone(formData.phone);
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: normalizedPhone,
      bhk: formData.bhk,
      propertyType: formData.propertyType,
      propertyStatus: formData.propertyStatus,
      city: formData.city.trim(),
      state: formData.state.trim(),
      location: `${formData.city.trim()}, ${formData.state.trim()}`,
      houseType: formData.propertyType,
      interiors: formData.interiors,
      budget: formData.budget,
      timeline: formData.timeline,
      message: formatEnquiryDetails({
        ...formData,
        phone: normalizedPhone,
      }),
      source: 'Google Ads Quote Landing Page',
      honeypot: formData.company_website_url || '',
    };

    try {
      let response = await fetch('/api/get-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok && response.status === 404) {
        try {
          response = await fetch('http://localhost:5005/api/get-quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch {
          response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.details || data.error || 'Failed to submit quote enquiry. Please try again.'
        );
      }

      const quoteId = data.quoteId || `CS-QT-${Math.floor(100000 + Math.random() * 900000)}`;

      // Track Google Ads & Meta Pixel Lead Conversion
      trackLeadConversion({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        location: payload.location,
        houseType: payload.propertyType,
        bhk: payload.bhk,
        source: 'Google Ads Quote Landing Page',
      });

      setStatus('idle');

      // Navigate to dedicated Thank You Page with quote details in state
      navigate('/thank-you', {
        state: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          quoteId,
          bhk: payload.bhk,
          propertyType: payload.propertyType,
          city: payload.city,
        },
      });
    } catch (err) {
      console.error('Get Quote submission error:', err);
      setStatus('error');
      setErrorMsg(
        err.message ||
          'Could not send quote enquiry via server. You can also contact us directly at +91 96000 05679.'
      );
    }
  };

  const mailtoFallback = `mailto:mail.cookscape.leads@gmail.com?subject=${encodeURIComponent(
    `New Quote Enquiry: ${formData.name || 'Client'} - ${formData.bhk} ${formData.propertyType}`
  )}&body=${encodeURIComponent(formatEnquiryDetails())}`;

  return (
    <main className="get-quote-page">
      <Helmet>
        <title>Get a Free Interior Design Quote | Cookscape Interiors Chennai</title>
        <meta
          name="description"
          content="Get a personalized 3D design and transparent price quote for your home interior from Cookscape. 25+ years expertise, 10-year warranty, 45-day handover."
        />
        <link rel="canonical" href="https://cookscape.in/get-quote" />
      </Helmet>

      {/* Top Conversion Bar: Rating + Instant Call/WhatsApp CTA */}
      <div className="landing-top-bar">
        <div className="landing-top-container">
          <div className="top-trust-badge">
            <span className="stars"><FiStar /><FiStar /><FiStar /><FiStar /><FiStar /></span>
            <strong>4.8/5 on Google</strong>
            <span className="reviews">(500+ Homes Transformed)</span>
          </div>
          <div className="top-quick-actions">
            <span className="talk-text">Prefer to talk directly?</span>
            <a href="tel:+919600005679" className="action-pill call">
              <FiPhoneCall /> +91 96000 05679
            </a>
            <a
              href="https://wa.me/919677081181?text=Hi%20Cookscape%2C%20I%20am%20looking%20for%20an%20interior%20quote%20for%20my%20home!"
              target="_blank"
              rel="noopener noreferrer"
              className="action-pill whatsapp"
            >
              <FiMessageSquare /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <section className="get-quote-container">
        <motion.div
          className="get-quote-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {/* Form Introduction Header */}
          <div className="quote-intro-banner">
            <div className="quote-intro-glow"></div>
            <div className="quote-intro-inner">
              <div className="quote-intro-top">
                <img
                  src={`${import.meta.env.BASE_URL}logo.jpeg`}
                  alt="Cookscape Interiors"
                  className="quote-intro-logo"
                />
                <span className="quote-intro-badge">FREE ESTIMATE & 3D CONSULTATION</span>
              </div>

              <h1 className="quote-intro-title">
                Get a Free Estimate for Your <em>Dream Home Interiors</em>
              </h1>
              <p className="quote-intro-subtitle">
                Share your property requirements in 60 seconds. Our senior interior designers will prepare an itemized quote, customized 3D layout, and material recommendations.
              </p>

              {/* Trust Badges */}
              <div className="quote-intro-highlights">
                <div className="quote-highlight-pill">
                  <FiAward className="pill-icon" />
                  <span>25+ Years of Design Trust</span>
                </div>
                <div className="quote-highlight-pill">
                  <FiShield className="pill-icon" />
                  <span>10-Year Material Warranty</span>
                </div>
                <div className="quote-highlight-pill">
                  <FiClock className="pill-icon" />
                  <span>45-Day Move-in Guarantee</span>
                </div>
                <div className="quote-highlight-pill">
                  <FiCheck className="pill-icon" />
                  <span>Zero Hidden Costs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Strip: Real Design Work Highlights */}
          <div className="proof-strip">
            <div className="proof-header">
              <span className="proof-title">Recent Handcrafted Cookscape Spaces</span>
              <span className="proof-sub">Modular Kitchens • Master Bedrooms • Luxury Living • Wardrobes</span>
            </div>
            <div className="proof-gallery-grid">
              <div className="proof-item">
                <img src="/services/kitchen.png" alt="Modular Kitchen" loading="lazy" />
                <span>Modular Kitchens</span>
              </div>
              <div className="proof-item">
                <img src="/services/bedroom.png" alt="Master Bedroom" loading="lazy" />
                <span>Luxury Bedrooms</span>
              </div>
              <div className="proof-item">
                <img src="/RENDER IMAGES/LIVING.png" alt="Living Room & TV Unit" loading="lazy" />
                <span>Living & TV Units</span>
              </div>
              <div className="proof-item">
                <img src="/services/wardrobe.png" alt="Designer Wardrobes" loading="lazy" />
                <span>Custom Wardrobes</span>
              </div>
            </div>
          </div>

          <div className="get-quote-card-body">
            <form onSubmit={handleSubmit} noValidate>
              {/* Invisible Honeypot field for bot trapping */}
              <div style={{ display: 'none', opacity: 0, position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <label htmlFor="company_website_url">Company Website</label>
                <input
                  type="text"
                  id="company_website_url"
                  name="company_website_url"
                  tabIndex="-1"
                  autoComplete="off"
                  value={formData.company_website_url || ''}
                  onChange={handleInputChange}
                />
              </div>

              {errorMsg && (
                <div className="quote-error-banner">
                  <div>
                    <strong>Note: </strong>
                    {errorMsg}
                  </div>
                  <div>
                    <a
                      href={mailtoFallback}
                      style={{ color: '#b81c22', fontWeight: 700, textDecoration: 'underline' }}
                    >
                      Click here to email us directly at mail.cookscape.leads@gmail.com
                    </a>
                  </div>
                </div>
              )}

              {/* 1. Contact Details */}
              <div className="quote-form-section">
                <div className="quote-section-header">
                  <span className="quote-section-num">1</span>
                  <div>
                    <h2 className="quote-section-title">Contact Details</h2>
                    <p className="quote-section-desc">Where should our interior designer send your estimate?</p>
                  </div>
                </div>

                <div className="quote-grid-3">
                  {/* Full Name */}
                  <div className="quote-field-group">
                    <label htmlFor="quote-name" className="quote-field-label">
                      Full Name <span className="required">*</span>
                    </label>
                    <div className="quote-input-wrap">
                      <span className="quote-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        id="quote-name"
                        name="name"
                        type="text"
                        placeholder="e.g. Rahul Sundaram"
                        className={`quote-input ${fieldErrors.name ? 'has-error' : ''}`}
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={status === 'submitting'}
                        required
                      />
                    </div>
                    {fieldErrors.name && <span className="quote-field-error">{fieldErrors.name}</span>}
                  </div>

                  {/* Email Address */}
                  <div className="quote-field-group">
                    <label htmlFor="quote-email" className="quote-field-label">
                      Email Address <span className="required">*</span>
                    </label>
                    <div className="quote-input-wrap">
                      <span className="quote-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </span>
                      <input
                        id="quote-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className={`quote-input ${fieldErrors.email ? 'has-error' : ''}`}
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={status === 'submitting'}
                        required
                      />
                    </div>
                    {fieldErrors.email && <span className="quote-field-error">{fieldErrors.email}</span>}
                  </div>

                  {/* Phone Number */}
                  <div className="quote-field-group">
                    <label htmlFor="quote-phone" className="quote-field-label">
                      Phone Number (+91) <span className="required">*</span>
                    </label>
                    <div className="quote-input-wrap">
                      <span className="quote-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </span>
                      <input
                        id="quote-phone"
                        name="phone"
                        type="tel"
                        placeholder="9876543210"
                        className={`quote-input ${fieldErrors.phone ? 'has-error' : ''}`}
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={status === 'submitting'}
                        required
                      />
                    </div>
                    {fieldErrors.phone && <span className="quote-field-error">{fieldErrors.phone}</span>}
                  </div>
                </div>
              </div>

              {/* 2. Property Details */}
              <div className="quote-form-section">
                <div className="quote-section-header">
                  <span className="quote-section-num">2</span>
                  <div>
                    <h2 className="quote-section-title">Property Details</h2>
                    <p className="quote-section-desc">Help us calculate estimated square footage and layout scope.</p>
                  </div>
                </div>

                {/* How many BHK? */}
                <div className="quote-field-group">
                  <label className="quote-field-label">
                    How many BHK? <span className="required">*</span>
                  </label>
                  <div className="quote-pills-grid">
                    {BHK_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`quote-pill-btn ${formData.bhk === option ? 'active' : ''}`}
                        onClick={() => setFormData((prev) => ({ ...prev, bhk: option }))}
                        disabled={status === 'submitting'}
                      >
                        <span className="pill-dot"></span>
                        {option}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.bhk && <span className="quote-field-error">{fieldErrors.bhk}</span>}
                </div>

                {/* Property Type */}
                <div className="quote-field-group">
                  <label className="quote-field-label">
                    Property Type <span className="required">*</span>
                  </label>
                  <div className="quote-pills-grid">
                    {PROPERTY_TYPES.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`quote-pill-btn ${formData.propertyType === option ? 'active' : ''}`}
                        onClick={() => setFormData((prev) => ({ ...prev, propertyType: option }))}
                        disabled={status === 'submitting'}
                      >
                        <span className="pill-dot"></span>
                        {option}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.propertyType && (
                    <span className="quote-field-error">{fieldErrors.propertyType}</span>
                  )}
                </div>

                {/* Property Status */}
                <div className="quote-field-group">
                  <label className="quote-field-label">
                    Property Status <span className="required">*</span>
                  </label>
                  <div className="quote-pills-grid">
                    {PROPERTY_STATUSES.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`quote-pill-btn ${formData.propertyStatus === option ? 'active' : ''}`}
                        onClick={() => setFormData((prev) => ({ ...prev, propertyStatus: option }))}
                        disabled={status === 'submitting'}
                      >
                        <span className="pill-dot"></span>
                        {option}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.propertyStatus && (
                    <span className="quote-field-error">{fieldErrors.propertyStatus}</span>
                  )}
                </div>

                {/* City & State */}
                <div className="quote-grid-2">
                  <div className="quote-field-group">
                    <label htmlFor="quote-city" className="quote-field-label">
                      City <span className="required">*</span>
                    </label>
                    <input
                      id="quote-city"
                      name="city"
                      type="text"
                      placeholder="e.g. Chennai"
                      className={`quote-input no-icon ${fieldErrors.city ? 'has-error' : ''}`}
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={status === 'submitting'}
                      required
                    />
                    {fieldErrors.city && <span className="quote-field-error">{fieldErrors.city}</span>}
                  </div>

                  <div className="quote-field-group">
                    <label htmlFor="quote-state" className="quote-field-label">
                      State <span className="required">*</span>
                    </label>
                    <input
                      id="quote-state"
                      name="state"
                      type="text"
                      placeholder="e.g. Tamil Nadu"
                      className={`quote-input no-icon ${fieldErrors.state ? 'has-error' : ''}`}
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={status === 'submitting'}
                      required
                    />
                    {fieldErrors.state && <span className="quote-field-error">{fieldErrors.state}</span>}
                  </div>
                </div>
              </div>

              {/* 3. Interior Requirements */}
              <div className="quote-form-section">
                <div className="quote-section-header">
                  <span className="quote-section-num">3</span>
                  <div>
                    <h2 className="quote-section-title">Interior Requirements</h2>
                    <p className="quote-section-desc">Select the spaces you want to design, your budget, and timeline.</p>
                  </div>
                </div>

                {/* What interiors do you need? */}
                <div className="quote-field-group">
                  <label className="quote-field-label">
                    What interiors do you need? <span className="required">*</span>
                    <span className="hint">(Select all that apply)</span>
                  </label>
                  <div className="quote-checkbox-grid">
                    {INTERIOR_OPTIONS.map((option) => {
                      const isChecked = formData.interiors.includes(option);
                      return (
                        <div
                          key={option}
                          role="checkbox"
                          aria-checked={isChecked}
                          tabIndex={0}
                          className={`quote-checkbox-card ${isChecked ? 'checked' : ''}`}
                          onClick={() => status !== 'submitting' && toggleInteriorOption(option)}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              if (status !== 'submitting') toggleInteriorOption(option);
                            }
                          }}
                        >
                          <span className="quote-checkbox-box">
                            <FiCheck />
                          </span>
                          <span className="quote-checkbox-text">{option}</span>
                        </div>
                      );
                    })}
                  </div>
                  {fieldErrors.interiors && (
                    <span className="quote-field-error">{fieldErrors.interiors}</span>
                  )}
                </div>

                {/* Budget */}
                <div className="quote-field-group">
                  <label className="quote-field-label">
                    Budget Range <span className="required">*</span>
                  </label>
                  <div className="quote-budget-grid">
                    {BUDGET_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`quote-pill-btn ${formData.budget === option ? 'active' : ''}`}
                        onClick={() => setFormData((prev) => ({ ...prev, budget: option }))}
                        disabled={status === 'submitting'}
                      >
                        <span className="pill-dot"></span>
                        {option}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.budget && (
                    <span className="quote-field-error">{fieldErrors.budget}</span>
                  )}
                </div>

                {/* Expected Project Start Timeline */}
                <div className="quote-field-group">
                  <label className="quote-field-label">
                    Expected Project Start Timeline <span className="required">*</span>
                  </label>
                  <div className="quote-pills-grid">
                    {TIMELINE_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`quote-pill-btn ${formData.timeline === option ? 'active' : ''}`}
                        onClick={() => setFormData((prev) => ({ ...prev, timeline: option }))}
                        disabled={status === 'submitting'}
                      >
                        <span className="pill-dot"></span>
                        {option}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.timeline && (
                    <span className="quote-field-error">{fieldErrors.timeline}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Copy Enquiry Details & Submit Quote */}
              <div className="quote-actions-bar">
                <button
                  type="button"
                  className={`quote-copy-btn ${copied ? 'copied' : ''}`}
                  onClick={() => handleCopyDetails(formData)}
                  disabled={status === 'submitting'}
                >
                  <FiCopy />
                  {copied ? 'Enquiry Details Copied!' : 'Copy Enquiry Details'}
                </button>

                <button
                  type="submit"
                  className="quote-submit-btn"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="landing-spinner"></span>
                      <span>Calculating & Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Get My Free Interior Quote</span>
                      <FiArrowRight />
                    </>
                  )}
                </button>
              </div>

              <div className="quote-security-note">
                <span>🔒 Your information is 100% confidential. No spam calls.</span>
              </div>
            </form>
          </div>
        </motion.div>
      </section>

      {/* Floating Call & WhatsApp Bar on Mobile for Immediate Conversions */}
      <div className="mobile-sticky-cta">
        <a href="tel:+919600005679" className="sticky-btn call">
          <FiPhoneCall /> Call Designer
        </a>
        <a
          href="https://wa.me/919677081181?text=Hi%20Cookscape%2C%20I%20would%20like%20to%20get%20a%20quote%20for%20my%20home%20interiors."
          target="_blank"
          rel="noopener noreferrer"
          className="sticky-btn whatsapp"
        >
          <FiMessageSquare /> WhatsApp Us
        </a>
      </div>

      {/* Studio Location Trust Footer */}
      <footer className="landing-bottom-trust">
        <p>
          <strong>Visit Our Experience Studios:</strong> Nandanam (H.O) • OMR Thuraipakkam • Porur | Bengaluru • Coimbatore • Vijayawada
        </p>
        <p className="subtext">
          &copy; {new Date().getFullYear()} Cookscape Interiors. Over 25 years of luxury craftsmanship & transparent pricing.
        </p>
      </footer>
    </main>
  );
};

export default GetQuote;

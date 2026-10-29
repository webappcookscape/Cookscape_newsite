import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
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
};

const GetQuote = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [copied, setCopied] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState(null);

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
      errors.phone = 'Please enter a valid 10-digit phone number.';
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      source: 'Get Quote Form',
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

      setSubmittedQuote({
        ...payload,
        quoteId: data.quoteId || `CS-QT-${Math.floor(100000 + Math.random() * 900000)}`,
      });
      setStatus('success');

      trackLeadConversion({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        location: payload.location,
        houseType: payload.propertyType,
        bhk: payload.bhk,
        source: 'Get Quote Form',
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Get Quote submission error:', err);
      setStatus('error');
      setErrorMsg(
        err.message ||
          'Could not send quote enquiry via server. You can also copy the enquiry details or email us directly at mail.cookscape.leads@gmail.com.'
      );
    }
  };

  const mailtoFallback = `mailto:mail.cookscape.leads@gmail.com?subject=${encodeURIComponent(
    `New Quote Enquiry: ${formData.name || 'Client'} - ${formData.bhk} ${formData.propertyType}`
  )}&body=${encodeURIComponent(formatEnquiryDetails())}`;

  return (
    <main className="get-quote-page">
      <Helmet>
        <title>Get a Free Interior Design Quote | Cookscape Interiors</title>
        <meta
          name="description"
          content="Get a personalized interior design quote from Cookscape."
        />
        <link rel="canonical" href="https://cookscape.in/get-quote" />
      </Helmet>

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
                <span className="quote-intro-badge">FREE DESIGN ESTIMATE</span>
              </div>

              <h1 className="quote-intro-title">
                Let’s Plan Your <em>Dream Home Interiors</em>
              </h1>
              <p className="quote-intro-subtitle">
                Tell us a bit about your property, style preferences, and budget. Our senior interior designers will craft a customized cost estimate and design plan tailored exclusively for your space.
              </p>

              <div className="quote-intro-highlights">
                <div className="quote-highlight-pill">
                  <span className="highlight-check">&#10003;</span>
                  <span>25+ Years of Expertise</span>
                </div>
                <div className="quote-highlight-pill">
                  <span className="highlight-check">&#10003;</span>
                  <span>100% Customized Designs</span>
                </div>
                <div className="quote-highlight-pill">
                  <span className="highlight-check">&#10003;</span>
                  <span>Free 1-on-1 Designer Consultation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="get-quote-card-body">
            {status === 'success' && submittedQuote ? (
              <div className="quote-success-box">
                <div className="quote-success-icon">
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>

                <h2 className="quote-success-title">Quote Request Sent!</h2>
                <p className="quote-success-sub">
                  Thank you, <strong>{submittedQuote.name}</strong>. Your enquiry details have been sent to{' '}
                  <strong>mail.cookscape.leads@gmail.com</strong> (Ref:{' '}
                  <strong style={{ color: '#b81c22' }}>{submittedQuote.quoteId}</strong>).
                </p>

                <div className="quote-summary-preview">
                  <pre>{formatEnquiryDetails(submittedQuote)}</pre>
                </div>

                <div className="quote-success-actions">
                  <button
                    type="button"
                    className={`quote-copy-btn ${copied ? 'copied' : ''}`}
                    onClick={() => handleCopyDetails(submittedQuote)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    {copied ? 'Enquiry Details Copied!' : 'Copy Enquiry Details'}
                  </button>

                  <button
                    type="button"
                    className="quote-submit-btn"
                    style={{ flex: 'none' }}
                    onClick={() => {
                      setFormData(INITIAL_FORM_STATE);
                      setSubmittedQuote(null);
                      setStatus('idle');
                    }}
                  >
                    Submit Another Quote Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
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
                        Click here to send directly to mail.cookscape.leads@gmail.com
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
                      <p className="quote-section-desc">Where should we send your personalized quote?</p>
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
                          placeholder="Enter your full name"
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
                        Phone Number <span className="required">*</span>
                      </label>
                      <div className="quote-input-wrap">
                        <span className="quote-input-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </span>
                        <input
                          id="quote-phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
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
                      <p className="quote-section-desc">Help us understand the layout and location of your home.</p>
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
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
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
                      Budget <span className="required">*</span>
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
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    {copied ? 'Enquiry Details Copied!' : 'Copy Enquiry Details'}
                  </button>

                  <button
                    type="submit"
                    className="quote-submit-btn"
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? (
                      <>
                        <span>Sending Quote Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Free Quote</span>
                        <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default GetQuote;

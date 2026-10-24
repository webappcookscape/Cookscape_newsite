import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import './CareersApply.css';

const ROLES_LIST = [
  'Interior Designer',
  'Customer Relationship Executive',
  'Application Engineer',
  'Site Supervisor',
  '3D Visualizer',
  'Other / Open Application'
];

const EXPERIENCE_LEVELS = [
  'Fresher / Entry (< 1 yr)',
  '1 - 3 Years',
  '3 - 5 Years',
  '5 - 8 Years',
  '8+ Years'
];

const NOTICE_PERIODS = [
  'Immediate',
  '15 Days',
  '30 Days',
  '60 Days',
  '90 Days'
];

const CareersApply = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobParam = searchParams.get('job');

  // Initialize selected role from query param or default
  const [selectedRole, setSelectedRole] = useState(() => {
    if (jobParam) {
      const match = ROLES_LIST.find(r => r.toLowerCase() === jobParam.toLowerCase());
      if (match) return match;
      return 'Other / Open Application';
    }
    return 'Interior Designer';
  });

  const [customRole, setCustomRole] = useState(
    jobParam && !ROLES_LIST.some(r => r.toLowerCase() === jobParam.toLowerCase()) ? jobParam : ''
  );

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Chennai',
    experience: '1 - 3 Years',
    currentRole: '',
    noticePeriod: 'Immediate',
    portfolioUrl: '',
    coverLetter: '',
  });

  // Resume File
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Form Status
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [successData, setSuccessData] = useState(null);

  // Update selected role if query param changes
  useEffect(() => {
    if (jobParam) {
      const match = ROLES_LIST.find(r => r.toLowerCase() === jobParam.toLowerCase());
      if (match) {
        setSelectedRole(match);
      } else {
        setSelectedRole('Other / Open Application');
        setCustomRole(jobParam);
      }
    }
  }, [jobParam]);

  // Derived effective job title
  const effectiveJobTitle = selectedRole === 'Other / Open Application'
    ? (customRole.trim() || 'General / Open Application')
    : selectedRole;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errorMsg) setErrorMsg('');
  };

  // Format file size
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Process File to Base64
  const processFile = (file) => {
    setResumeError('');
    if (!file) return;

    // Check size (Max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setResumeError('File is too large. Maximum allowed size is 10MB.');
      return;
    }

    // Check extension
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const isExtensionValid = /\.(pdf|doc|docx)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !isExtensionValid) {
      setResumeError('Invalid file format. Please upload a PDF, DOC, or DOCX document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setResumeFile({
        fileName: file.name,
        fileType: file.type || 'application/pdf',
        fileSize: formatBytes(file.size),
        fileData: e.target.result, // base64 Data URL
      });
    };
    reader.onerror = () => {
      setResumeError('Failed to read the file. Please try again or select another file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumeError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please provide your full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Please provide a valid 10-digit mobile number.';
    }

    if (!formData.location.trim()) {
      errors.location = 'Please specify your current city.';
    }

    if (selectedRole === 'Other / Open Application' && !customRole.trim()) {
      errors.customRole = 'Please specify the role you are applying for.';
    }

    if (!consent) {
      errors.consent = 'You must authorize Cookscape to contact you regarding your application.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    const payload = {
      jobTitle: effectiveJobTitle,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      experience: formData.experience,
      currentRole: formData.currentRole.trim(),
      noticePeriod: formData.noticePeriod,
      portfolioUrl: formData.portfolioUrl.trim(),
      coverLetter: formData.coverLetter.trim(),
      resume: resumeFile || null,
    };

    try {
      // First attempt relative proxy /api/apply-job
      let response = await fetch('/api/apply-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // If proxy not reachable or returned 404, fallback to explicit port 5005
      if (!response.ok && response.status === 404) {
        try {
          response = await fetch('http://localhost:5005/api/apply-job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (e) {
          // ignore fallback fetch error and rely on first response
        }
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to submit application.');
      }

      // Google Tag & Meta Pixel conversion tracking
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'career_application_submission', {
          event_category: 'Careers',
          event_label: effectiveJobTitle,
        });
      }

      setSuccessData({
        applicationId: result.applicationId || `CS-APP-${Math.floor(100000 + Math.random() * 900000)}`,
        jobTitle: effectiveJobTitle,
        name: formData.name.trim(),
        email: formData.email.trim(),
      });

      window.scrollTo({ top: 200, behavior: 'smooth' });
    } catch (err) {
      console.error('Job application submission error:', err);
      setErrorMsg(err.message || 'Unable to submit application at this time. Please try again or use direct email.');
    } finally {
      setLoading(false);
    }
  };

  // Direct mailto fallback link in case applicant encounters network issues
  const mailtoFallback = `mailto:es.cookscape@gmail.com?subject=${encodeURIComponent(
    `Job Application: ${effectiveJobTitle} - ${formData.name || 'Candidate'}`
  )}&body=${encodeURIComponent(
    `Hi Cookscape HR Team,\n\nI am applying for the ${effectiveJobTitle} position.\n\n` +
    `Candidate Details:\n- Name: ${formData.name}\n- Email: ${formData.email}\n- Phone: ${formData.phone}\n- City: ${formData.location}\n- Experience: ${formData.experience}\n- Notice Period: ${formData.noticePeriod}\n- Portfolio/LinkedIn: ${formData.portfolioUrl}\n\n` +
    `Introduction:\n${formData.coverLetter}\n\n` +
    `[Please attach your resume to this email before sending]\n\nWarm regards,\n${formData.name}`
  )}`;

  return (
    <main className="careers-apply-page">
      <Helmet>
        <title>{`Apply for ${effectiveJobTitle} | Cookscape Careers Chennai`}</title>
        <meta 
          name="description" 
          content={`Apply for the ${effectiveJobTitle} position at Cookscape Interiors. Join Chennai's premier luxury interior design atelier.`} 
        />
        <link rel="canonical" href="https://cookscape.in/careers/apply" />
      </Helmet>

      {/* Hero Header */}
      <section className="careers-apply-hero">
        <div className="careers-apply-hero-bg"></div>
        <div className="careers-apply-hero-content">
          <div className="careers-apply-breadcrumb">
            <Link to="/">Home</Link>
            <span className="separator">&bull;</span>
            <Link to="/careers">Careers</Link>
            <span className="separator">&bull;</span>
            <span className="current">Apply Now</span>
          </div>

          <span className="careers-apply-badge">CAREERS PORTAL</span>
          <h1>
            Join the <em>Cookscape</em> Atelier
          </h1>
          <p>
            You are applying for <strong>{effectiveJobTitle}</strong>. Fill out the application dossier below, attach your resume, and let's craft spaces that inspire.
          </p>
        </div>
      </section>

      {/* Main Form Container */}
      <section className="careers-apply-container">
        <motion.div 
          className="careers-apply-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {successData ? (
            /* Animated Success Screen */
            <div className="apply-success-card">
              <div className="apply-success-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>

              <h2 className="apply-success-title">Application Submitted!</h2>
              <p className="apply-success-subtitle">
                Thank you, <strong>{successData.name}</strong>. Your application package has been officially recorded and dispatched to our talent recruitment team at <strong>es.cookscape@gmail.com</strong>.
              </p>

              <div className="apply-success-details">
                <div className="apply-success-detail-row">
                  <span className="apply-success-detail-label">Application Reference ID</span>
                  <span className="apply-success-detail-val" style={{ color: '#b81c22' }}>{successData.applicationId}</span>
                </div>
                <div className="apply-success-detail-row">
                  <span className="apply-success-detail-label">Role Applied For</span>
                  <span className="apply-success-detail-val">{successData.jobTitle}</span>
                </div>
                <div className="apply-success-detail-row">
                  <span className="apply-success-detail-label">Confirmation Sent To</span>
                  <span className="apply-success-detail-val">{successData.email}</span>
                </div>
                <div className="apply-success-detail-row">
                  <span className="apply-success-detail-label">Next Step</span>
                  <span className="apply-success-detail-val">Portfolio review (2-3 business days)</span>
                </div>
              </div>

              <div className="apply-success-actions">
                <Link to="/careers" className="apply-btn-back">
                  Explore More Careers
                </Link>
                <Link to="/portfolio" className="apply-btn-portfolio">
                  View Our Design Portfolio
                </Link>
              </div>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} noValidate>
              {/* Role Selection */}
              <div className="apply-role-section">
                <span className="apply-section-label">Select The Position You Are Applying For</span>
                <div className="apply-role-pills">
                  {ROLES_LIST.map((role) => (
                    <button
                      type="button"
                      key={role}
                      className={`role-pill-btn ${selectedRole === role ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedRole(role);
                        if (role !== 'Other / Open Application') {
                          setCustomRole('');
                        }
                      }}
                    >
                      {role}
                      {selectedRole === role && (
                        <span className="role-pill-check">&#10003;</span>
                      )}
                    </button>
                  ))}
                </div>

                {selectedRole === 'Other / Open Application' && (
                  <div className="custom-role-input-wrap">
                    <div className="apply-field-group">
                      <label htmlFor="customRole">
                        Specify Your Desired Job Title <span className="required">*</span>
                      </label>
                      <input
                        id="customRole"
                        type="text"
                        className={`apply-input no-icon ${fieldErrors.customRole ? 'has-error' : ''}`}
                        placeholder="e.g. Senior Project Architect / Estimation Engineer"
                        value={customRole}
                        onChange={(e) => {
                          setCustomRole(e.target.value);
                          if (fieldErrors.customRole) setFieldErrors(prev => ({ ...prev, customRole: '' }));
                        }}
                      />
                      {fieldErrors.customRole && (
                        <span className="apply-field-error">{fieldErrors.customRole}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Error Banner */}
              {errorMsg && (
                <div className="apply-error-banner">
                  <div className="apply-error-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>Submission Issue</span>
                  </div>
                  <p className="apply-error-message">{errorMsg}</p>
                  <div>
                    <a href={mailtoFallback} className="apply-direct-mail-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      Click here to email directly to es.cookscape@gmail.com
                    </a>
                  </div>
                </div>
              )}

              {/* Section 1: Personal Details */}
              <div className="apply-form-section">
                <h3 className="apply-form-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  1. Personal & Contact Information
                </h3>

                <div className="apply-grid-2">
                  <div className="apply-field-group">
                    <label htmlFor="name">
                      Full Name <span className="required">*</span>
                    </label>
                    <div className="apply-input-wrap">
                      <span className="apply-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="e.g. Aarav Sharma"
                        className={`apply-input ${fieldErrors.name ? 'has-error' : ''}`}
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {fieldErrors.name && <span className="apply-field-error">{fieldErrors.name}</span>}
                  </div>

                  <div className="apply-field-group">
                    <label htmlFor="email">
                      Email Address <span className="required">*</span>
                    </label>
                    <div className="apply-input-wrap">
                      <span className="apply-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                      </span>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. aarav.sharma@example.com"
                        className={`apply-input ${fieldErrors.email ? 'has-error' : ''}`}
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {fieldErrors.email && <span className="apply-field-error">{fieldErrors.email}</span>}
                  </div>
                </div>

                <div className="apply-grid-2">
                  <div className="apply-field-group">
                    <label htmlFor="phone">
                      Mobile Number (+91) <span className="required">*</span>
                    </label>
                    <div className="apply-input-wrap">
                      <span className="apply-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </span>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="e.g. 9876543210"
                        className={`apply-input ${fieldErrors.phone ? 'has-error' : ''}`}
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength="15"
                        required
                      />
                    </div>
                    {fieldErrors.phone && <span className="apply-field-error">{fieldErrors.phone}</span>}
                  </div>

                  <div className="apply-field-group">
                    <label htmlFor="location">
                      Current City / Location <span className="required">*</span>
                    </label>
                    <div className="apply-input-wrap">
                      <span className="apply-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </span>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        placeholder="e.g. Chennai (Adyar, Anna Nagar, etc.)"
                        className={`apply-input ${fieldErrors.location ? 'has-error' : ''}`}
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {fieldErrors.location && <span className="apply-field-error">{fieldErrors.location}</span>}
                  </div>
                </div>
              </div>

              {/* Section 2: Professional Profile */}
              <div className="apply-form-section">
                <h3 className="apply-form-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  2. Professional Background
                </h3>

                <div className="apply-field-group">
                  <label>Total Relevant Experience</label>
                  <div className="apply-chips-row">
                    {EXPERIENCE_LEVELS.map((exp) => (
                      <button
                        type="button"
                        key={exp}
                        className={`apply-chip-btn ${formData.experience === exp ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, experience: exp }))}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="apply-grid-2">
                  <div className="apply-field-group">
                    <label htmlFor="currentRole">
                      Current Role & Company <span className="optional">(optional)</span>
                    </label>
                    <input
                      id="currentRole"
                      name="currentRole"
                      type="text"
                      placeholder="e.g. Junior Designer at Studio Design"
                      className="apply-input no-icon"
                      value={formData.currentRole}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="apply-field-group">
                    <label>Notice Period</label>
                    <div className="apply-chips-row">
                      {NOTICE_PERIODS.map((np) => (
                        <button
                          type="button"
                          key={np}
                          className={`apply-chip-btn ${formData.noticePeriod === np ? 'active' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, noticePeriod: np }))}
                        >
                          {np}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="apply-field-group">
                  <label htmlFor="portfolioUrl">
                    Portfolio / Behance / LinkedIn URL <span className="optional">(highly recommended)</span>
                  </label>
                  <div className="apply-input-wrap">
                    <span className="apply-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                    </span>
                    <input
                      id="portfolioUrl"
                      name="portfolioUrl"
                      type="url"
                      placeholder="https://behance.net/yourprofile or Google Drive link"
                      className="apply-input"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Resume Upload */}
              <div className="apply-form-section">
                <h3 className="apply-form-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  3. Resume / Curriculum Vitae
                </h3>

                <input
                  ref={fileInputRef}
                  type="file"
                  id="resumeUpload"
                  className="resume-file-input-hidden"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileInputChange}
                />

                {!resumeFile ? (
                  <div
                    className={`resume-dropzone ${isDragging ? 'dragover' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="resume-dropzone-icon">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div className="resume-dropzone-title">
                      Click to upload or drag & drop your resume
                    </div>
                    <p className="resume-dropzone-subtitle">
                      Accepted formats: <strong>PDF, DOC, DOCX</strong> (Up to 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="resume-uploaded-pill">
                    <div className="resume-file-info">
                      <div className="resume-file-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div>
                        <div className="resume-file-name">{resumeFile.fileName}</div>
                        <div className="resume-file-size">
                          {resumeFile.fileSize} &bull; Ready for attachment
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="resume-remove-btn"
                      onClick={removeResume}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Change File
                    </button>
                  </div>
                )}

                {resumeError && <span className="apply-field-error" style={{ marginTop: '8px' }}>{resumeError}</span>}
              </div>

              {/* Section 4: Cover Note */}
              <div className="apply-form-section">
                <h3 className="apply-form-section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  4. Candidate Note / Pitch <span className="optional" style={{ fontSize: '0.85rem', fontWeight: '400', color: '#777' }}>(optional)</span>
                </h3>

                <div className="apply-field-group">
                  <label htmlFor="coverLetter">
                    Tell us about your background, key projects, or why you'd thrive at Cookscape
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    className="apply-textarea"
                    placeholder="Briefly describe your design ethos, favorite residential projects, or tools you master (e.g., AutoCAD, 3ds Max, SketchUp)..."
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="apply-consent-box">
                <label className="apply-consent-label">
                  <input
                    type="checkbox"
                    className="apply-consent-checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (fieldErrors.consent) setFieldErrors(prev => ({ ...prev, consent: '' }));
                    }}
                  />
                  <span>
                    I confirm that the details provided are accurate and authorize Cookscape Interiors recruitment team to review my portfolio and contact me via phone or email (<strong>es.cookscape@gmail.com</strong>) regarding career opportunities.
                  </span>
                </label>
                {fieldErrors.consent && <span className="apply-field-error" style={{ marginTop: '6px' }}>{fieldErrors.consent}</span>}
              </div>

              {/* Submit Button */}
              <div className="apply-action-row">
                <button
                  type="submit"
                  className="apply-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="apply-spinner"></span>
                      <span>Submitting Application Dossier...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application for {effectiveJobTitle}</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="apply-privacy-guarantee">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Your profile and contact data will be securely sent directly to <strong>es.cookscape@gmail.com</strong>.
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </section>

      <Footer />
    </main>
  );
};

export default CareersApply;

import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiCheckCircle, FiPhoneCall, FiMessageSquare, FiHome, FiArrowRight } from 'react-icons/fi';
import './ThankYou.css';

const ThankYou = () => {
  const location = useLocation();
  const state = location.state || {};
  const {
    name = '',
    phone = '',
    email = '',
    quoteId = '',
    bhk = '',
    propertyType = '',
    city = '',
  } = state;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="thankyou-page">
      <Helmet>
        <title>Thank You | Cookscape Interiors</title>
        <meta
          name="description"
          content="Thank you for requesting an interior design quote from Cookscape. Our design team will get in touch with you shortly."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Top Minimal Header */}
      <header className="thankyou-header">
        <div className="thankyou-container header-inner">
          <img
            src={`${import.meta.env.BASE_URL}logo.jpeg`}
            alt="Cookscape Interiors"
            className="thankyou-logo"
          />
          <div className="thankyou-header-call">
            <span>Need immediate support?</span>
            <a href="tel:+919600005679" className="header-call-pill">
              <FiPhoneCall /> +91 96000 05679
            </a>
          </div>
        </div>
      </header>

      {/* Hero / Confirmation Card */}
      <section className="thankyou-container">
        <motion.div
          className="thankyou-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="thankyou-badge-wrap">
            <span className="thankyou-check-icon">
              <FiCheckCircle />
            </span>
          </div>

          <span className="thankyou-eyebrow">QUOTE REQUEST CONFIRMED</span>
          <h1 className="thankyou-title">
            Thank You{name ? `, ${name}` : ''}!
          </h1>
          <p className="thankyou-subtitle">
            We have received your interior design request. Our senior design consultant is reviewing your requirements and will reach out to schedule your personalized 3D design consultation.
          </p>

          {/* Reference Card */}
          <div className="thankyou-ref-card">
            <div className="ref-item">
              <span className="ref-label">Quote Reference ID</span>
              <span className="ref-value highlight">{quoteId || 'CS-QT-RECEIVED'}</span>
            </div>
            {bhk || propertyType ? (
              <div className="ref-item">
                <span className="ref-label">Property</span>
                <span className="ref-value">
                  {[bhk, propertyType].filter(Boolean).join(' • ')}
                  {city ? ` (${city})` : ''}
                </span>
              </div>
            ) : null}
            {email ? (
              <div className="ref-item">
                <span className="ref-label">Confirmation Sent To</span>
                <span className="ref-value">{email}</span>
              </div>
            ) : null}
            <div className="ref-item">
              <span className="ref-label">Estimated Response Time</span>
              <span className="ref-value green">Within 2 business hours</span>
            </div>
          </div>

          {/* What Happens Next Steps */}
          <div className="thankyou-steps">
            <h2 className="steps-heading">What Happens Next?</h2>
            <div className="steps-grid">
              <div className="step-card">
                <span className="step-num">1</span>
                <h3>Initial Discovery Call</h3>
                <p>A design specialist will call to understand your floor plan, style choices, and budget.</p>
              </div>
              <div className="step-card">
                <span className="step-num">2</span>
                <h3>3D Design & Transparent Estimate</h3>
                <p>We craft custom 3D designs, finish samples, and a clear itemized quote with zero hidden charges.</p>
              </div>
              <div className="step-card">
                <span className="step-num">3</span>
                <h3>Studio Visit or Site Inspection</h3>
                <p>Walk through our experience centers in Chennai (Nandanam, OMR, Porur) or request an on-site visit.</p>
              </div>
            </div>
          </div>

          {/* Instant Connect Banner */}
          <div className="thankyou-instant-banner">
            <div>
              <h3>Want to share your floor plan immediately?</h3>
              <p>Chat directly with our design team on WhatsApp for an instant response.</p>
            </div>
            <div className="instant-actions">
              <a
                href={`https://wa.me/919677081181?text=${encodeURIComponent(
                  `Hi Cookscape Team! I just submitted a quote request (Ref: ${quoteId || 'Website'}). I'd like to share my floor plan and get a quick discussion.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <FiMessageSquare /> Chat on WhatsApp
              </a>
              <a href="tel:+919600005679" className="btn-call">
                <FiPhoneCall /> Call +91 96000 05679
              </a>
            </div>
          </div>

          {/* Return link */}
          <div className="thankyou-footer-nav">
            <Link to="/" className="btn-home">
              <FiHome /> Return to Cookscape Home <FiArrowRight />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Subtle Studio Footer Bar */}
      <footer className="thankyou-bottom">
        <p>
          <strong>Cookscape Experience Studios:</strong> Nandanam (H.O) • OMR Thuraipakkam • Porur | Bengaluru • Coimbatore • Vijayawada
        </p>
        <p className="copyright">
          &copy; {new Date().getFullYear()} Cookscape Interiors. 25+ Years of Trust & Quality.
        </p>
      </footer>
    </main>
  );
};

export default ThankYou;


import React from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';

const Privacy = () => {
  return (
    <main className="privacy-premium-page" style={{ backgroundColor: 'var(--premium-cream, #faf9f6)' }}>
      <Helmet>
        <title>Privacy Policy | Cookscape Interiors</title>
        <meta name="description" content="Read Cookscape's Privacy Policy to understand how we collect, use, and protect your personal information when you use our website and interior design services." />
        <link rel="canonical" href="https://cookscape.in/privacy" />
        <meta name="robots" content="noindex, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Cookscape Interiors" />
        <meta property="og:url" content="https://cookscape.in/privacy" />
        <meta property="og:title" content="Privacy Policy | Cookscape Interiors" />
        <meta property="og:description" content="Read Cookscape's Privacy Policy to understand how we collect, use, and protect your personal information." />
        <meta property="og:locale" content="en_IN" />
      </Helmet>

      {/* Hero Header */}
      <section className="careers-hero-section">
        <div className="careers-hero-bg"></div>
        <div className="container careers-hero-content">
          <span className="careers-eyebrow">LEGAL POLICY</span>
          <h1>Privacy <em>Policy</em></h1>
          <p>Effective Date: January 8, 2026</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="privacy-section py-5">
        <div className="container p-5" style={{ color: 'var(--text-secondary-dark, #555555)', lineHeight: '1.8' }}>
          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>Privacy Policy for Cookscape Interiors</h4>
          <p className="blog-page-para">
            Welcome to Cookscape Interiors. At Cookscape, we are committed to protecting the privacy of our users. This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information. By using our website, you agree to the terms outlined in this policy.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>Information We Collect</h4>
          
          <h5 style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '1rem', fontWeight: 'bold' }}>1. Personal Information</h5>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li>Name</li>
            <li>Contact information (email address, phone number)</li>
            <li>Address</li>
          </ul>

          <h5 style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '1rem', fontWeight: 'bold' }}>2. Non-Personal Information</h5>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li>Website usage data (e.g., IP address, browser type, pages visited)</li>
          </ul>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>How We Use Your Information</h4>
          
          <h5 style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '1rem', fontWeight: 'bold' }}>1. Personal Information</h5>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li>To provide and maintain our services</li>
            <li>To respond to your inquiries and provide support</li>
          </ul>

          <h5 style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '1rem', fontWeight: 'bold' }}>2. Non-Personal Information</h5>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li>To analyze trends and improve our website’s functionality</li>
          </ul>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>Information Sharing</h4>
          <p className="blog-page-para">
            We do not sell, trade, or otherwise transfer your personal information to outside parties. However, this does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>Security</h4>
          <p className="blog-page-para">
            We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>Cookies</h4>
          <p className="blog-page-para">
            We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>Your Consent</h4>
          <p className="blog-page-para">
            By using our site, you consent to our privacy policy.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>Changes to our Privacy Policy</h4>
          <p className="blog-page-para">
            If we decide to change our privacy policy, we will post those changes on this page.
          </p>
          
          <p className="blog-page-para" style={{ marginTop: '2rem' }}>
            For any questions regarding this privacy policy, please contact us at <a href="mailto:support@cookscape.com" style={{ color: 'var(--premium-accent, #b81c22)', textDecoration: 'underline' }}>support@cookscape.com</a>.
          </p>
          <p className="blog-page-para" style={{ fontWeight: 'bold' }}>
            Thank you for choosing Cookscape Interiors.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Privacy;

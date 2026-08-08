import React from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <main className="terms-premium-page" style={{ backgroundColor: 'var(--premium-cream, #faf9f6)' }}>
      <Helmet>
        <title>Terms & Conditions | Cookscape Interiors</title>
        <meta name="description" content="Read Cookscape's Terms and Conditions governing access to and use of our website, interior design services, and all related features." />
        <link rel="canonical" href="https://cookscape.in/terms" />
        <meta name="robots" content="noindex, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Cookscape Interiors" />
        <meta property="og:url" content="https://cookscape.in/terms" />
        <meta property="og:title" content="Terms & Conditions | Cookscape Interiors" />
        <meta property="og:description" content="Read Cookscape's Terms and Conditions for accessing and using our website, design services, and features." />
        <meta property="og:locale" content="en_IN" />
      </Helmet>

      {/* Hero Header */}
      <section className="careers-hero-section">
        <div className="careers-hero-bg"></div>
        <div className="container careers-hero-content">
          <span className="careers-eyebrow">LEGAL AGREEMENT</span>
          <h1>Terms & <em>Conditions</em></h1>
          <p>Effective Date: January 8, 2026</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="privacy-section py-5">
        <div className="container p-5" style={{ color: 'var(--text-secondary-dark, #555555)', lineHeight: '1.8' }}>
          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>Terms and Conditions for Cookscape Interiors Design</h4>
          <p className="blog-page-para">
            Welcome to https://www.cookscape.com/ (“Cookscape”, “we”, “us”, “our”). These Terms and Conditions (“Terms”) govern your access to and use of our website, services, content, and features (collectively, the “Services”).
            By accessing, browsing, or using this website in any manner, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use the Services.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>1. Eligibility</h4>
          <p className="blog-page-para">
            You must be at least 13 years of age to use this website. If you are under 18 years of age, you may use the Services only with the involvement and consent of a parent or legal guardian.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>2. User Accounts</h4>
          <p className="blog-page-para">
            If you create or submit information through the website:
          </p>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li>You are responsible for maintaining the confidentiality of your login or submitted details.</li>
            <li>You agree to provide accurate, current, and complete information.</li>
            <li>You agree to notify us immediately of any unauthorized use or security breach.</li>
          </ul>
          <p className="blog-page-para">
            Cookscape reserves the right to suspend or terminate access if false or misleading information is provided.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>3. User Conduct</h4>
          <p className="blog-page-para">
            You agree not to:
          </p>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li>Use the website for any unlawful purpose.</li>
            <li>Upload, post, or transmit any content that is illegal, abusive, defamatory, obscene, misleading, or offensive.</li>
            <li>Interfere with the security, performance, or functionality of the website.</li>
            <li>Use automated tools, bots, scraping software, or data-mining techniques without written permission.</li>
          </ul>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>4. Content</h4>
          
          <h5 style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '1rem', fontWeight: 'bold' }}>4.1 User-Generated Content</h5>
          <p className="blog-page-para">
            Users may submit enquiries, reviews, feedback, images, project details, or other materials (“User Content”).
            By submitting User Content, you:
          </p>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li>Grant Cookscape a non-exclusive, worldwide, royalty-free license to use, reproduce, display, and distribute such content for business and promotional purposes.</li>
            <li>Confirm that the content does not violate any third-party rights.</li>
          </ul>
          <p className="blog-page-para">
            Cookscape does not claim ownership of User Content but reserves the right to remove content deemed inappropriate.
          </p>

          <h5 style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '1rem', fontWeight: 'bold' }}>4.2 Website Content</h5>
          <p className="blog-page-para">
            All text, designs, images, drawings, layouts, videos, logos, graphics, and software displayed on the website (“Cookscape Content”) are owned by or licensed to Cookscape and protected under applicable intellectual property laws.
            You may view and use this content for personal, non-commercial purposes only. Any reproduction, distribution, or commercial use without prior written consent is strictly prohibited.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>5. Intellectual Property</h4>
          <p className="blog-page-para">
            All intellectual property rights related to the website and its content belong exclusively to Cookscape. Unauthorized use may result in legal action.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>6. Service Information Disclaimer</h4>
          <p className="blog-page-para">
            All designs, images, layouts, specifications, prices, timelines, and descriptions displayed on the website are for informational purposes only.
            Final scope of work, pricing, materials, timelines, and deliverables will be confirmed only through official quotations, work orders, or written agreements issued by Cookscape.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>7. Third-Party Links</h4>
          <p className="blog-page-para">
            The website may contain links to third-party websites or services. Cookscape is not responsible for the content, privacy policies, or practices of such third parties. Accessing third-party links is at your own risk.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>8. Disclaimers</h4>
          <p className="blog-page-para">
            The Services are provided on an “AS IS” and “AS AVAILABLE” basis without warranties of any kind, either express or implied.
            To the maximum extent permitted by law, Cookscape disclaims all warranties including, but not limited to, merchantability, fitness for a particular purpose, accuracy, and non-infringement.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>9. Limitation of Liability</h4>
          <p className="blog-page-para">
            To the maximum extent permitted by law, Cookscape, its directors, employees, agents, or affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities arising from the use of the website or Services.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>10. Indemnification</h4>
          <p className="blog-page-para">
            You agree to indemnify and hold harmless Cookscape from any claims, damages, losses, liabilities, or expenses arising out of your violation of these Terms, your misuse of the Services, or your submitted User Content.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>11. Termination</h4>
          <p className="blog-page-para">
            Cookscape may suspend or terminate access to the website at any time, with or without notice, if these Terms are violated or for operational reasons.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>12. Governing Law and Jurisdiction</h4>
          <p className="blog-page-para">
            These Terms shall be governed by and construed in accordance with the laws of India.
            Any disputes arising out of or relating to these Terms, the website, or the Services shall be subject to the exclusive jurisdiction of the courts located in Chennai, Tamil Nadu, India.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>13. Changes to These Terms</h4>
          <p className="blog-page-para">
            Cookscape reserves the right to modify or update these Terms at any time. Changes will be effective immediately upon posting on the website. Continued use of the Services constitutes acceptance of the revised Terms.
          </p>

          <h4 className="blog-page-title-2" style={{ color: 'var(--text-primary-dark, #111111)', marginTop: '2rem' }}>14. Contact Information</h4>
          <p className="blog-page-para">
            If you have any questions regarding these Terms, please contact us:
          </p>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li>Email: <a href="mailto:support@cookscape.com" style={{ color: 'var(--premium-accent, #b81c22)', textDecoration: 'underline' }}>support@cookscape.com</a></li>
            <li>Website: <a href="https://www.cookscape.com/" style={{ color: 'var(--premium-accent, #b81c22)', textDecoration: 'underline' }}>https://www.cookscape.com/</a></li>
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Terms;

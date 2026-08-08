import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';

const JOBS = [
  {
    title: "Interior Designer",
    type: "Full-Time",
    location: "Chennai",
    department: "Design",
    desc: "Create stunning, functional spaces that inspire. We're looking for creative visionaries with a passion for luxury home interiors.",
    requirements: ["3+ years experience in interior design", "Proficiency in AutoCAD & SketchUp", "Strong portfolio of residential projects", "Excellent client communication skills"]
  },
  {
    title: "Customer Relationship Executive",
    type: "Full-Time",
    location: "Chennai",
    department: "Client Success",
    desc: "The bridge between our brand and our cherished clients. Ensure a seamless, delightful journey from consultation to handover.",
    requirements: ["2+ years in customer-facing roles", "Exceptional communication skills", "Experience in luxury/premium brands", "Problem-solving mindset"]
  },
  {
    title: "Application Engineer",
    type: "Full-Time",
    location: "Chennai",
    department: "Technology",
    desc: "Support our design and sales teams with technical expertise. Bridge the gap between visionary design and practical implementation.",
    requirements: ["Engineering degree preferred", "Knowledge of modular furniture systems", "AutoCAD / 3D modeling skills", "Team collaboration experience"]
  }
];

const CULTURE_ITEMS = [
  { icon: "✦", title: "Creative Freedom", desc: "Work on high-end luxury projects where your vision takes center stage." },
  { icon: "◆", title: "Expert Mentorship", desc: "Learn from veterans with 25+ years of experience in the interior industry." },
  { icon: "▲", title: "Innovation First", desc: "We use state-of-the-art tools and technologies to stay ahead of the curve." },
  { icon: "●", title: "Growth Path", desc: "Clear career progression with regular appraisals and skill development programs." }
];

const JobCard = ({ job, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div 
      className="career-job-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      layout
    >
      <div className="job-card-top">
        <div className="job-badges">
          <span className="badge-type">{job.type}</span>
          <span className="badge-dept">{job.department}</span>
        </div>
        <span className="job-location-tag">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {job.location}
        </span>
      </div>

      <h3 className="job-card-title">{job.title}</h3>
      <p className="job-card-desc">{job.desc}</p>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            className="job-requirements"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4>Requirements</h4>
            <ul>
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="job-card-actions">
        <button className="btn-expand" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show Less' : 'View Details'}
        </button>
        <a 
          href={`mailto:es.cookscape@gmail.com?subject=Application for ${job.title}&body=Hi Cookscape Team,%0D%0A%0D%0AI am interested in applying for the ${job.title} position.%0D%0A%0D%0A[Please attach your resume and a brief introduction here]%0D%0A%0D%0ARegards,%0D%0A[Your Name]`} 
          className="btn-apply"
        >
          Apply Now
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
};

const Careers = () => {
  return (
    <main className="careers-premium-page">
      <Helmet>
        <title>Interior Design Careers in Chennai | Join Cookscape Team</title>
        <meta name="description" content="Build your career in interior design with Cookscape — Chennai's leading interior firm. Open positions for Interior Designers, CRE & Application Engineers. Apply now." />
        <meta name="keywords" content="interior design jobs chennai, interior designer vacancy, cookscape careers, design jobs chennai" />
        <link rel="canonical" href="https://cookscape.in/careers" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Cookscape Interiors" />
        <meta property="og:url" content="https://cookscape.in/careers" />
        <meta property="og:title" content="Interior Design Careers in Chennai | Join Cookscape Team" />
        <meta property="og:description" content="Build your career in interior design with Cookscape — Chennai's leading interior firm. Open positions for Interior Designers, CRE & Application Engineers." />
        <meta property="og:image" content="https://cookscape.in/og-image.jpg" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Interior Design Careers in Chennai | Join Cookscape Team" />
        <meta name="twitter:description" content="Build your career in interior design with Cookscape — Chennai's leading interior firm. Open positions for Interior Designers, CRE & Application Engineers." />
        <meta name="twitter:image" content="https://cookscape.in/og-image.jpg" />

        {/* JobPosting JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Open Positions at Cookscape Interiors",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@type": "JobPosting",
                  "title": "Interior Designer",
                  "description": "Create stunning, functional spaces that inspire. We're looking for creative visionaries with a passion for luxury home interiors.",
                  "datePosted": "2026-01-08",
                  "employmentType": "FULL_TIME",
                  "hiringOrganization": {
                    "@type": "Organization",
                    "name": "Cookscape Interiors",
                    "sameAs": "https://cookscape.in",
                    "logo": "https://cookscape.in/logo.jpeg"
                  },
                  "jobLocation": {
                    "@type": "Place",
                    "address": {
                      "@type": "PostalAddress",
                      "addressLocality": "Chennai",
                      "addressRegion": "Tamil Nadu",
                      "addressCountry": "IN"
                    }
                  }
                }
              },
              {
                "@type": "ListItem",
                "position": 2,
                "item": {
                  "@type": "JobPosting",
                  "title": "Customer Relationship Executive",
                  "description": "Be the bridge between our brand and cherished clients — ensuring a seamless, delightful journey from consultation to handover.",
                  "datePosted": "2026-01-08",
                  "employmentType": "FULL_TIME",
                  "hiringOrganization": {
                    "@type": "Organization",
                    "name": "Cookscape Interiors",
                    "sameAs": "https://cookscape.in"
                  },
                  "jobLocation": {
                    "@type": "Place",
                    "address": {
                      "@type": "PostalAddress",
                      "addressLocality": "Chennai",
                      "addressRegion": "Tamil Nadu",
                      "addressCountry": "IN"
                    }
                  }
                }
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Premium Hero */}
      <section className="careers-hero-section">
        <div className="careers-hero-bg"></div>
        <div className="container careers-hero-content">
          <motion.span 
            className="careers-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            JOIN OUR TEAM
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Build the Future<br />of <em>Living</em>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            We're looking for passionate individuals to help us transform homes across India.
          </motion.p>
        </div>
      </section>

      {/* Job Listings */}
      <section className="careers-jobs-section">
        <div className="container">
          <div className="careers-section-header">
            <h2>Open Positions</h2>
            <p>{JOBS.length} roles available</p>
          </div>
          <div className="careers-jobs-grid">
            {JOBS.map((job, idx) => (
              <JobCard key={idx} job={job} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="careers-culture-section">
        <div className="container">
          <motion.div 
            className="careers-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Why <em>Cookscape?</em></h2>
            <p>More than just a workplace — a creative home.</p>
          </motion.div>
          <div className="culture-cards-grid">
            {CULTURE_ITEMS.map((item, idx) => (
              <motion.div 
                key={idx}
                className="culture-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <span className="culture-icon">{item.icon}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Careers;

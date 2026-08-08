import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';

// Lazy load non-critical sections
const About = lazy(() => import('../components/About'));
const Services = lazy(() => import('../components/Services'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const Contact = lazy(() => import('../components/Contact'));
const Studios = lazy(() => import('../components/Studios'));
const Footer = lazy(() => import('../components/Footer'));
const FAQ = lazy(() => import("../components/FAQ"));

// Simple loading placeholder
const SectionLoader = () => (
  <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}>
    <div className="loader-dots">
      <span></span><span></span><span></span>
    </div>
  </div>
);

const Home = () => {
  return (
    <main>
      <Helmet>
        <title>Cookscape | Best Interior Design Company in Chennai — Modular Kitchens & Home Interiors</title>
        <meta name="description" content="Cookscape is Chennai's most trusted interior design company with 25+ years of expertise. Premium modular kitchens, wardrobes, full home interiors & luxury renovations across Chennai & Bangalore." />
        <meta name="keywords" content="interior design chennai, modular kitchen chennai, home interiors chennai, wardrobe design chennai, full home interior chennai, luxury interiors, cookscape, best interior designer chennai, home renovation chennai" />
        <link rel="canonical" href="https://cookscape.in/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Cookscape Interiors" />
        <meta property="og:url" content="https://cookscape.in/" />
        <meta property="og:title" content="Cookscape | Best Interior Design Company in Chennai" />
        <meta property="og:description" content="25+ years of luxury interior design excellence. Premium modular kitchens, wardrobes & full home transformations across Chennai & Bangalore." />
        <meta property="og:image" content="https://cookscape.in/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Cookscape Premium Home Interiors Chennai" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cookscape" />
        <meta name="twitter:title" content="Cookscape | Best Interior Design Company in Chennai" />
        <meta name="twitter:description" content="25+ years of luxury interior design excellence. Premium modular kitchens, wardrobes & full home transformations across Chennai & Bangalore." />
        <meta name="twitter:image" content="https://cookscape.in/og-image.jpg" />

        {/* Local Business JSON-LD */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "InteriorDesigner",
            "name": "Cookscape Interiors",
            "alternateName": "Cookscape",
            "image": "https://cookscape.in/logo.jpeg",
            "logo": "https://cookscape.in/logo.jpeg",
            "description": "Chennai's most trusted interior design company with 25+ years of expertise in modular kitchens, wardrobes, and full home interior solutions.",
            "url": "https://cookscape.in",
            "telephone": "+919600005679",
            "email": "contact@cookscape.in",
            "priceRange": "$$$",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "517/338, Anna Salai, Nandanam",
              "addressLocality": "Chennai",
              "addressRegion": "Tamil Nadu",
              "postalCode": "600035",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 13.0261154,
              "longitude": 80.2322999
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                "opens": "10:00",
                "closes": "20:00"
              }
            ],
            "sameAs": [
              "https://www.facebook.com/cookscape/",
              "https://www.instagram.com/cookscape_interior/",
              "https://www.linkedin.com/company/cookscape/"
            ],
            "areaServed": [
              {"@type": "City", "name": "Chennai"},
              {"@type": "City", "name": "Bangalore"}
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Interior Design Services",
              "itemListElement": [
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Modular Kitchen Design"}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Full Home Interiors"}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Wardrobe Design"}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Home Renovation"}}
              ]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "500",
              "bestRating": "5"
            }
          }`}
        </script>
      </Helmet>
      
      <Hero />
      
      <Suspense fallback={<SectionLoader />}>
        <About />
        <Services />
        <Testimonials />
        <FAQ />
        <Contact />
        <Studios />
        <Footer />
      </Suspense>
    </main>
  );
};

export default Home;

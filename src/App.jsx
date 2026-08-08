import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import './PremiumUI.css';
import Home from './pages/Home';
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';
import Careers from './pages/Careers';
import Gallery from './pages/Gallery';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ImageNamer from './pages/ImageNamer';
import Navbar from './components/Navbar';
import FloatingActions from './FloatingActions';
import FestiveOfferModal from './components/FestiveOfferModal';

function AppContent() {
  const location = useLocation();

  // Scroll to top or specific anchor on route change (robust to lazy loaded components)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      let attempts = 0;
      const scrollToElement = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts < 30) { // Poll for up to 3 seconds (30 * 100ms)
          attempts++;
          setTimeout(scrollToElement, 100);
        }
      };
      // Short delay for the initial page load/transition
      setTimeout(scrollToElement, 100);
    } else {
      const queryParams = new URLSearchParams(location.search);
      if (location.pathname === '/portfolio' && queryParams.has('category')) {
        return;
      }
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="app-wrapper">
      {/* 4-Corner Mesh Gradient Background */}
      <div className="bg-mesh"></div>
      
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/portfolio" element={<Gallery />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/rename-gallery" element={<ImageNamer />} />
      </Routes>

      {/* <FestiveOfferModal /> */}
      <FloatingActions />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

export default App;

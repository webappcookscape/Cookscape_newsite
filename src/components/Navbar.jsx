import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "../data/siteData";
import { FiArrowRight } from "react-icons/fi";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu and restore scroll on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "auto";
  }, [location.pathname]);

  // Restore scroll on unmount (safety cleanup)
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? "hidden" : "auto";
  };

  const isDarkHeroPage =
    location.pathname === "/portfolio" || location.pathname === "/careers";

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <>
      <header
        className={`nav-header-premium ${scrolled ? "scrolled" : ""} ${isDarkHeroPage && !scrolled ? "on-dark-hero" : ""} ${isMobileMenuOpen ? "menu-open" : ""}`}
      >
        <nav className="container nav-container-premium">
          <Link to="/" className="logo-link">
            <img src="/logo.jpeg" alt="Cookscape" className="nav-logo" />
          </Link>

          {/* Desktop Menu */}
          <ul className="nav-desktop-menu">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                {link.path.startsWith("/#") ? (
                  <a href={link.path} className="nav-link">
                    {link.name}
                  </a>
                ) : (
                  <Link to={link.path} className="nav-link">
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="nav-cta desktop-only">
            <motion.a
              href="/#contact"
              className="nav-cta-btn"
              whileHover={{
                scale: 1.04,
                y: -3,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 20,
              }}
            >
              <span className="btn-border"></span>

              <span className="btn-content">
                Book Consultation
                <FiArrowRight className="btn-arrow" />
              </span>
            </motion.a>
          </div>

          {/* Mobile CTA Buttons */}
          <div className="nav-mobile-cta">
            <a
              href="tel:+919600005679"
              className="nav-phone-btn-mobile"
              aria-label="Call Us"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.33 2h3a2 2 0 0 1 2 1.72 12.81 12.81 0 0 0 .59 2.81 2 2 0 0 1-.45 2.11L7.09 10.12a16 16 0 0 0 6.79 6.79l1.48-1.48a2 2 0 0 1 2.11-.45 12.81 12.81 0 0 0 2.81.59A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
            <a href="/#contact" className="nav-cta-btn-mobile">
              Book Now
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`mobile-menu-btn ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-fullscreen-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="mobile-menu-inner">
              <ul className="mobile-nav-list">
                {NAV_LINKS.map((link) => (
                  <motion.li key={link.name} variants={itemVariants}>
                    {link.path.startsWith("/#") ? (
                      <a href={link.path} onClick={toggleMenu}>
                        {link.name}
                      </a>
                    ) : (
                      <Link to={link.path} onClick={toggleMenu}>
                        {link.name}
                      </Link>
                    )}
                  </motion.li>
                ))}
                <motion.li variants={itemVariants} className="mt-8">
                  <a
                    href="/#contact"
                    className="mobile-cta-btn"
                    onClick={toggleMenu}
                  >
                    Book Free Consultation
                  </a>
                </motion.li>
              </ul>

              <motion.div
                variants={itemVariants}
                className="mobile-menu-footer"
              >
                <p>Start Your Design Journey</p>
                <a href="tel:+919600005679">+91 96000 05679</a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

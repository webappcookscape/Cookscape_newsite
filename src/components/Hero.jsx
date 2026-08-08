import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="hero">
      {/* Static Background Layer */}
      <div className="hero-layers">
        <div className="midground-text">
          {"COOKSCAPE".split("").map((char, index) => (
            <span 
              key={index} 
              style={{ 
                display: "inline-block", 
                transform: `translateY(${scrollY * (0.1 + index * 0.04)}px)`,
                transition: "transform 0.1s ease-out" 
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Foreground Content */}
      <div className="hero-foreground container">
        <div className="hero-left">
          <h1 className="hero-title">Design & Living<br /><span>That Feel Alive</span></h1>
          <p className="hero-description">We design interiors that feel like home.</p>
          <div className="hero-actions">
          <Link to="/portfolio" className="btn-blue-pill">Our Projects  <svg
        className="btn-arrow"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M5 12h14"/>
        <path d="M13 5l7 7-7 7"/>
    </svg></Link>
          <Link to="/#contact" className="btn-outline-pill">Contact us</Link>
          </div>
        </div>
            {/* <a href="/portfolio" className="btn-blue-pill">Our Projects <span className="arrow-circle">→</span></a>
            <a href="/#contact" className="btn-outline-pill">Contact us</a>
          </div>
        </div> */}

        <div className="hero-center">
          <div 
            className="main-image-wrapper"
            style={{ 
              transform: `translateY(${scrollY * 0.15}px) rotateX(${scrollY * 0.02}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <img 
              src="/hero-image.png" 
              alt="Architectural Visualization" 
              fetchpriority="high"
            />
          </div>
        </div>

        <div className="hero-cards-row">
          {/* Active Users Pill */}
          <div className="active-users-pill reveal">
            <div className="user-avatars">
              <img src="https://i.pravatar.cc/150?u=1" alt="U1" />
              <img src="https://i.pravatar.cc/150?u=2" alt="U2" />
              <img src="https://i.pravatar.cc/150?u=3" alt="U3" />
            </div>
            <span>Happy Clients <strong>+500</strong></span>
          </div>

          <div className="card glass-card">
            <div className="card-body">
              <span className="card-tag gold-tag">PROMOTION</span>
              <h2 className="card-heading promo-big">75% <span className="small-off">Off</span></h2>
              <p className="card-paragraph">On Design Charges for a limited time.</p>
            </div>
            <span className="card-link-icon">↗</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


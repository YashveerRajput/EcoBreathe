import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FeatureCards.css';

const features = [
  { 
    id: 1, 
    title: 'Real-Time AQI', 
    desc: 'Continuous air quality monitoring with live PM2.5, CO₂, and NH3 sensors.',
    icon: '🌬️',
  },
  { 
    id: 2, 
    title: 'WiFi Connected', 
    desc: 'ESP32-powered smart device syncs directly to your phone and cloud dashboard.',
    icon: '📡',
  },
  { 
    id: 3, 
    title: 'Battery Backup', 
    desc: 'Built-in 12V SLA battery ensures uninterrupted monitoring during power cuts.',
    icon: '🔋',
  },
  { 
    id: 4, 
    title: 'HEPA Filtration', 
    desc: 'True HEPA filter captures 99.97% of particles as small as 0.3 microns.',
    icon: '🔵',
  },
  { 
    id: 5, 
    title: 'Smart Dashboard', 
    desc: 'Beautiful web dashboard with historical trends, alerts, and health insights.',
    icon: '📊',
  },
  { 
    id: 6, 
    title: 'Dual Fan System', 
    desc: 'Optimized airflow with dual fans for silent, efficient purification.',
    icon: '⚡',
  },
];

const FeatureCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <div className="feature-carousel-container">
      <div className="feature-cards-wrapper">
        <AnimatePresence initial={false}>
          {features.map((feature, index) => {
            // Logic to determine relative position in the circular carousel
            let position = index - currentIndex;
            if (position < -Math.floor(features.length / 2)) position += features.length;
            if (position > Math.floor(features.length / 2)) position -= features.length;

            const isCenter = position === 0;
            const isVisible = Math.abs(position) <= 2;

            if (!isVisible) return null;

            return (
              <motion.div
                key={feature.id}
                className={`feature-card-3d ${isCenter ? 'center' : ''}`}
                initial={{ 
                    opacity: 0, 
                    scale: 0.6, 
                    x: position > 0 ? 500 : -500,
                    rotateY: position * -45 
                }}
                animate={{
                  opacity: 1 - Math.abs(position) * 0.4,
                  scale: 1 - Math.abs(position) * 0.2,
                  x: position * 420, // Increased distance for full-screen width
                  rotateY: position * -35,
                  zIndex: 10 - Math.abs(position),
                  filter: `blur(${Math.abs(position) * 1.5}px)`
                }}
                exit={{ 
                    opacity: 0, 
                    scale: 0.6, 
                    x: position > 0 ? 500 : -500 
                }}
                transition={{ 
                    type: 'spring', 
                    stiffness: 260, 
                    damping: 20,
                    opacity: { duration: 0.2 }
                }}
              >
                <div className="card-inner">
                    <div className="card-border-glow" />
                    <div className="card-content">
                        <div className="card-top">
                             <span className="card-tag">EcoBreathe Feature</span>
                             <div className="card-line" />
                        </div>
                        
                        <div className="card-main">
                             <div className="card-icon-wrap">
                                {feature.icon}
                             </div>
                             <div className="card-number-large">{feature.id}</div>
                             <h3 className="card-title">{feature.title}</h3>
                             <p className="card-desc">{feature.desc}</p>
                        </div>

                        <div className="card-bottom">
                            <div className="card-line" />
                            <span className="card-footer-text">Smart Air Purifier</span>
                        </div>
                    </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="carousel-controls">
        <button className="control-btn" onClick={handlePrev}>
            <span>Prev</span>
        </button>
        <button className="control-btn" onClick={handleNext}>
            <span>Next</span>
        </button>
      </div>
    </div>
  );
};

export default FeatureCards;

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DustEffect from './DustEffect';
import FeatureCards from './FeatureCards';

const TOTAL_FRAMES = 80;
const FRAME_PATH = (n) => `/motion/ezgif-frame-${String(n).padStart(3, '0')}.jpg`;

const features = [
  { icon: '🌬️', title: 'Real-Time AQI', desc: 'Continuous air quality monitoring with live PM2.5, CO₂, and NH3 sensors.' },
  { icon: '📡', title: 'WiFi Connected', desc: 'ESP32-powered smart device syncs directly to your phone and cloud dashboard.' },
  { icon: '🔋', title: 'Battery Backup', desc: 'Built-in 12V SLA battery ensures uninterrupted monitoring and purification during power cuts.' },
  { icon: '🔵', title: 'HEPA Filtration', desc: 'True HEPA filter captures 99.97% of particles as small as 0.3 microns.' },
  { icon: '📊', title: 'Smart Dashboard', desc: 'Beautiful web dashboard with Real-time AQI, historical trends, alerts, and health insights.' },
  { icon: '⚡', title: 'Dual Fan System', desc: 'Optimized airflow with dual fans for silent, efficient purification.' },
];

const stats = [
  { value: '99.97%', label: 'Filtration Efficiency' },
  { value: '< 1s', label: 'Response Time' },
  { value: '8hr+', label: 'Battery Life' },
  { value: '300 sq.ft', label: 'Coverage Area' },
];

const hardwareComponents = [
  { id: 'mcu', name: 'ESP32 Microcontroller', img: '/components/10.png', desc: 'Dual-core 240MHz processor with built-in WiFi. Acts as the brain of the device, orchestrating sensor data and cloud synchronization.' },
  { id: 'pms', name: 'PMS Particle Sensor', img: '/components/pms.png', desc: 'High-precision laser scattering sensor. Provides accurate real-time readings for PM1.0, PM2.5, and PM10 particulate matter.' },
  { id: 'gas', name: 'Multi-Gas Sensor Array', img: '/components/7.png', desc: 'High-precision MICS-6814 sensor array. Detects harmful Ammonia, Carbon Monoxide, and Nitrogen Dioxide in real-time.' },
  { id: 'filter', name: 'True HEPA H13 Filter', img: '/components/3.png', desc: 'Medical-grade pleated filter. Captures 99.97% of airborne particles as small as 0.3 microns, including dust, pollen, smoke, and PM2.5.' },
  { id: 'display', name: 'OLED Display', img: '/components/5.png', desc: '0.96-inch SSD1306 high-contrast display. Provides immediate, on-device readouts of the current Air Quality Index.' },
  { id: 'battery', name: '12V SLA Battery Backup', img: '/components/4.png', desc: 'Reliable 12V 8Ah sealed lead-acid battery. Ensures continuous, uninterrupted air monitoring even during power outages.' },
  { id: 'solar', name: 'Solar Charging Panel', img: '/components/solar.png', desc: 'Renewable energy interface - 12v 40W solar panel with MPPT charge controller. Allows the device to operate off-grid for continuous outdoor environmental monitoring.' },
  { id: 'fans', name: 'Dual Cooling Fans', img: '/components/9.png', desc: 'High-efficiency brushless 12v DC fans. Draws ambient air , produces 300 CFM airflow rate.' },
  { id: 'buck', name: 'Buck Converter', img: '/components/6.png', desc: 'Precision DC-DC step-down regulator. Converts battery voltage to a stable 5V/3.3V to safely power the MCU and sensitive electronics.' },
  { id: 'gps', name: 'GPS Module', img: '/components/8.png', desc: 'Ublox satellite positioning module. Enables precise geo-tagging of air quality data for mobile mapping and analytics.' }
];

const PANELS = [
  { from: 0.02, to: 0.22, title: 'Meet EcoBreathe', sub: "The world's most connected home air monitor & purifier." },
  { from: 0.26, to: 0.46, title: 'Inside the Technology', sub: 'Multi-sensor fusion. HEPA filtration. WiFi intelligence.' },
  { from: 0.52, to: 0.70, title: '99.97% Pure Air', sub: 'True HEPA H13 captures ultra-fine particles and allergens.' },
  { from: 0.74, to: 0.94, title: 'Always Connected', sub: 'Your air quality. Your phone. Real-time, everywhere.' },
];

export default function LandingPage() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef(0); // last drawn frame index (0-based)
  const rafRef = useRef(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeComponent, setActiveComponent] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  // ─── 1. PRELOAD ALL FRAMES ──────────────────────────────────────────────────
  useEffect(() => {
    let done = 0;
    const imgs = new Array(TOTAL_FRAMES).fill(null);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.onload = () => {
        imgs[i] = img;
        done++;
        setLoadProgress(Math.round((done / TOTAL_FRAMES) * 100));
        if (done === TOTAL_FRAMES) {
          imagesRef.current = imgs;
          setLoaded(true);
        }
      };
      img.onerror = () => {
        done++;
        if (done === TOTAL_FRAMES) {
          imagesRef.current = imgs;
          setLoaded(true);
        }
      };
      img.src = FRAME_PATH(i + 1);
    }
  }, []);

  // ─── 2. DRAW FRAME ──────────────────────────────────────────────────────────
  // Key fix: use canvas.clientWidth/clientHeight (actual CSS-rendered px size,
  // always correct) instead of window.innerWidth/Height (can mismatch).
  // Only resize the buffer when dimensions actually change (resizing clears canvas).
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = imagesRef.current[frameIndex];
    if (!img) return;

    // clientWidth/Height = the element's rendered CSS size in pixels.
    // This is always correct regardless of position:sticky, navbar, zoom, etc.
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (!cw || !ch) return;

    // Only reset internal buffer when dimensions change.
    // Setting canvas.width/height clears the buffer — avoid it on every frame.
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }

    const ctx = canvas.getContext('2d');
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) return;

    // "cover" — scale to fill canvas while keeping aspect ratio
    const scale = Math.max(cw / iw, ch / ih);
    const x = Math.round((cw - iw * scale) / 2);
    const y = Math.round((ch - ih * scale) / 2);

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, iw * scale, ih * scale);
    frameRef.current = frameIndex;
  }, []);

  // ─── 3. DRAW FRAME 1 ONCE LOADED ───────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    // rAF ensures the canvas has rendered dimensions before we read clientWidth
    const id = requestAnimationFrame(() => drawFrame(0));
    return () => cancelAnimationFrame(id);
  }, [loaded, drawFrame]);

  // ─── 4. SCROLL HANDLER ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      // getBoundingClientRect().top is relative to viewport.
      // To get scroll progress we use:  scrollY - sectionTop
      const sectionTop = section.offsetTop;
      const sectionH   = section.offsetHeight;
      const winH       = window.innerHeight;
      const scrollY    = window.scrollY;

      // progress: 0 when section top hits viewport top, 1 when bottom hits viewport bottom
      const scrollable = sectionH - winH;
      const raw = scrollable > 0 ? (scrollY - sectionTop) / scrollable : 0;
      const progress = Math.max(0, Math.min(1, raw));

      setScrollProgress(progress);

      // Map progress to frame index (0-based)
      const idx = Math.round(progress * (TOTAL_FRAMES - 1));

      // Always schedule a redraw — don't skip even if idx is the same,
      // because a CSS resize or scrollbar appearance can clear the canvas.
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(idx));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // sync immediately

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [loaded, drawFrame]);

  // ─── 5. REDRAW ON RESIZE ───────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      // Force buffer-size reset on resize by clearing the last frame ref
      const canvas = canvasRef.current;
      if (canvas) { canvas.width = 0; canvas.height = 0; }
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(frameRef.current));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawFrame]);

  return (
    <div className="landing-root">
      <DustEffect />

      {/* ── LOADING OVERLAY ─────────────────────────────────────── */}
      {!loaded && (
        <div className="loading-overlay">
          <div className="loading-inner">
            <div className="loading-logo">
              <span className="logo-eco">eco</span>
              <span className="logo-breathe">BREATHE</span>
            </div>
            <div className="loading-bar-wrap">
              <div className="loading-bar" style={{ width: `${loadProgress}%` }} />
            </div>
            <p className="loading-text">Loading experience… {loadProgress}%</p>
          </div>
        </div>
      )}

      {/* ── NAVBAR ──────────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="logo-eco">eco</span>
          <span className="logo-breathe">BREATHE</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#specs">Specs</a>
          <a href="https://drive.google.com/file/d/1szpA4xwAIXZqwVm4qGEl3gXjUUtLzDkY/view?usp=drive_link" target="_blank" rel="noreferrer">Documentation</a>
          <a
            href="#dashboard"
            className="nav-cta"
            onClick={(e) => { e.preventDefault(); window.location.hash = 'dashboard'; }}
          >
            Open Dashboard →
          </a>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-bg-glow hero-glow-1" />
        <div className="hero-bg-glow hero-glow-2" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Next-Gen Air Intelligence
          </div>
          <h1 className="hero-title">
            Breathe&nbsp;Smarter.<br />
            <span 
              className="hero-title-gradient thermal-text"
              data-text="Live Better."
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                e.currentTarget.style.setProperty('--thermal-opacity', '1');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.setProperty('--thermal-opacity', '0');
              }}
            >
              Live Better.
            </span>
          </h1>
          <p className="hero-subtitle">
            EcoBreathe combines precision multi-sensor monitoring with HEPA filtration
            and a real-time cloud dashboard — all in one intelligent device.
          </p>
          <div className="hero-ctas">
            <a
              href="#scroll-section"
              className="btn-primary"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('scroll-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore the Device
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
            <a
              href="#dashboard"
              className="btn-secondary"
              onClick={(e) => { e.preventDefault(); window.location.hash = 'dashboard'; }}
            >
              View Dashboard
            </a>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <div className="scroll-mouse"><div className="scroll-wheel" /></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── SCROLL-SCRUBBED SECTION ──────────────────────────────── */}
      {/*
          The outer section is TALL (500vh) to give ample scroll range.
          The inner .canvas-sticky is position:sticky so it pins to viewport
          while the outer section scrolls behind it.
      */}
      <section id="scroll-section" ref={sectionRef} className="canvas-scroll-section">
        <div className="canvas-sticky">
          {/*
            Canvas CSS: display:block fills the sticky div (100vw × 100vh).
            No position:absolute needed — block element fills its container.
            Internal pixel buffer is set in JS using clientWidth/clientHeight.
          */}
          <canvas ref={canvasRef} className="product-canvas" />

          {/* Text panels — fade in/out based on scroll progress */}
          {PANELS.map((p, i) => {
            const visible = scrollProgress >= p.from && scrollProgress <= p.to;
            return (
              <div
                key={i}
                className="scroll-panel"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.35s ease, transform 0.35s ease',
                  pointerEvents: 'none',
                }}
              >
                <h2 className="scroll-panel-title">{p.title}</h2>
                <p className="scroll-panel-sub">{p.sub}</p>
              </div>
            );
          })}

          {/* Side progress indicator */}
          <div className="scroll-progress-bar">
            <div className="scroll-progress-fill" style={{ height: `${scrollProgress * 100}%` }} />
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────── */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div 
                className="stat-value thermal-text"
                data-text={s.value}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                  e.currentTarget.style.setProperty('--thermal-opacity', '1');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('--thermal-opacity', '0');
                }}
              >
                {s.value}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section id="features" className="features-section">
        <div className="section-header">
          <p className="section-eyebrow">Built Different</p>
          <h2 className="section-heading">Every detail engineered<br />for cleaner air.</h2>
        </div>
        <FeatureCards />
      </section>

      {/* ── INTERACTIVE COMPONENT SHOWCASE ────────────────────────── */}
      <div className="showcase-wrapper">
        <section id="specs" className="showcase-section">
          <div className="showcase-header">
            <p className="section-eyebrow">Hardware Architecture</p>
            <h2 className="section-heading">Precision inside & out.</h2>
            <a 
              href="https://drive.google.com/file/d/1szpA4xwAIXZqwVm4qGEl3gXjUUtLzDkY/view?usp=drive_link" 
              target="_blank" 
              rel="noreferrer" 
              className="showcase-doc-link"
            >
              Check out the full project documentation <span>&rarr;</span>
            </a>
          </div>
        
        <div className="showcase-container">
          {/* Left: Interactive List */}
          <div className="showcase-list">
            {hardwareComponents.map((comp, idx) => {
              const isActive = activeComponent === idx;
              return (
                <div
                  key={comp.id}
                  className={`showcase-item ${isActive ? 'active' : ''}`}
                  onMouseEnter={() => setActiveComponent(idx)}
                  onClick={() => setActiveComponent(idx)}
                >
                  <div className="showcase-item-dot" />
                  <span className="showcase-item-name">{comp.name}</span>
                  {isActive && (
                    <motion.div
                      className="showcase-item-bg"
                      layoutId="activeBg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Dynamic Display */}
          <div className="showcase-display">
            <div className="showcase-glow" />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeComponent}
                className="showcase-active-content"
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="showcase-image-wrap">
                  <motion.img 
                    src={hardwareComponents[activeComponent].img} 
                    alt={hardwareComponents[activeComponent].name}
                    className="showcase-image"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <div className="showcase-details">
                  <h3 className="showcase-details-title">{hardwareComponents[activeComponent].name}</h3>
                  <p className="showcase-details-desc">{hardwareComponents[activeComponent].desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
      </div>

      {/* ── PROJECT GALLERY ─────────────────────────────────────── */}
      <section id="gallery" className="gallery-section">
        <div className="section-header">
          <p className="section-eyebrow">Project Showcase</p>
          <h2 className="section-heading">Design & Development</h2>
        </div>
        <div className="gallery-grid">
          <div className="gallery-item" onClick={() => setSelectedImage('/display_images/device_render_2.png')}>
            <img src="/display_images/device_render_2.png" alt="Product Engineering" className="gallery-image" />
            <div className="gallery-overlay">
              <span>Front View</span>
            </div>
          </div>
          <div className="gallery-item" onClick={() => setSelectedImage('/display_images/device_render_1.png')}>
            <img src="/display_images/device_render_1.png" alt="Clean Air Outlet Design" className="gallery-image" />
            <div className="gallery-overlay">
              <span>Internal Archeitecture</span>
            </div>
          </div>
          <div className="gallery-item" onClick={() => setSelectedImage('/display_images/device_render_3.png')}>
            <img src="/display_images/device_render_3.png" alt="Final Hardware Enclosure" className="gallery-image" />
            <div className="gallery-overlay" >
              <span>Back View</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <h2 
          className="cta-heading thermal-text"
          data-text="Ready for cleaner air?"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            e.currentTarget.style.setProperty('--thermal-opacity', '1');
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.setProperty('--thermal-opacity', '0');
          }}
        >
          Ready for cleaner air?
        </h2>
        <p className="cta-sub">Open your real-time dashboard and see your air quality right now.</p>
        <a
          href="#dashboard"
          className="btn-primary btn-large"
          onClick={(e) => { e.preventDefault(); window.location.hash = 'dashboard'; }}
        >
          Launch Dashboard
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <span className="logo-eco">eco</span>
          <span className="logo-breathe">BREATHE</span>
        </div>
        <p className="footer-tagline">© 2025 EcoBreathe. Built with ❤️ for cleaner air.</p>
      </footer>

      {/* ── IMAGE LIGHTBOX ──────────────────────────────────────── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <motion.img
              src={selectedImage}
              alt="Expanded view"
              className="lightbox-image"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

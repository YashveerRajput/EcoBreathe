import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wind, Droplets, Thermometer, Activity, Zap, RefreshCw, Settings, ShieldCheck, ArrowUpRight, ExternalLink, MapPin, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import PollutantDetailsModal from './PollutantDetailsModal';

const API_BASE = import.meta.env.PROD ? 'https://ecobreathe-awv5.onrender.com/api' : 'http://localhost:5000/api';

const App = () => {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPollutant, setSelectedPollutant] = useState(null);

  const fetchData = async () => {
    try {
      const [dataRes, historyRes] = await Promise.all([
        axios.get(`${API_BASE}/aqi/current`),
        axios.get(`${API_BASE}/aqi/history`)
      ]);
      setData(dataRes.data);
      setHistory(historyRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: '#10b981', desc: 'Air quality is satisfactory.' };
    if (aqi <= 100) return { label: 'Moderate', color: '#eab308', desc: 'Acceptable air quality.' };
    if (aqi <= 150) return { label: 'Poor', color: '#f97316', desc: 'May cause breathing discomfort.' };
    if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', desc: 'Health effects may be serious.' };
    if (aqi <= 300) return { label: 'Severe', color: '#a855f7', desc: 'Health warnings of emergency conditions.' };
    return { label: 'Hazardous', color: '#7f1d1d', desc: 'Health alert: everyone may experience more serious health effects.' };
  };

  const getReadingStatus = (type, value) => {
    const standards = {
      pm25: [30, 60, 90, 120, 250],
      pm10: [50, 100, 250, 350, 430],
      co: [1, 2, 10, 17, 34],
      no2: [40, 80, 180, 280, 400],
      nh3: [0.2, 0.6, 2.0, 3.0, 5.0]
    };
    const labels = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe'];
    const colors = ['#10b981', '#84cc16', '#f59e0b', '#f97316', '#ef4444', '#7f1d1d'];
    
    const thresholds = standards[type.toLowerCase()] || standards['pm25'];
    let index = 0;
    while(index < thresholds.length && value > thresholds[index]) index++;
    
    return { label: labels[index], color: colors[index] };
  };

  const getSafetyAdvice = (aqi) => {
    if (aqi <= 50) return { title: "Clear Air", advice: "Air quality is ideal. Feel free to open windows and engage in outdoor activities.", color: "#10b981" };
    if (aqi <= 100) return { title: "Moderate Air", advice: "Air quality is acceptable. Sensitive groups should monitor symptoms if outdoors.", color: "#eab308" };
    if (aqi <= 150) return { title: "Sensitive Groups Alert", advice: "Limit prolonged outdoor exertion. Consider using air purifiers in living areas.", color: "#f97316" };
    if (aqi <= 200) return { title: "Unhealthy Air", advice: "Wear an N95 mask outdoors. Keep windows closed and run air purifiers on high.", color: "#ef4444" };
    if (aqi <= 300) return { title: "Very Unhealthy", advice: "Avoid all outdoor activities. Seal window gaps and stay in rooms with filtration.", color: "#a855f7" };
    return { title: "Hazardous Conditions", advice: "Emergency conditions. Evacuate to a cleaner area or use advanced filtration.", color: "#7f1d1d" };
  };

  const isStale = data ? (Date.now() - new Date(data.lastUpdated).getTime()) > 30000 : true;

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <RefreshCw size={40} color="#4f46e5" />
        </motion.div>
      </div>
    );
  }

  const status = getAQIStatus(data.aqi);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="dashboard">
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <section className="glass-card aqi-gauge-container">
                <div className="glow" style={{ background: status.color }}></div>
                <p className="aqi-label">Current AQI Index</p>
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="aqi-value" style={{ color: status.color }}>
                  {data.aqi}
                </motion.div>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{status.label}</h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '250px' }}>{status.desc}</p>
                </div>
              </section>

              <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>Live Pollutant Readings</h3>
                  <div className={`status-badge ${isStale ? 'offline' : 'online'}`}>{isStale ? 'OFFLINE' : 'LIVE'}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1 }}>
                  <SmallReadingCard label="PM2.5" value={data.pm25} unit="µg/m³" status={getReadingStatus('pm25', data.pm25)} />
                  <SmallReadingCard label="PM10" value={data.pm10} unit="µg/m³" status={getReadingStatus('pm10', data.pm10)} />
                  <SmallReadingCard label="CO" value={data.co} unit="ppm" status={getReadingStatus('co', data.co)} />
                  <SmallReadingCard label="NO2" value={data.no2} unit="µg/m³" status={getReadingStatus('no2', data.no2)} />
                  <div style={{ gridColumn: 'span 2' }}>
                    <SmallReadingCard label="NH3" value={data.nh3 !== undefined ? data.nh3 : data.vocs} unit="ppm" status={getReadingStatus('nh3', data.nh3 !== undefined ? data.nh3 : data.vocs)} horizontal />
                  </div>
                </div>
              </section>
            </div>

            <div className="glass-card" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Air Quality Scale</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ textAlign: 'center', flex: '1 1 15%' }}><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Good</div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>0-50</div></div>
                <div style={{ textAlign: 'center', flex: '1 1 15%' }}><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Moderate</div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>51-100</div></div>
                <div style={{ textAlign: 'center', flex: '1 1 15%' }}><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Poor</div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>101-150</div></div>
                <div style={{ textAlign: 'center', flex: '1 1 15%' }}><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Unhealthy</div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>151-200</div></div>
                <div style={{ textAlign: 'center', flex: '1 1 15%' }}><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Severe</div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>201-300</div></div>
                <div style={{ textAlign: 'center', flex: '1 1 15%' }}><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Hazardous</div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>301-500+</div></div>
              </div>
              <div style={{ position: 'relative', height: '16px', borderRadius: '8px', display: 'flex', overflow: 'hidden' }}>
                <div style={{ flex: 1, background: '#10b981' }}></div>
                <div style={{ flex: 1, background: '#eab308' }}></div>
                <div style={{ flex: 1, background: '#f97316' }}></div>
                <div style={{ flex: 1, background: '#ef4444' }}></div>
                <div style={{ flex: 1, background: '#a855f7' }}></div>
                <div style={{ flex: 1, background: '#7f1d1d' }}></div>
              </div>
              <div style={{ position: 'relative', marginTop: '-20px' }}>
                <div style={{
                  position: 'absolute',
                  left: `calc(${
                    data.aqi <= 50 ? (data.aqi / 50) * 16.66 :
                    data.aqi <= 100 ? 16.66 + ((data.aqi - 50) / 50) * 16.66 :
                    data.aqi <= 150 ? 33.33 + ((data.aqi - 100) / 50) * 16.66 :
                    data.aqi <= 200 ? 50 + ((data.aqi - 150) / 50) * 16.66 :
                    data.aqi <= 300 ? 66.66 + ((data.aqi - 200) / 100) * 16.66 :
                    Math.min(100, 83.33 + ((data.aqi - 300) / 200) * 16.66)
                  }% - 12px)`,
                  width: '24px',
                  height: '24px',
                  background: '#fff',
                  border: '4px solid #1e1e30',
                  borderRadius: '50%',
                  top: '-4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  transition: 'left 1s ease'
                }} />
              </div>
            </div>

            <section className="glass-card chart-container" style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>AQI Trend (Last 24 Hours)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={history} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ background: '#1e1e30', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                  <Bar dataKey="aqi" radius={[6, 6, 0, 0]}>
                    {history.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getAQIStatus(entry.aqi).color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </section>
          </motion.div>
        );
      case 'pollutants':
        return (
          <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="pollutants">
            <h2 className="section-title">Current Pollutants Breakdown</h2>
            <div className="glass-card" style={{ padding: 0 }}>
              <PollutantRow name="PM2.5" fullName="Fine Particulate Matter" value={data.pm25} unit="µg/m³" status={getReadingStatus('pm25', data.pm25).label} desc="Particles less than 2.5µm that enter the lungs and bloodstream." onSelect={setSelectedPollutant} />
              <PollutantRow name="PM10" fullName="Coarse Particulate Matter" value={data.pm10} unit="µg/m³" status={getReadingStatus('pm10', data.pm10).label} desc="Inhalable particles between 2.5 and 10µm deposited in airways." onSelect={setSelectedPollutant} />
              <PollutantRow name="NO2" fullName="Nitrogen Dioxide" value={data.no2} unit="µg/m³" status={getReadingStatus('no2', data.no2).label} desc="Gas linked to increased risk of respiratory problems." onSelect={setSelectedPollutant} />
              <PollutantRow name="CO" fullName="Carbon Monoxide" value={data.co} unit="ppm" status={getReadingStatus('co', data.co).label} desc="Colourless gas that can cause headache and nausea." onSelect={setSelectedPollutant} />
              <PollutantRow name="NH3" fullName="Ammonia" value={data.nh3 !== undefined ? data.nh3 : data.vocs} unit="ppm" status={getReadingStatus('nh3', data.nh3 !== undefined ? data.nh3 : data.vocs).label} desc="Colorless gas with a distinct odor, can irritate eyes and respiratory tract." onSelect={setSelectedPollutant} />
            </div>
          </motion.section>
        );
      case 'scale':
        return (
          <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="scale">
            <h2 className="section-title">Air Quality Scale</h2>
            <div className="impact-grid">
              <ScaleCard type="good" title="Good" range="0-50" advice={["Minimal health risk", "Safe for all groups", "Normal outdoor activities recommended"]} />
              <ScaleCard type="moderate" title="Moderate" range="51-100" advice={["Acceptable air quality", "Sensitive people should reduce outdoor exertion"]} />
              <ScaleCard type="poor" title="Poor" range="101-150" advice={["Unhealthy for sensitive groups", "Increased symptoms for heart/lung disease"]} />
              <ScaleCard type="unhealthy" title="Unhealthy" range="151-200" advice={["Everyone may begin to feel health effects", "Serious health effects for sensitive groups"]} />
              <ScaleCard type="severe" title="Severe" range="201-300" advice={["Health warnings of emergency conditions", "Entire population is likely to be affected"]} />
              <ScaleCard type="hazardous" title="Hazardous" range="301-500+" advice={["Serious health effects for everyone", "Emergency conditions", "Use N95 masks if you go out"]} />
            </div>
          </motion.section>
        );
      case 'protection':
        const safety = getSafetyAdvice(data.aqi);
        return (
          <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="protection">
            <h2 className="section-title">Safety & Recommendations</h2>
            
            {/* Dynamic Advice Card */}
            <div className="glass-card" style={{ marginBottom: '2rem', borderLeft: `6px solid ${safety.color}`, background: `${safety.color}05` }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ background: `${safety.color}20`, padding: '1rem', borderRadius: '16px', color: safety.color }}>
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: safety.color }}>{safety.title} Recommendation</h3>
                  <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>{safety.advice}</p>
                </div>
              </div>
            </div>

            <h3 className="section-subtitle" style={{ marginBottom: '1.5rem' }}>General Protection Methods</h3>
            <div className="impact-grid" style={{ marginBottom: '3rem' }}>
              <MethodCard title="Use HEPA Air Purifiers" efficiency="High" desc="HEPA filters capture 99.97% of particles 0.3 microns or larger." />
              <MethodCard title="Close Doors & Windows" efficiency="High" desc="Keep outdoor pollutants out by sealing your home when AQI is high." />
              <MethodCard title="Wear N95/P100 Masks" efficiency="High" desc="Use certified masks for outdoor activities on high pollution days." />
              <MethodCard title="Avoid Indoor Smoking" efficiency="High" desc="Cigarette smoke is a major source of PM2.5 indoors." />
              <MethodCard title="Proper Kitchen Ventilation" efficiency="High" desc="Use exhaust fans while cooking to remove PM2.5 releases." />
              <MethodCard title="Limit Outdoor Exercise" efficiency="Medium" desc="Reduce heavy physical exertion outdoors when air quality is poor." />
              <MethodCard title="Wet Mopping Only" efficiency="Medium" desc="Dry sweeping kicks dust into the air. Use wet mops instead." />
              <MethodCard title="Indoor Air Plants" efficiency="Low" desc="Snake plants and Peace Lilies can help filter minor indoor toxins." />
            </div>
            <div className="impact-banner" style={{ marginTop: '2rem' }}>
              <ShieldCheck size={40} color="#ef4444" />
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>Understanding the Impact</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Research shows that breathing air with an AQI of 75 for 24 hours is equivalent to smoking one cigarette. Take these levels seriously to protect your long-term health.</p>
              </div>
            </div>
          </motion.section>
        );
    }
  };

  return (
    <div className="dashboard-container app-content">
      {/* Header - Stays visible */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>EcoBreathe</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Smart Air Intelligence</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <MapPin size={12} color="#10b981" /> New Delhi, India
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: window.innerWidth <= 768 ? '1rem' : '0' }} className="header-actions">
            <div>
                <a href="#" className="btn-secondary">View Device</a>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <span className={`status-badge ${isStale ? 'offline' : 'online'}`} style={{ color: isStale ? '#ef4444' : '#10b981' }}>
                    {isStale ? 'Device Offline' : 'Device Online'}
                </span>
            </div>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      <nav className="bottom-nav">
        <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Activity size={20} />} label="Dashboard" />
        <NavButton active={activeTab === 'pollutants'} onClick={() => setActiveTab('pollutants')} icon={<Wind size={20} />} label="Pollutants" />
        <NavButton active={activeTab === 'scale'} onClick={() => setActiveTab('scale')} icon={<ArrowUpRight size={20} />} label="Scale" />
        <NavButton active={activeTab === 'protection'} onClick={() => setActiveTab('protection')} icon={<ShieldCheck size={20} />} label="Safety" />
      </nav>

      <AnimatePresence>
        {selectedPollutant && (
          <PollutantDetailsModal 
            pollutantId={selectedPollutant} 
            onClose={() => setSelectedPollutant(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }) => (
  <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    {icon}
    <span>{label}</span>
  </div>
);

const MetricItem = ({ icon, label, value, unit }) => (
  <motion.div whileHover={{ scale: 1.05 }} className="glass-card metric-card">
    <div className="metric-icon" style={{ background: 'rgba(255,255,255,0.03)' }}>
      {icon}
    </div>
    <h3>{label}</h3>
    <div className="value">
      {value}<span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>{unit}</span>
    </div>
  </motion.div>
);

const PollutantRow = ({ name, fullName, value, unit, status, desc, onSelect }) => (
  <div className="pollutant-card">
    <div className="pollutant-info">
      <div className="pollutant-symbol">{name}</div>
      <div className="pollutant-details">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => onSelect(name)} className="pollutant-title-wrap">
          <span className="pollutant-title">{fullName}</span>
          <ExternalLink size={14} color="var(--text-secondary)" className="external-link-icon" />
        </div>
        <p className="pollutant-desc">{desc}</p>
      </div>
    </div>
    <div className="pollutant-stats">
      <div className="pollutant-reading">
        {value} <span className="pollutant-unit">{unit}</span>
      </div>
      <div className={`status-tag tag-${status.toLowerCase().replace(' ', '-')}`}>
        {status}
      </div>
    </div>
  </div>
);

const ScaleCard = ({ type, title, range, advice }) => (
  <div className={`glass-card scale-card ${type}`}>
    <div className="scale-range">{range}</div>
    <h4>{title}</h4>
    <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
      {advice.map((item, idx) => (
        <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
          <span style={{ color: 'var(--success)' }}>•</span> {item}
        </li>
      ))}
    </ul>
  </div>
);

const MethodCard = ({ title, efficiency, desc }) => (
  <div className="method-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h4 style={{ fontSize: '1rem' }}>{title}</h4>
      <div className="efficiency-badge" style={{ 
        background: efficiency === 'High' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
        color: efficiency === 'High' ? 'var(--success)' : 'var(--warning)'
      }}>
        {efficiency}
      </div>
    </div>
    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{desc}</p>
  </div>
);

const SmallReadingCard = ({ label, value, unit, status, horizontal }) => (
  <div className="glass-card" style={{ 
    padding: '0.75rem 1rem', 
    display: 'flex', 
    flexDirection: horizontal ? 'row' : 'column',
    justifyContent: horizontal ? 'space-between' : 'center',
    alignItems: horizontal ? 'center' : 'flex-start',
    gap: '0.25rem',
    background: 'rgba(255,255,255,0.02)',
    borderLeft: `4px solid ${status.color}`
  }}>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: status.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {status.label}
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
      <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{value}</span>
      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{unit}</span>
    </div>
  </div>
);

const HealthImpactCard = ({ level, range, color, points }) => (
  <div className="glass-card" style={{ 
    padding: '1.5rem', 
    borderLeft: `4px solid ${color}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'relative'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>{level}</h4>
      <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '6px', color: 'var(--text-secondary)' }}>{range}</span>
    </div>
    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {points.map((p, i) => (
        <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <span style={{ color: color, fontSize: '1.2rem', lineHeight: '1' }}>•</span>
          {p}
        </li>
      ))}
    </ul>
  </div>
);

export default App;

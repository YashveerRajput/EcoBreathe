import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Wind, Home, Factory, Zap, Trash2, Truck, Flame, 
  Building2, Tractor, TreePine, Cog, 
  Car, CookingPot, Heater, Cigarette,
  AlertTriangle
} from 'lucide-react';

const pollutantData = {
  'PM2.5': {
    title: 'Fine Particulate Matter (PM2.5)',
    explanation: 'PM2.5 particles, with a diameter of 2.5 micrometers or less, are approximately 30 times smaller than a human hair, making them a significant yet often unseen threat to air quality.',
    hasSizeGraphic: true,
    causes: [
      { icon: <Wind size={20} />, title: 'Windblown Dust', desc: 'Daily activities like construction or other practices' },
      { icon: <Home size={20} />, title: 'Home-related emission', desc: 'Household activities, such as cooking and heating' },
      { icon: <Factory size={20} />, title: "Factories and industries' emission", desc: 'Regular operations in factories and industries' },
      { icon: <Zap size={20} />, title: 'Power plants generation', desc: 'Emission from Routine energy production in power plants' },
      { icon: <Trash2 size={20} />, title: 'Landfill fires', desc: 'Fires in landfills, often caused by waste mismanagement' },
      { icon: <Truck size={20} />, title: 'Transportation emission', desc: 'Diesel operated Daily vehicles produces exhaust' },
      { icon: <Flame size={20} />, title: 'Human-caused emissions', desc: 'Common practices like open burning of waste or agricultural residues' }
    ],
    effects: [
      { img: '/assets/effects/eye.png', title: 'Irritation in Eyes', desc: 'Redness, itching, and discomfort in your eyes' },
      { img: '/assets/effects/headache.png', title: 'Headaches', desc: 'Frequent or intense headaches.' },
      { img: '/assets/effects/fatigue.png', title: 'Fatigue', desc: 'Feeling unusually tired or weak.' },
      { img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', title: 'Aggravated asthma', desc: 'Increased asthma attacks and symptoms.' },
      { img: '/assets/effects/coughing.png', title: 'Breathing problems', desc: 'Coughing, wheezing, and shortness of breath.' }
    ]
  },
  'PM10': {
    title: 'Coarse Particulate Matter (PM10)',
    explanation: 'PM10 refers to inhalable particles with diameters that are generally 10 micrometers and smaller. While larger than PM2.5, they easily bypass the nose and throat, penetrating deep into the lungs.',
    hasSizeGraphic: true,
    causes: [
      { icon: <Building2 size={20} />, title: 'Construction Dust', desc: 'Dust generated from construction sites and unpaved roads' },
      { icon: <Tractor size={20} />, title: 'Agriculture', desc: 'Plowing, harvesting, and field burning activities' },
      { icon: <TreePine size={20} />, title: 'Wildfires', desc: 'Smoke and ash from large-scale forest fires' },
      { icon: <Cog size={20} />, title: 'Industrial Processes', desc: 'Crushing, grinding, and material handling operations' }
    ],
    effects: [
      { img: '/assets/effects/coughing.png', title: 'Throat Irritation', desc: 'Dryness, scratchiness, and persistent coughing' },
      { img: '/assets/effects/eye.png', title: 'Allergy Symptoms', desc: 'Sneezing, runny nose, and worsened hay fever' },
      { img: '/assets/effects/fatigue.png', title: 'Chest Tightness', desc: 'Discomfort and tightness in the chest area' },
      { img: '/assets/effects/coughing.png', title: 'Asthma Exacerbation', desc: 'Triggering of pre-existing asthma conditions' }
    ]
  },
  'NO2': {
    title: 'Nitrogen Dioxide (NO2)',
    explanation: 'Nitrogen Dioxide (NO2) is a highly reactive, reddish-brown gas with a pungent odor. It primarily gets in the air from the burning of fuel and is a major component of urban smog.',
    hasSizeGraphic: false,
    causes: [
      { icon: <Car size={20} />, title: 'Vehicle Exhaust', desc: 'Especially from heavy-duty diesel engines' },
      { icon: <Zap size={20} />, title: 'Power Plants', desc: 'Emissions from burning fossil fuels like coal and gas' },
      { icon: <CookingPot size={20} />, title: 'Indoor Gas Stoves', desc: 'Unvented heaters and gas stoves in homes' },
      { icon: <Factory size={20} />, title: 'Industrial Boilers', desc: 'High-temperature combustion processes in industry' }
    ],
    effects: [
      { img: '/assets/effects/coughing.png', title: 'Airway Inflammation', desc: 'Swelling and irritation of the respiratory tract' },
      { img: '/assets/effects/fatigue.png', title: 'Decreased Lung Function', desc: 'Reduced ability to breathe deeply and effectively' },
      { img: '/assets/effects/coughing.png', title: 'Respiratory Infections', desc: 'Increased susceptibility to illnesses like bronchitis' },
      { img: '/assets/effects/coughing.png', title: 'Worsened Coughing', desc: 'Chronic cough and wheezing, especially in children' }
    ]
  },
  'CO': {
    title: 'Carbon Monoxide (CO)',
    explanation: 'Carbon Monoxide (CO) is a colorless, odorless, and tasteless gas produced by the incomplete combustion of carbon-containing fuels. It dangerously reduces the blood\'s ability to carry oxygen.',
    hasSizeGraphic: false,
    causes: [
      { icon: <Car size={20} />, title: 'Car Exhaust', desc: 'Emissions from internal combustion engines' },
      { icon: <Heater size={20} />, title: 'Gas & Wood Stoves', desc: 'Improperly ventilated indoor heating sources' },
      { icon: <Zap size={20} />, title: 'Generators', desc: 'Running portable generators in enclosed spaces' },
      { icon: <Cigarette size={20} />, title: 'Tobacco Smoke', desc: 'Secondhand smoke in indoor environments' }
    ],
    effects: [
      { img: '/assets/effects/headache.png', title: 'Dizziness', desc: 'Feeling lightheaded, unsteady, or faint' },
      { img: '/assets/effects/nausea.png', title: 'Nausea', desc: 'Stomach discomfort and urge to vomit' },
      { img: '/assets/effects/headache.png', title: 'Confusion', desc: 'Impaired thinking, disorientation, and memory issues' },
      { img: '/assets/effects/fatigue.png', title: 'Weakness', desc: 'Lethargy, muscle weakness, and loss of coordination' }
    ]
  },
  'VOCs': {
    title: 'Volatile Organic Compounds (VOCs)',
    explanation: 'VOCs are emitted as gases from certain solids or liquids. They include a variety of chemicals, some of which may have short- and long-term adverse health effects.',
    hasSizeGraphic: false,
    causes: [
      { icon: <Home size={20} />, title: 'Household Products', desc: 'Paints, varnishes, and wax' },
      { icon: <Building2 size={20} />, title: 'Cleaning Supplies', desc: 'Many common cleaning and disinfecting chemicals' },
      { icon: <Factory size={20} />, title: 'Building Materials', desc: 'Off-gassing from new furniture, carpets, and adhesives' },
      { icon: <Car size={20} />, title: 'Office Equipment', desc: 'Copiers, printers, and correction fluids' }
    ],
    effects: [
      { img: '/assets/effects/eye.png', title: 'Eye & Nose Irritation', desc: 'Burning sensation in eyes and nasal passages' },
      { img: '/assets/effects/headache.png', title: 'Headaches', desc: 'Throbbing or dull pain in the head' },
      { img: '/assets/effects/nausea.png', title: 'Nausea', desc: 'Feeling of sickness and upset stomach' },
      { img: '/assets/effects/eye.png', title: 'Allergic Skin Reaction', desc: 'Rashes, redness, or itching on the skin' }
    ]
  }
};

const PollutantDetailsModal = ({ pollutantId, onClose }) => {
  const data = pollutantData[pollutantId];

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!data) return null;

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="modal-content glass-card"
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-scroll-area">
          {/* Header & Explanation */}
          <section className="modal-section explanation-section">
            <h2 className="modal-title gradient-text">{data.title}</h2>
            
            <div className="explanation-container">
              <div className="explanation-text-block">
                <div className="red-line"></div>
                <p>{data.explanation}</p>
              </div>
              
              {data.hasSizeGraphic && (
                <div className="size-graphic-container">
                  <div className="particle-wrapper">
                    <div className="human-hair-graphic">
                      <div className="hair-layer"></div>
                      <span className="hair-label">Human Hair<br/>50-70 µm</span>
                      
                      <div className="pm10-dot">
                        <span className="pm-label">PM10<br/>&lt;10 µm</span>
                        <div className="connecting-line line-10"></div>
                      </div>
                      
                      <div className="pm25-dot">
                        <span className="pm-label">PM2.5<br/>&lt;2.5 µm</span>
                        <div className="connecting-line line-25"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Causes Section */}
          <section className="modal-section">
            <h3 className="section-subtitle">Uncovering the Sources: Where Does It Come From?</h3>
            <div className="causes-grid">
              {data.causes.map((cause, idx) => (
                <motion.div 
                  className="cause-card" 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (idx * 0.05) }}
                >
                  <div className="cause-icon-wrap">
                    {cause.icon}
                  </div>
                  <div className="cause-text">
                    <h4>{cause.title}</h4>
                    <p>{cause.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Effects Section */}
          <section className="modal-section">
            <h3 className="section-subtitle">Short-Term Exposure Impacts</h3>
            <div className="effects-grid">
              {data.effects.map((effect, idx) => (
                <motion.div 
                  className="effect-card" 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.05) }}
                >
                  <div className="effect-image" style={{ backgroundImage: `url(${effect.img})` }}></div>
                  <div className="effect-text">
                    <h4>{effect.title}</h4>
                    <p>{effect.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PollutantDetailsModal;

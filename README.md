<div align="center">

<h1>🌿 EcoBreathe</h1>
<h5>Note : The air monitoring device components , esp , firbase connections and codes are available in Eco-Breathe Full Project Documentation  </h5>

<p><strong>A high-end landing page for the EcoBreathe air purifier and a real-time air quality monitoring dashboard with live hardware sensor integration.</strong></p>

![Hero Preview](screenshots/screenshot_01_hero.png)

<p>
  <a href="https://eco-breathe-two.vercel.app/" target="_blank"><img src="https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel" /></a>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Firebase-Realtime%20DB-FFCA28?style=for-the-badge&logo=firebase" />
  <img src="https://img.shields.io/badge/Hardware-ESP32-E7352C?style=for-the-badge&logo=espressif" />
</p>

</div>

---

## 📖 Overview

EcoBreathe is a full-stack IoT ecosystem built around a custom-engineered air purifier device. The project consists of two interconnected parts:

1. **A premium product landing page** — An "Apple-style" showcase for the EcoBreathe air purifier, built with scroll-driven animations, 3D interactive components, and glassmorphic design.
2. **A real-time AQI monitoring dashboard** — A live data dashboard connected to a physical hardware sensor (ESP32-based) via Firebase Realtime Database, displaying PM2.5, PM1, PM10, NH₃, NO₂, and CO levels.

> **Live Site:** [https://eco-breathe-two.vercel.app/](https://eco-breathe-two.vercel.app/)
> **Backend API:** [https://ecobreathe-awv5.onrender.com/api](https://ecobreathe-awv5.onrender.com/api)

---

## 🗂️ Table of Contents

- [Landing Page Features](#-landing-page-features)
  - [Hero Section](#1-hero-section)
  - [Scroll-Driven Product Animation](#2-scroll-driven-product-animation)
  - [Stats Section](#3-stats-section)
  - [3D Feature Carousel](#4-3d-feature-carousel)
  - [Hardware Architecture Showcase](#5-hardware-architecture-showcase)
  - [Project Gallery](#6-project-gallery)
- [Dashboard Features](#-dashboard-features)
  - [Main Dashboard](#1-main-dashboard)
  - [Pollutants Tab](#2-pollutants-tab)
  - [Pollutant Detail Modal](#3-pollutant-detail-modal)
  - [AQI Scale Tab](#4-aqi-scale-tab)
  - [Safety & Recommendations Tab](#5-safety--recommendations-tab)
- [Hardware Integration](#-hardware-integration)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)

---

## 🌐 Landing Page Features

### 1. Hero Section

![Hero Section](screenshots/screenshot_01_hero.png)

The landing page opens with a cinematic hero section featuring:

- **Animated Dust Particle Effect** — A full-screen canvas animation simulates dust particles floating and being cleaned from the air, reinforcing the product's purpose visually.
- **Thermal Typography** — The headline *"Live Better."* has an interactive thermal/heat-map hover effect. Moving the mouse over the text reveals a radial gradient color shift, mimicking an infrared camera effect.
- **Dual CTAs** — "Explore the Device" smoothly scrolls to the scroll-animation section; "View Dashboard" routes directly to the live monitoring dashboard.
- **Glassmorphic Navbar** — The navigation bar features a frosted-glass blur effect with links to Features, Specs, Documentation, and the Dashboard.
- **Animated Loading Screen** — Before the page displays, a branded loading overlay preloads all 80 animation frames for the product scroll sequence, showing a live percentage progress bar.

---

### 2. Scroll-Driven Product Animation

The signature feature of the landing page. A 500vh tall scroll section pins the product to the viewport and plays through **80 pre-rendered animation frames** as the user scrolls, creating a smooth cinematic product reveal — similar to Apple product pages.

**How it works:**
- 80 JPEG frames of the product rotating/revealing are preloaded on page load.
- A scroll event listener maps the user's scroll position (0–100%) to a frame index (0–79).
- The frame is drawn onto an HTML5 `<canvas>` using a "cover" scale algorithm to fill the screen regardless of viewport size.
- Four **text panels** fade in and out at specific scroll progress milestones:
  - `2%–22%` → *"Meet EcoBreathe"*
  - `26%–46%` → *"Inside the Technology"*
  - `52%–70%` → *"99.97% Pure Air"*
  - `74%–94%` → *"Always Connected"*
- A **side progress indicator** bar shows the user's scroll depth through the section.

---

### 3. Stats Section

After the scroll animation, four key performance metrics are displayed in a clean grid with thermal hover effects:

| Stat | Value |
|------|-------|
| Filtration Efficiency | 99.97% |
| Sensor Response Time | < 1 second |
| Battery Life | 8 hours+ |
| Coverage Area | 300 sq.ft |

---

### 4. 3D Feature Carousel

![Feature Carousel](screenshots/screenshot_05_features_carousel.png)

A custom-built **3D rotating card carousel** powered by Framer Motion showcasing six core product features. 

**Key design details:**
- Cards use **genuine 3D perspective transforms** (`rotateY`) so side cards appear to recede into the background.
- Cards further from center are progressively: scaled down, blurred, and reduced in opacity — creating a natural depth-of-field effect.
- Spring physics animations (`stiffness: 260, damping: 20`) make transitions feel physical and fluid.
- Each card features a glassmorphic border glow, a large background feature number, and a monochromatic icon.

**Features showcased:**
1. 🌬️ **Real-Time AQI** — Continuous monitoring with live PM2.5, CO₂, and NH₃ sensors.
2. 📡 **WiFi Connected** — ESP32-powered device syncs directly to cloud dashboard.
3. 🔋 **Battery Backup** — Built-in 12V SLA battery for uninterrupted operation during power cuts.
4. 🔵 **HEPA Filtration** — True HEPA H13 captures 99.97% of particles ≥ 0.3 microns.
5. 📊 **Smart Dashboard** — Real-time AQI, historical trends, health insights, and alerts.
6. ⚡ **Dual Fan System** — High-efficiency dual brushless fans for silent, 300 CFM airflow.

---

### 5. Hardware Architecture Showcase

![Hardware Architecture](screenshots/screenshot_06_hardware.png)

An **interactive component explorer** that lets users click or hover through all 10 hardware components inside the device. The right panel dynamically updates with an animated floating product image and a detailed description of the selected component.

**Transition animation:** Each component switches with a blur-in/blur-out transition (`filter: blur(10px)` → `blur(0px)`) using Framer Motion's `AnimatePresence`. The floating image has a continuous up-down levitation animation (`y: [0, -10, 0]`, 4-second loop).

**10 Hardware Components documented:**

| Component | Details |
|-----------|---------|
| **ESP32 Microcontroller** | Dual-core 240MHz processor with built-in WiFi. Acts as the device brain for sensor orchestration and cloud sync. |
| **PMS Particle Sensor** | Laser scattering sensor providing real-time PM1.0, PM2.5, and PM10 readings. |
| **Multi-Gas Sensor Array** | MICS-6814 sensor detecting NH₃, CO, and NO₂ simultaneously. |
| **True HEPA H13 Filter** | Medical-grade filter capturing 99.97% of particles ≥ 0.3 microns (dust, pollen, smoke). |
| **OLED Display** | 0.96-inch SSD1306 high-contrast display showing live AQI on the device itself. |
| **12V SLA Battery Backup** | 12V 8Ah sealed lead-acid battery for 8+ hours of uninterrupted operation. |
| **Solar Charging Panel** | 12V 40W panel with MPPT controller for off-grid outdoor monitoring. |
| **Dual Cooling Fans** | High-efficiency 12V DC brushless fans delivering 300 CFM airflow. |
| **Buck Converter** | DC-DC step-down regulator providing stable 5V/3.3V to all electronics. |
| **GPS Module** | Ublox positioning module for geo-tagging air quality data on maps. |

---

### 6. Project Gallery

![Project Gallery](screenshots/screenshot_07_gallery.png)

A responsive **image gallery** showcasing three device render views with hover overlay labels:
- **Front View** — Exterior product design render.
- **Internal Architecture** — Internal component layout showing the hardware assembly.
- **Back View** — Rear panel and connectivity ports.

Clicking any image opens it in a fullscreen **lightbox modal** with a spring-physics zoom animation and a close button. The lightbox overlay blurs the background for focus.

---

## 📊 Dashboard Features

The dashboard is a single-page application with four tab-based views, accessible via a bottom navigation bar. Data auto-refreshes every **10 seconds** from the Firebase Realtime Database through the Express backend API.

### 1. Main Dashboard

![Dashboard Main View](screenshots/screenshot_08_dashboard_main.png)

The primary view displays three key sections:

**AQI Gauge Card** — A large, color-coded AQI reading with a dynamic glow effect that changes color based on the air quality level:
- 🟢 `0–50` — Good
- 🟡 `51–100` — Moderate
- 🟠 `101–150` — Poor
- 🔴 `151–200` — Unhealthy
- 🟣 `201–300` — Severe
- 🟤 `301–500+` — Hazardous

**Live Pollutant Readings** — A 2×3 grid of mini cards displaying live readings for:
- **PM2.5** (µg/m³) — Fine particulate matter
- **PM10** (µg/m³) — Coarse particulate matter
- **CO** (ppm) — Carbon monoxide
- **NO₂** (µg/m³) — Nitrogen dioxide
- **NH₃** (ppm) — Ammonia (spans full width)

Each card has a colored left-border that dynamically reflects the pollution level (green → red), and a `LIVE` / `OFFLINE` status badge based on the timestamp of the last reading.

**AQI Bar Chart** — A 24-hour trend chart built with Recharts `BarChart`. Each bar is individually colored based on the AQI level it represents, giving an instant visual sense of how pollution fluctuated throughout the day.

**AQI Scale Strip** — A color gradient bar (green → maroon) with a white dot indicator that animates to the exact position of the current AQI value, with smooth CSS transition.

---

### 2. Pollutants Tab

![Pollutants Tab](screenshots/screenshot_09_pollutants.png)

A detailed breakdown of all five monitored pollutants in a list format. Each pollutant row includes:

- **Chemical symbol** badge (e.g., `PM2.5`, `NO₂`)
- **Full name** with a clickable external link icon (opens the detail modal)
- **Description** of what the pollutant is and its primary source
- **Live value** with unit (µg/m³ or ppm)
- **Status tag** color-coded from Good → Severe based on WHO/CPCB thresholds

**Pollutants monitored:**

| Pollutant | Full Name | Unit | Notes |
|-----------|-----------|------|-------|
| PM2.5 | Fine Particulate Matter | µg/m³ | Particles < 2.5µm, enters bloodstream |
| PM10 | Coarse Particulate Matter | µg/m³ | Inhalable particles 2.5–10µm |
| NO₂ | Nitrogen Dioxide | µg/m³ | Respiratory inflammation risk |
| CO | Carbon Monoxide | ppm | Colourless, odourless, toxic gas |
| NH₃ | Ammonia | ppm | Irritates eyes and respiratory tract |

---

### 3. Pollutant Detail Modal

![Pollutant Detail Modal](screenshots/screenshot_10_pollutant_modal.png)

Clicking any pollutant name opens a **full-screen educational modal** with in-depth information. The modal slides in with a smooth Framer Motion spring animation and contains three tabs:

- **Explanation** — A detailed scientific description of the pollutant, its chemical composition, and how it forms.
- **Causes** — Categorized sources split into natural vs. man-made causes (traffic, industry, agriculture, etc.).
- **Effects** — A grid of health and environmental impacts across different exposure levels, with per-pollutant health impact scales showing thresholds and what happens at each level.

Each modal is pollutant-specific — PM2.5, PM10, NO₂, CO, and NH₃ each have their own tailored content.

---

### 4. AQI Scale Tab

![AQI Scale Tab](screenshots/screenshot_11_scale.png)

An educational reference page displaying **six AQI categories** in individual glassmorphic cards. Each card shows:
- The **AQI range** (e.g., `0–50`)
- The **category name** (e.g., "Good")
- A bullet-pointed list of **health effects** for that range

This helps users contextualize what the live AQI reading actually means for their health.

---

### 5. Safety & Recommendations Tab

![Safety & Recommendations](screenshots/screenshot_12_safety.png)

A dynamic safety advisory page. The top card shows a **live recommendation** tailored to the current AQI — the text, color, and icon all update based on real-time data. Below it are **8 general protection method cards** categorized by effectiveness:

**High Effectiveness:**
- Use HEPA Air Purifiers
- Close Doors & Windows (seal home from outdoor air)
- Wear N95/P100 Masks outdoors
- Avoid Indoor Smoking

**Medium Effectiveness:**
- Limit Outdoor Exercise during high-pollution periods
- Wet Mopping Only (avoid dry sweeping)

**Low Effectiveness:**
- Indoor Air Plants (Snake plants, Peace Lilies)

At the bottom, an **impact banner** contextualizes pollution risk:
> *"Breathing air with an AQI of 75 for 24 hours is equivalent to smoking one cigarette."*

---

## 🔧 Hardware Integration

The physical EcoBreathe device is built around an **ESP32 microcontroller** that reads from multiple sensors and pushes data to **Firebase Realtime Database** using a push-ID key structure.

**Data flow:**
```
ESP32 (Sensors) → Firebase Realtime DB → Node.js Express API → React Frontend
```

**Sensors used:**
- `PMS5003` — Laser particle counter for PM1, PM2.5, PM10
- `MICS-6814` — Triple-output gas sensor for NH₃, CO, NO₂
- `SSD1306 OLED` — On-device AQI display

**API endpoints:**
- `GET /api/aqi/current` — Returns latest sensor reading
- `GET /api/aqi/history` — Returns last 24 readings for trend chart

If the hardware is offline, the backend falls back to realistic **mock data** so the dashboard always renders correctly in demo mode.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18 | UI framework |
| Vite | 8 | Build tool & dev server |
| Framer Motion | 12 | Animations & transitions |
| Recharts | 3 | Data visualization (bar & area charts) |
| Lucide React | Latest | Icon library |
| Vanilla CSS | — | Custom design system (glassmorphism, dark theme) |
| Axios | 1.x | HTTP client for API calls |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4 | HTTP server & routing |
| Firebase Admin SDK | 12 | Server-side Realtime DB access |
| dotenv | 16 | Environment variable management |
| cors | 2 | Cross-origin request handling |

### Infrastructure
| Service | Usage |
|---------|-------|
| Vercel | Frontend hosting with automatic CI/CD |
| Render | Backend API hosting (`render.yaml` included) |
| Firebase Realtime Database | Live sensor data storage & streaming |

---

## 📁 Project Structure

```
AirMonitoring Project/
├── client/                        # React frontend (Vite)
│   ├── public/
│   │   ├── motion/                # 80 animation frames (ezgif-frame-001.jpg … 080.jpg)
│   │   ├── components/            # Hardware component images
│   │   └── display_images/        # Device render images for gallery
│   ├── src/
│   │   ├── App.jsx                # Dashboard — main component with all 4 tabs
│   │   ├── LandingPage.jsx        # Full landing page component
│   │   ├── FeatureCards.jsx       # 3D carousel component
│   │   ├── PollutantDetailsModal.jsx # Educational pollutant modal
│   │   ├── DustEffect.jsx         # Canvas dust particle animation
│   │   ├── index.css              # Dashboard design system & styles
│   │   └── landing.css            # Landing page styles
│   ├── vercel.json                # Vercel SPA routing config
│   └── vite.config.js             # Vite build configuration
│
├── server/                        # Node.js Express backend
│   ├── index.js                   # Express server, Firebase init, API routes
│   ├── .env.example               # Template for required environment variables
│   └── package.json
│
├── render.yaml                    # Render.com deployment config
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A Firebase project with Realtime Database enabled
- A Firebase service account key (JSON)

### 1. Clone the Repository
```bash
git clone https://github.com/YashveerRajput/EcoBreathe.git
cd EcoBreathe
```

### 2. Set Up the Backend
```bash
cd server
cp .env.example .env
```

Edit `.env` and fill in your Firebase credentials:
```env
PORT=5000
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

> ⚠️ **Important:** The `FIREBASE_SERVICE_ACCOUNT` value must be the **entire service account JSON as a single-line string** with no line breaks.

```bash
npm install
npm run dev        # Starts on http://localhost:5000
```

### 3. Set Up the Frontend
```bash
cd ../client
npm install
npm run dev        # Starts on http://localhost:5173
```

The frontend automatically proxies API requests to `localhost:5000` in development mode.

---

## 🌐 Deployment

### Frontend — Vercel
1. Push your repo to GitHub.
2. Import the repo in Vercel.
3. Set **Root Directory** to `client`.
4. Set **Build Command** to `npm run build`.
5. Set **Output Directory** to `dist`.
6. Deploy — Vercel handles everything automatically.

### Backend — Render
A `render.yaml` is included at the root level. Simply connect your GitHub repo to Render and it will auto-configure:
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

Add the following environment variables in the Render dashboard:
- `FIREBASE_SERVICE_ACCOUNT` — your full service account JSON (single line)
- `FIREBASE_DATABASE_URL` — your Firebase Realtime DB URL
- `NODE_ENV` — `production`

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: `5000`) |
| `FIREBASE_SERVICE_ACCOUNT` | Yes | Full Firebase service account JSON as a single-line string |
| `FIREBASE_DATABASE_URL` | Yes | Firebase Realtime Database URL (e.g. `https://project-id.firebaseio.com`) |

---

## 📄 License

This project is for educational and portfolio purposes.

---

<div align="center">
  <p>Built with ❤️ for cleaner air.</p>
  <p><a href="https://eco-breathe-two.vercel.app/">🌿 Live Demo</a> • <a href="https://drive.google.com/file/d/1szpA4xwAIXZqwVm4qGEl3gXjUUtLzDkY/view?usp=drive_link">📄 Full Documentation</a></p>
</div>

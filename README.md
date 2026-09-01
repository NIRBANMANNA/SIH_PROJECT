# Aurora Weather — Hyper-Local Agromet Intelligence Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> An AI/ML-powered micro-climate forecasting and agricultural advisory platform designed for precision farming down to the Gram Panchayat level.

---

## 📌 Overview

Traditional weather models provide coarse regional/block-level predictions that fail to capture microclimatic variations. **Aurora Weather** bridges this gap by downscaling weather model outputs into high-resolution, panchayat-level forecasts combined with dynamic, crop-specific agro-advisories, multi-hazard risk alerting, and multilingual farmer communications.

---

## ✨ Core Features

| Module | Description |
| :--- | :--- |
| 🌐 **Interactive Weather GIS Map** | 4-layer spatial telemetry (Rainfall, Temperature, Humidity, Wind speed) with interactive Panchayat nodes, live radar animation, and custom contour visualizations. |
| ⚡ **ML Downscaled Forecasts** | Side-by-side comparison of coarse regional forecasts (WRF/Global) vs. high-resolution ML-downscaled panchayat predictions with localized metrics. |
| 🌾 **Smart Crop Advisory** | Growth-stage specific agricultural recommendations (Rice, Potato, Jute, Mustard, Vegetables) with irrigation scheduling, fertilizer advice, and pest control measures. |
| ⚠️ **Automated Risk & Early Alert Engine** | Real-time threshold detection for flash floods, heatwaves, pest outbreaks, cold waves, and convective storms with SMS/audio broadcast capabilities. |
| 🗣️ **Multilingual & Multimodal Support** | Agro-bulletins and advisories available in English, Bengali, and Hindi with text-to-speech (TTS) audio narration and conversational AI agromet assistance. |
| 📈 **Historical Climate Analytics** | Multi-year climate trend visualizations powered by Recharts (temperature anomalies, monsoon precipitation patterns, humidity distributions). |
| 📊 **Model Accuracy & Validation** | Real-time tracking of statistical accuracy metrics ($R^2$, MAE, RMSE) verifying downscaling model fidelity. |
| 📑 **Automated Report Generation** | Instant PDF export of daily weather summaries, weekly agro-bulletins, and alert logs. |

---

## 🛠️ Tech Stack

- **Frontend Core:** React 19, JavaScript (ESNext)
- **Build & Tooling:** Vite 8, Oxlint
- **Styling:** Tailwind CSS v4, Glassmorphism design system, Custom SVG filters & fluid units (`var(--u)`)
- **Animation & Transitions:** Framer Motion, CSS Keyframes (`tw-animate-css`)
- **Data Visualization:** Recharts, Lucide Icons, React Icons
- **Routing:** React Router v7

---

## 📁 Project Structure

```
sih-landing-page/
├── public/                  # Static assets & background media
├── src/
│   ├── assets/              # Icons and local media
│   ├── components/          # Reusable UI & layout components
│   │   ├── Header.jsx       # Global header with search, notifications, & location
│   │   ├── Sidebar.jsx      # Glassmorphic sliding-pip navigation rail
│   │   ├── Hero.jsx         # Telemetry hero showcase
│   │   ├── Forecast.jsx     # Hourly & 7-day forecast slider
│   │   ├── RightRail.jsx    # Regional panchayat switch rail
│   │   ├── IconSprite.jsx   # SVG sprite library
│   │   └── ui/              # Base UI primitives
│   ├── context/
│   │   └── DashboardContext.jsx  # Global state (selected region, crop, stage, telemetry)
│   ├── data/                # Mock data & calculation engines
│   │   ├── mockWeather.js   # Panchayat hourly/weekly weather telemetry
│   │   ├── mockPanchayats.js# Spatial coordinates, block relations & layer metrics
│   │   ├── mockAdvisory.js  # Crop-stage matrices, multilingual translations, advice
│   │   ├── mockRisks.js     # Risk calculation engine & hazard triggers
│   │   └── mockHistorical.js# Multi-year historical datasets
│   ├── lib/
│   │   └── styles.js        # Centralized glassmorphism design tokens
│   ├── pages/               # Route views
│   │   ├── Landing.jsx      # High-conversion product landing page
│   │   ├── Login.jsx / Register.jsx # Authentication views
│   │   ├── Dashboard.jsx    # Main application shell with nested routes
│   │   ├── Overview.jsx     # Main weather cockpit
│   │   ├── WeatherMap.jsx   # Interactive 2D/GIS multi-layer map
│   │   ├── ForecastDownscaled.jsx # WRF vs. ML downscaling comparison
│   │   ├── RiskAlerts.jsx   # Hazard warnings & SMS broadcaster
│   │   ├── CropAdvisory.jsx # Stage advisory, AI assistant & audio bulletins
│   │   ├── HistoricalTrends.jsx # Climate chart analytics
│   │   ├── Accuracy.jsx     # Model evaluation statistics
│   │   ├── Reports.jsx      # Export & report generation
│   │   └── Settings.jsx     # Profile, unit, & notification preferences
│   ├── App.jsx              # Application router configuration
│   ├── main.jsx             # React entry point
│   └── index.css            # Global Tailwind & typography configuration
├── package.json
└── vite.config.js
```

---

## 🚦 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** / **yarn** / **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NIRBANMANNA/SIH_PROJECT.git
   cd SIH_PROJECT
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## ⚡ Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with Hot Module Replacement (HMR). |
| `npm run build` | Builds optimized production bundle into `/dist`. |
| `npm run preview`| Locally previews the production build. |
| `npm run lint` | Runs fast code linting via `oxlint`. |

---

## 🗺️ Application Routes

| Path | Screen | Functionality |
| :--- | :--- | :--- |
| `/` | **Landing Page** | Showcase, feature breakdown, interactive previews, and CTA. |
| `/login`, `/register` | **Auth** | User authentication screens with glassmorphic cards. |
| `/dashboard/overview` | **Cockpit** | Real-time weather parameters, 7-day & hourly breakdown, regional selector. |
| `/dashboard/map` | **Weather Map** | Multi-layer spatial heatmap (Rainfall, Temp, Humidity, Wind). |
| `/dashboard/forecast` | **Downscaling** | Coarse Block WRF vs. ML Panchayat-level precision comparison. |
| `/dashboard/alerts` | **Risk & Alerts** | Active hazard monitor, severity categorization, and broadcast dispatch. |
| `/dashboard/cropadvisory` | **Crop Advisory** | Stage-specific guidance, multilingual bulletins, audio player, AI agromet bot. |
| `/dashboard/historical` | **Trends** | Long-term trend analysis and weather variation charts. |
| `/dashboard/accuracy` | **Accuracy** | Statistical evaluation metrics ($R^2$, RMSE, MAE). |
| `/dashboard/reports` | **Reports** | PDF summary and agromet report exporter. |
| `/dashboard/settings` | **Settings** | Units preference (°C/°F, km/h/mph) and user profile configuration. |

---

## 📄 License

This project is licensed under the MIT License.

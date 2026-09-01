export const mockStates = ["West Bengal", "Odisha", "Bihar"]

export const mockDistricts = {
  "West Bengal": ["Hooghly", "Burdwan", "Howrah", "Nadia"],
  "Odisha": ["Khurda", "Cuttack"],
  "Bihar": ["Patna", "Gaya"]
}

export const mockBlocks = {
  "Hooghly": ["Polba-Dadpur", "Chinsurah-Mogra", "Singur", "Haripal"],
  "Burdwan": ["Burdwan-I", "Burdwan-II"]
}

export const mockPanchayatDetails = {
  "p1": {
    id: "p1",
    name: "Amnan",
    block: "Polba-Dadpur",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.952,
    lng: 88.304,
    center: [230, 210],
    path: "M 110,130 C 170,110 260,120 310,150 C 340,190 320,270 280,310 C 230,330 160,310 120,260 C 90,210 95,160 110,130 Z",
    rainfall: 34.5,
    rainfallStatus: "Heavy Rain (34.5 mm)",
    rainProb: 88,
    temp: 32.5,
    feelsLike: 37.0,
    tempTrend: "+1.1°C/hr",
    humidity: 88,
    dewPoint: 26.2,
    soilMoisture: "92% (Saturated)",
    windSpeed: 24,
    windDirection: "SSW (210°)",
    windGust: 38,
    riskLevel: "High",
    riskScore: 78,
    riskColor: "#f97316",
    riskFactors: ["Flash waterlogging in lower plots", "High fungal spore dispersal pressure"],
    cropRisk: {
      crop: "Rice (Kharif)",
      stage: "Tillering Stage",
      level: "High Risk",
      levelColor: "#f97316",
      alertTitle: "Standing Water Hazard & Fungal Blast Susceptibility",
      summary: "Excessive standing water in depression zones threatens young tillers. High relative humidity (88%) creates optimal conditions for leaf blast and sheath blight.",
      actions: [
        "Drain standing water to maintain maximum 5 cm field depth.",
        "Postpone chemical sprays and urea top-dressing until downpour recedes.",
        "Scout field borders for stem borer egg masses and brown planthoppers."
      ]
    }
  },
  "p2": {
    id: "p2",
    name: "Babnan",
    block: "Polba-Dadpur",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.978,
    lng: 88.275,
    center: [450, 170],
    path: "M 310,150 C 370,110 490,100 560,130 C 600,180 580,250 530,280 C 470,300 370,290 310,240 C 300,190 300,160 310,150 Z",
    rainfall: 12.0,
    rainfallStatus: "Moderate Showers (12.0 mm)",
    rainProb: 65,
    temp: 30.5,
    feelsLike: 34.0,
    tempTrend: "+0.4°C/hr",
    humidity: 72,
    dewPoint: 23.5,
    soilMoisture: "68% (Optimal)",
    windSpeed: 14,
    windDirection: "SW (225°)",
    windGust: 22,
    riskLevel: "Moderate",
    riskScore: 48,
    riskColor: "#eab308",
    riskFactors: ["Mild leaf fold insect activity", "Intermittent gusty wind"],
    cropRisk: {
      crop: "Rice (Kharif)",
      stage: "Tillering Stage",
      level: "Moderate Risk",
      levelColor: "#eab308",
      alertTitle: "Optimal Moisture with Mild Insect Pressure",
      summary: "Soil moisture is currently favorable for tiller elongation, but cloudy weather increases incidence of leaf folders and grasshoppers.",
      actions: [
        "Maintain 3-5 cm standing water in paddy plots.",
        "Install light traps or yellow sticky cards along plot boundaries.",
        "Proceed with scheduled hand weeding if soil firmness allows."
      ]
    }
  },
  "p3": {
    id: "p3",
    name: "Sugandhya",
    block: "Polba-Dadpur",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.930,
    lng: 88.332,
    center: [230, 420],
    path: "M 120,260 C 160,310 230,330 280,310 C 330,360 310,480 250,510 C 180,530 110,480 90,410 C 80,340 95,290 120,260 Z",
    rainfall: 0.0,
    rainfallStatus: "Dry / No Precipitation (0.0 mm)",
    rainProb: 15,
    temp: 36.2,
    feelsLike: 41.5,
    tempTrend: "+1.8°C/hr",
    humidity: 54,
    dewPoint: 22.0,
    soilMoisture: "38% (Deficit)",
    windSpeed: 9,
    windDirection: "WNW (290°)",
    windGust: 14,
    riskLevel: "High",
    riskScore: 74,
    riskColor: "#f97316",
    riskFactors: ["High temperature heat stress", "Topsoil moisture depletion"],
    cropRisk: {
      crop: "Jute & Vegetables",
      stage: "Vegetative Stage",
      level: "High Heat Stress",
      levelColor: "#f97316",
      alertTitle: "Topsoil Desiccation & Midday Wilting Threat",
      summary: "Afternoon temperature exceeding 36°C with zero rainfall accelerates evapotranspiration, stressing tender leafy vegetables and jute fiber elongation.",
      actions: [
        "Apply light evening irrigation to replenish root zone moisture.",
        "Apply organic straw mulch between rows to reduce surface evaporation.",
        "Avoid spraying chemicals between 11:00 AM and 3:30 PM."
      ]
    }
  },
  "p4": {
    id: "p4",
    name: "Polba",
    block: "Polba-Dadpur",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.945,
    lng: 88.315,
    center: [430, 390],
    path: "M 280,310 C 370,290 470,300 530,280 C 580,340 550,450 490,490 C 420,520 330,510 280,450 C 270,390 270,340 280,310 Z",
    rainfall: 6.4,
    rainfallStatus: "Light Showers (6.4 mm)",
    rainProb: 40,
    temp: 31.8,
    feelsLike: 35.2,
    tempTrend: "+0.2°C/hr",
    humidity: 68,
    dewPoint: 24.1,
    soilMoisture: "62% (Good)",
    windSpeed: 16,
    windDirection: "S (180°)",
    windGust: 24,
    riskLevel: "Low",
    riskScore: 22,
    riskColor: "#22c55e",
    riskFactors: ["Nominal meteorological stress", "Balanced growth conditions"],
    cropRisk: {
      crop: "Rice (Kharif)",
      stage: "Tillering Stage",
      level: "Low Risk (Favorable)",
      levelColor: "#22c55e",
      alertTitle: "Ideal Agronomic Weather Conditions",
      summary: "Balanced thermal and moisture equilibrium supporting high photosynthetic rates and vigorous root development across all standard crop varieties.",
      actions: [
        "Proceed with scheduled fertilizer top-dressing (NPK split).",
        "Reinforce field bunds to harvest incoming light showers.",
        "Conduct routine weekly pest scouting."
      ]
    }
  },
  "p5": {
    id: "p5",
    name: "Rajhat",
    block: "Polba-Dadpur",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.990,
    lng: 88.340,
    center: [650, 240],
    path: "M 560,130 C 640,110 730,130 760,190 C 780,260 740,350 680,380 C 610,390 550,340 530,280 C 580,250 600,180 560,130 Z",
    rainfall: 48.2,
    rainfallStatus: "Torrential Downpour (48.2 mm)",
    rainProb: 95,
    temp: 28.2,
    feelsLike: 31.5,
    tempTrend: "-0.8°C/hr",
    humidity: 95,
    dewPoint: 27.0,
    soilMoisture: "98% (Flooded)",
    windSpeed: 34,
    windDirection: "SSE (155°)",
    windGust: 46,
    riskLevel: "Critical",
    riskScore: 94,
    riskColor: "#ef4444",
    riskFactors: ["Severe inundation of low-lying plots", "High wind lodging hazard"],
    cropRisk: {
      crop: "Paddy & Summer Vegetables",
      stage: "Vegetative & Flowering",
      level: "Critical Hazard",
      levelColor: "#ef4444",
      alertTitle: "Complete Submersion & Severe Lodging Risk",
      summary: "Excessive rainfall combined with sustained gale gusts (>34 km/h) creates severe flash inundation hazard and mechanical damage to standing vegetable trellis systems.",
      actions: [
        "Open all main drainage outlets immediately to avert seedling rot.",
        "Erect bamboo stakes and guy lines to support trellis crops.",
        "Do not apply any foliar pesticides or chemical fertilizers."
      ]
    }
  },
  "p6": {
    id: "p6",
    name: "Makalpur",
    block: "Polba-Dadpur",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.915,
    lng: 88.290,
    center: [590, 460],
    path: "M 530,280 C 610,390 680,380 730,420 C 750,480 700,560 620,570 C 540,570 470,540 490,490 C 550,450 580,340 530,280 Z",
    rainfall: 21.4,
    rainfallStatus: "Heavy Rain (21.4 mm)",
    rainProb: 80,
    temp: 29.8,
    feelsLike: 33.2,
    tempTrend: "+0.1°C/hr",
    humidity: 84,
    dewPoint: 25.4,
    soilMoisture: "85% (High)",
    windSpeed: 19,
    windDirection: "S (175°)",
    windGust: 28,
    riskLevel: "Moderate",
    riskScore: 58,
    riskColor: "#eab308",
    riskFactors: ["High humidity fungal risk", "Mild plot runoff"],
    cropRisk: {
      crop: "Rice (Kharif)",
      stage: "Tillering Stage",
      level: "Moderate Risk",
      levelColor: "#eab308",
      alertTitle: "Elevated Humidity & Fungal Monitoring Advised",
      summary: "Substantial rainfall has filled field channels. High air humidity (84%) warrants strict preventive vigilance against fungal blast spores.",
      actions: [
        "Regulate field water level between 4 cm and 6 cm.",
        "Check underleaf surfaces for spindle-shaped blast lesions.",
        "Keep bio-fungicides prepared for application once dry spell occurs."
      ]
    }
  },
  // Chinsurah-Mogra Panchayats
  "p7": {
    id: "p7",
    name: "Bandel",
    block: "Chinsurah-Mogra",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.920,
    lng: 88.380,
    center: [280, 260],
    path: "M 130,120 C 260,90 390,110 440,200 C 470,290 420,380 340,410 C 230,440 140,390 100,300 C 80,210 90,150 130,120 Z",
    rainfall: 18.5,
    rainfallStatus: "Moderate Showers (18.5 mm)",
    rainProb: 75,
    temp: 31.0,
    feelsLike: 35.5,
    tempTrend: "+0.5°C/hr",
    humidity: 80,
    dewPoint: 25.0,
    soilMoisture: "78% (High)",
    windSpeed: 21,
    windDirection: "SE (135°)",
    windGust: 30,
    riskLevel: "Moderate",
    riskScore: 52,
    riskColor: "#eab308",
    riskFactors: ["Riverine humidity accumulation", "Moderate drainage velocity"],
    cropRisk: {
      crop: "Vegetables & Paddy",
      stage: "Vegetative",
      level: "Moderate Risk",
      levelColor: "#eab308",
      alertTitle: "Riverine Moisture Buildup",
      summary: "Proximity to Hooghly river promotes high atmospheric humidity. Ensure adequate furrow spacing for vegetable plots.",
      actions: [
        "Clear drainage furrows between vegetable beds.",
        "Monitor for downy mildew in cucurbit crops."
      ]
    }
  },
  "p8": {
    id: "p8",
    name: "Debanandapur",
    block: "Chinsurah-Mogra",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.902,
    lng: 88.370,
    center: [550, 320],
    path: "M 440,200 C 540,140 680,160 720,250 C 750,350 690,470 580,490 C 470,500 370,440 340,410 C 420,380 470,290 440,200 Z",
    rainfall: 29.0,
    rainfallStatus: "Heavy Rain (29.0 mm)",
    rainProb: 85,
    temp: 30.2,
    feelsLike: 34.8,
    tempTrend: "+0.3°C/hr",
    humidity: 86,
    dewPoint: 25.8,
    soilMoisture: "88% (Saturated)",
    windSpeed: 23,
    windDirection: "SSE (150°)",
    windGust: 34,
    riskLevel: "High",
    riskScore: 72,
    riskColor: "#f97316",
    riskFactors: ["Localized lowland flooding", "High pest humidity index"],
    cropRisk: {
      crop: "Rice (Kharif)",
      stage: "Tillering Stage",
      level: "High Risk",
      levelColor: "#f97316",
      alertTitle: "Standing Water & Sheath Blight Risk",
      summary: "Significant downpours have saturated soil beds. Water stagnation exceeds safe limits in lower terraces.",
      actions: [
        "Open field bund drains immediately.",
        "Delay chemical sprays until moisture dries on crop foliage."
      ]
    }
  }
}

export const mockPanchayats = {
  "Polba-Dadpur": [
    mockPanchayatDetails["p1"],
    mockPanchayatDetails["p2"],
    mockPanchayatDetails["p3"],
    mockPanchayatDetails["p4"],
    mockPanchayatDetails["p5"],
    mockPanchayatDetails["p6"]
  ],
  "Chinsurah-Mogra": [
    mockPanchayatDetails["p7"],
    mockPanchayatDetails["p8"]
  ],
  "Singur": [
    mockPanchayatDetails["p1"],
    mockPanchayatDetails["p4"]
  ],
  "Haripal": [
    mockPanchayatDetails["p2"],
    mockPanchayatDetails["p3"]
  ]
}

export const getPanchayatsForBlock = (block) => mockPanchayats[block] || mockPanchayats["Polba-Dadpur"]
export const getPanchayatDetail = (pid) => mockPanchayatDetails[pid] || mockPanchayatDetails["p1"]

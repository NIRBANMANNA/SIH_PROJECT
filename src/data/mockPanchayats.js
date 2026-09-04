export const mockStates = ["West Bengal", "Odisha", "Bihar"]

export const mockDistricts = {
  "West Bengal": [
    "PurbaMedinipur",
    "East Medinipur",
    "Hooghly",
    "Nadia",
    "Burdwan",
    "Howrah",
    "North 24 Parganas",
    "South 24 Parganas",
    "Bankura",
    "Murshidabad",
    "Malda"
  ],
  "Odisha": ["Khurda", "Cuttack"],
  "Bihar": ["Patna", "Gaya"]
}

export const mockBlocks = {
  "PurbaMedinipur": ["Mahishadal", "Tamluk", "Haldia", "Nandigram-I", "Contai-I"],
  "East Medinipur": ["Mahishadal", "Tamluk", "Haldia", "Nandigram-I", "Contai-I"],
  "Hooghly": ["Polba-Dadpur", "Chinsurah-Mogra", "Singur", "Haripal"],
  "Burdwan": ["Burdwan-I", "Burdwan-II", "Kalna-I"],
  "Nadia": ["Krishnanagar-I", "Ranaghat-I", "Santipur"],
  "Howrah": ["Uluberia-I", "Bally-Jagachha"],
  "Bankura": ["Bankura-I", "Bishnupur"],
  "North 24 Parganas": ["Barasat-I", "Habra-I", "Basirhat-I"],
  "South 24 Parganas": ["Baruipur", "Diamond Harbour-I", "Canning-I"]
}

export const mockPanchayatDetails = {
  // ─── POLBA-DADPUR BLOCK (p1 - p6) ───
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

  // ─── CHINSURAH-MOGRA BLOCK (p7 - p10) ───
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
  },
  "p9": {
    id: "p9",
    name: "Mogra",
    block: "Chinsurah-Mogra",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.980,
    lng: 88.375,
    center: [420, 210],
    path: "M 320,110 C 450,90 560,120 600,190 C 620,280 570,360 480,380 C 370,390 280,340 260,260 C 250,180 290,130 320,110 Z",
    rainfall: 16.2,
    rainfallStatus: "Showers (16.2 mm)",
    rainProb: 70,
    temp: 31.4,
    feelsLike: 35.8,
    tempTrend: "+0.6°C/hr",
    humidity: 78,
    dewPoint: 24.8,
    soilMoisture: "76% (Adequate)",
    windSpeed: 18,
    windDirection: "SE (140°)",
    windGust: 26,
    riskLevel: "Moderate",
    riskScore: 50,
    riskColor: "#eab308",
    riskFactors: ["Moderate cloudiness", "Foliar humidity"],
    cropRisk: {
      crop: "Vegetables & Jute",
      stage: "Vegetative",
      level: "Moderate Risk",
      levelColor: "#eab308",
      alertTitle: "Foliar Moisture Management",
      summary: "Intermittent showers replenishing soil. Ensure drainage furrows remain clear.",
      actions: [
        "Clear drainage furrows around vegetable patches.",
        "Avoid spraying pesticides during overcast periods."
      ]
    }
  },
  "p10": {
    id: "p10",
    name: "Digsui-Hoera",
    block: "Chinsurah-Mogra",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.960,
    lng: 88.355,
    center: [510, 390],
    path: "M 380,240 C 490,200 610,230 650,310 C 670,400 600,500 500,520 C 390,530 310,460 290,380 C 280,300 340,250 380,240 Z",
    rainfall: 22.0,
    rainfallStatus: "Heavy Showers (22.0 mm)",
    rainProb: 80,
    temp: 29.5,
    feelsLike: 33.8,
    tempTrend: "+0.2°C/hr",
    humidity: 84,
    dewPoint: 25.2,
    soilMoisture: "86% (High)",
    windSpeed: 20,
    windDirection: "S (180°)",
    windGust: 30,
    riskLevel: "High",
    riskScore: 68,
    riskColor: "#f97316",
    riskFactors: ["Runoff pooling in furrows", "Blight susceptibility"],
    cropRisk: {
      crop: "Rice (Kharif)",
      stage: "Tillering Stage",
      level: "High Risk",
      levelColor: "#f97316",
      alertTitle: "Drainage Vigilance",
      summary: "High water intake in low elevation plots. Regulate field water levels.",
      actions: [
        "Maintain maximum 5 cm standing water depth.",
        "Inspect for sheath blight lesions."
      ]
    }
  },

  // ─── SINGUR BLOCK (p11 - p15) ───
  "p11": {
    id: "p11",
    name: "Balarambati",
    block: "Singur",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.815,
    lng: 88.240,
    center: [220, 240],
    path: "M 100,140 C 220,110 340,130 380,210 C 400,300 350,400 270,420 C 180,440 90,380 70,300 C 60,210 80,160 100,140 Z",
    rainfall: 14.8,
    rainfallStatus: "Moderate Rain (14.8 mm)",
    rainProb: 68,
    temp: 31.2,
    feelsLike: 35.0,
    tempTrend: "+0.4°C/hr",
    humidity: 76,
    dewPoint: 24.2,
    soilMoisture: "74% (Optimal)",
    windSpeed: 15,
    windDirection: "SW (220°)",
    windGust: 24,
    riskLevel: "Moderate",
    riskScore: 46,
    riskColor: "#eab308",
    riskFactors: ["Alluvial soil moisture retention", "Weed emergence"],
    cropRisk: {
      crop: "Potato & Vegetables",
      stage: "Vegetative",
      level: "Moderate Risk",
      levelColor: "#eab308",
      alertTitle: "Alluvial Soil Moisture Favorable",
      summary: "Moisture conditions ideal for vegetable roots. Keep furrows weeded.",
      actions: [
        "Carry out light intercultural weeding.",
        "Ensure no water pools in low ridges."
      ]
    }
  },
  "p12": {
    id: "p12",
    name: "Singur-I",
    block: "Singur",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.810,
    lng: 88.230,
    center: [440, 220],
    path: "M 320,130 C 440,100 560,120 600,200 C 620,290 570,390 480,410 C 380,430 290,370 270,290 C 260,200 290,150 320,130 Z",
    rainfall: 11.5,
    rainfallStatus: "Light-Moderate Rain (11.5 mm)",
    rainProb: 62,
    temp: 31.8,
    feelsLike: 35.6,
    tempTrend: "+0.5°C/hr",
    humidity: 74,
    dewPoint: 24.0,
    soilMoisture: "70% (Good)",
    windSpeed: 14,
    windDirection: "SSW (205°)",
    windGust: 22,
    riskLevel: "Low",
    riskScore: 32,
    riskColor: "#22c55e",
    riskFactors: ["Optimal growth conditions", "Nominal wind"],
    cropRisk: {
      crop: "Rice & Potato",
      stage: "Tillering",
      level: "Low Risk",
      levelColor: "#22c55e",
      alertTitle: "Optimal Field Conditions",
      summary: "Balanced moisture and warmth supporting high photosynthetic rate.",
      actions: [
        "Proceed with scheduled fertilizer split dose.",
        "Conduct routine pest scouting."
      ]
    }
  },
  "p13": {
    id: "p13",
    name: "Singur-II",
    block: "Singur",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.805,
    lng: 88.225,
    center: [260, 430],
    path: "M 150,290 C 270,260 380,280 420,360 C 440,450 380,550 290,570 C 190,590 110,520 90,440 C 80,360 120,310 150,290 Z",
    rainfall: 9.0,
    rainfallStatus: "Scattered Showers (9.0 mm)",
    rainProb: 55,
    temp: 32.2,
    feelsLike: 36.2,
    tempTrend: "+0.8°C/hr",
    humidity: 71,
    dewPoint: 23.8,
    soilMoisture: "66% (Normal)",
    windSpeed: 13,
    windDirection: "S (185°)",
    windGust: 20,
    riskLevel: "Low",
    riskScore: 28,
    riskColor: "#22c55e",
    riskFactors: ["Favorable sunlight", "Mild humidity"],
    cropRisk: {
      crop: "Vegetables & Pulses",
      stage: "Vegetative Growth",
      level: "Low Risk",
      levelColor: "#22c55e",
      alertTitle: "Normal Agricultural Operations",
      summary: "Fair weather supporting vigorous growth across all crop plots.",
      actions: [
        "Continue planned farm work and hoeing.",
        "Maintain clean bund boundaries."
      ]
    }
  },
  "p14": {
    id: "p14",
    name: "Nasibpur",
    block: "Singur",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.825,
    lng: 88.255,
    center: [520, 380],
    path: "M 390,260 C 510,230 620,250 660,330 C 680,420 620,520 530,540 C 430,560 340,490 320,410 C 310,330 360,280 390,260 Z",
    rainfall: 18.0,
    rainfallStatus: "Moderate Showers (18.0 mm)",
    rainProb: 75,
    temp: 30.8,
    feelsLike: 35.0,
    tempTrend: "+0.3°C/hr",
    humidity: 79,
    dewPoint: 24.6,
    soilMoisture: "80% (High)",
    windSpeed: 17,
    windDirection: "SSW (215°)",
    windGust: 27,
    riskLevel: "Moderate",
    riskScore: 52,
    riskColor: "#eab308",
    riskFactors: ["Elevated humidity", "Slow infiltration"],
    cropRisk: {
      crop: "Rice (Kharif)",
      stage: "Tillering Stage",
      level: "Moderate Risk",
      levelColor: "#eab308",
      alertTitle: "Soil Moisture High",
      summary: "Adequate rain accumulated. Ensure water outflow trenches are functional.",
      actions: [
        "Maintain 3-5 cm water depth in paddy.",
        "Delay pesticide sprays until foliage dries."
      ]
    }
  },
  "p15": {
    id: "p15",
    name: "Kamarkundu",
    block: "Singur",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.835,
    lng: 88.210,
    center: [380, 520],
    path: "M 240,390 C 360,360 480,380 520,460 C 540,550 470,640 380,660 C 280,680 190,620 170,540 C 160,450 210,400 240,390 Z",
    rainfall: 13.5,
    rainfallStatus: "Moderate Rain (13.5 mm)",
    rainProb: 65,
    temp: 31.0,
    feelsLike: 35.2,
    tempTrend: "+0.4°C/hr",
    humidity: 75,
    dewPoint: 24.0,
    soilMoisture: "72% (Optimal)",
    windSpeed: 16,
    windDirection: "SW (225°)",
    windGust: 25,
    riskLevel: "Low",
    riskScore: 35,
    riskColor: "#22c55e",
    riskFactors: ["Good soil drainage", "Normal conditions"],
    cropRisk: {
      crop: "Jute & Paddy",
      stage: "Active Growth",
      level: "Low Risk",
      levelColor: "#22c55e",
      alertTitle: "Balanced Agro-Climate",
      summary: "Comfortable parameters with favorable soil percolation.",
      actions: [
        "Harvest rainwater in ponds.",
        "Apply standard fertilizer doses."
      ]
    }
  },

  // ─── HARIPAL BLOCK (p16 - p20) ───
  "p16": {
    id: "p16",
    name: "Haripal",
    block: "Haripal",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.830,
    lng: 88.115,
    center: [210, 230],
    path: "M 90,130 C 210,100 330,120 370,200 C 390,290 340,390 260,410 C 170,430 80,370 60,290 C 50,200 70,150 90,130 Z",
    rainfall: 26.5,
    rainfallStatus: "Heavy Rain (26.5 mm)",
    rainProb: 82,
    temp: 30.0,
    feelsLike: 34.5,
    tempTrend: "+0.2°C/hr",
    humidity: 85,
    dewPoint: 25.5,
    soilMoisture: "88% (Saturated)",
    windSpeed: 22,
    windDirection: "S (175°)",
    windGust: 32,
    riskLevel: "High",
    riskScore: 70,
    riskColor: "#f97316",
    riskFactors: ["Clay loam waterlogging", "Stem borer risk"],
    cropRisk: {
      crop: "Rice & Jute",
      stage: "Tillering Stage",
      level: "High Risk",
      levelColor: "#f97316",
      alertTitle: "Excess Water Outflow Required",
      summary: "Significant shower accumulation across canal catchment.",
      actions: [
        "Clear main farm gate outlets immediately.",
        "Postpone chemical fertilizer application."
      ]
    }
  },
  "p17": {
    id: "p17",
    name: "Kaiba",
    block: "Haripal",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.845,
    lng: 88.130,
    center: [430, 210],
    path: "M 310,120 C 430,90 550,110 590,190 C 610,280 560,380 470,400 C 370,420 280,360 260,280 C 250,190 280,140 310,120 Z",
    rainfall: 22.0,
    rainfallStatus: "Heavy Rain (22.0 mm)",
    rainProb: 78,
    temp: 30.4,
    feelsLike: 34.8,
    tempTrend: "+0.3°C/hr",
    humidity: 83,
    dewPoint: 25.1,
    soilMoisture: "84% (High)",
    windSpeed: 20,
    windDirection: "SSW (200°)",
    windGust: 29,
    riskLevel: "Moderate",
    riskScore: 58,
    riskColor: "#eab308",
    riskFactors: ["High air humidity", "Pest incidence"],
    cropRisk: {
      crop: "Vegetables & Rice",
      stage: "Vegetative Growth",
      level: "Moderate Risk",
      levelColor: "#eab308",
      alertTitle: "Fungal Spore Risk",
      summary: "Humid conditions warrant vigilance for leaf spots.",
      actions: [
        "Keep bio-fungicides on standby.",
        "Regulate field water height."
      ]
    }
  },
  "p18": {
    id: "p18",
    name: "Ilipur",
    block: "Haripal",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.820,
    lng: 88.105,
    center: [250, 420],
    path: "M 140,280 C 260,250 370,270 410,350 C 430,440 370,540 280,560 C 180,580 100,510 80,430 C 70,350 110,300 140,280 Z",
    rainfall: 17.5,
    rainfallStatus: "Moderate Showers (17.5 mm)",
    rainProb: 72,
    temp: 31.0,
    feelsLike: 35.2,
    tempTrend: "+0.5°C/hr",
    humidity: 78,
    dewPoint: 24.5,
    soilMoisture: "76% (Adequate)",
    windSpeed: 17,
    windDirection: "S (180°)",
    windGust: 26,
    riskLevel: "Moderate",
    riskScore: 48,
    riskColor: "#eab308",
    riskFactors: ["Intermittent rain", "Mild weed growth"],
    cropRisk: {
      crop: "Rice (Kharif)",
      stage: "Tillering Stage",
      level: "Moderate Risk",
      levelColor: "#eab308",
      alertTitle: "Moisture Replenishment",
      summary: "Showers assisting root establishment.",
      actions: [
        "Ensure field bunds hold 4 cm water.",
        "Scout for yellow stem borers."
      ]
    }
  },
  "p19": {
    id: "p19",
    name: "Bhandarhati",
    block: "Haripal",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.860,
    lng: 88.140,
    center: [510, 370],
    path: "M 380,250 C 500,220 610,240 650,320 C 670,410 610,510 520,530 C 420,550 330,480 310,400 C 300,320 350,270 380,250 Z",
    rainfall: 31.0,
    rainfallStatus: "Heavy Rain (31.0 mm)",
    rainProb: 86,
    temp: 29.2,
    feelsLike: 33.5,
    tempTrend: "-0.2°C/hr",
    humidity: 89,
    dewPoint: 26.0,
    soilMoisture: "91% (Saturated)",
    windSpeed: 23,
    windDirection: "SSE (160°)",
    windGust: 35,
    riskLevel: "High",
    riskScore: 74,
    riskColor: "#f97316",
    riskFactors: ["Low terrace waterlogging", "Nutrient leaching"],
    cropRisk: {
      crop: "Rice & Vegetables",
      stage: "Tillering",
      level: "High Risk",
      levelColor: "#f97316",
      alertTitle: "Lowland Water Stagnation",
      summary: "Heavy rainfall causing accumulation in low plots.",
      actions: [
        "Open boundary drainage ditches.",
        "Suspend all spray and top-dressing activities."
      ]
    }
  },
  "p20": {
    id: "p20",
    name: "Dwarhatta",
    block: "Haripal",
    district: "Hooghly",
    state: "West Bengal",
    lat: 22.800,
    lng: 88.095,
    center: [370, 510],
    path: "M 230,380 C 350,350 470,370 510,450 C 530,540 460,630 370,650 C 270,670 180,610 160,530 C 150,440 200,390 230,380 Z",
    rainfall: 15.0,
    rainfallStatus: "Moderate Rain (15.0 mm)",
    rainProb: 68,
    temp: 31.5,
    feelsLike: 35.8,
    tempTrend: "+0.4°C/hr",
    humidity: 77,
    dewPoint: 24.6,
    soilMoisture: "75% (Optimal)",
    windSpeed: 16,
    windDirection: "SW (215°)",
    windGust: 24,
    riskLevel: "Low",
    riskScore: 36,
    riskColor: "#22c55e",
    riskFactors: ["Stable temperature", "Controlled moisture"],
    cropRisk: {
      crop: "Jute & Potato",
      stage: "Vegetative",
      level: "Low Risk",
      levelColor: "#22c55e",
      alertTitle: "Optimal Crop Growth",
      summary: "Favorable parameters for crop tillering and fiber development.",
      actions: [
        "Proceed with scheduled fertilizer applications.",
        "Keep drainage gates unblocked."
      ]
    }
  },
  // ─── MAHISHADAL BLOCK (Purba Medinipur) ───
  "m_p1": {
    id: "m_p1",
    name: "champi",
    block: "Mahishadal",
    district: "PurbaMedinipur",
    state: "West Bengal",
    lat: 22.185,
    lng: 87.982,
    rainfall: 28.5,
    rainfallStatus: "Moderate Showers (28.5 mm)",
    rainProb: 82,
    temp: 31.8,
    feelsLike: 36.5,
    humidity: 84,
    dewPoint: 25.4,
    soilMoisture: "86% (High Moisture)",
    windSpeed: 21,
    windDirection: "S (180°)",
    windGust: 32,
    riskLevel: "Moderate",
    riskScore: 62,
    riskColor: "#facc15",
    riskFactors: ["Coastal moisture convergence", "Moderate wind gusts"],
    cropRisk: {
      crop: "Rice (Kharif) & Betel Vine",
      stage: "Vegetative Stage",
      level: "Moderate Risk",
      alertTitle: "Moisture Index & Drainage Advisory",
      summary: "Good moisture index across coastal alluvial plains of Mahishadal. Favorable vegetative growth.",
      actions: ["Check drainage around betel vine boroj.", "Maintain standard fertilizer intervals."]
    }
  },
  "m_p2": {
    id: "m_p2",
    name: "Garh Kamalpur",
    block: "Mahishadal",
    district: "PurbaMedinipur",
    state: "West Bengal",
    lat: 22.175,
    lng: 87.974,
    rainfall: 24.0,
    rainfallStatus: "Moderate Rain (24.0 mm)",
    rainProb: 75,
    temp: 32.0,
    feelsLike: 36.8,
    humidity: 82,
    dewPoint: 25.2,
    soilMoisture: "80% (Moist)",
    windSpeed: 19,
    windDirection: "SSW (195°)",
    windGust: 29,
    riskLevel: "Low",
    riskScore: 40,
    riskColor: "#22c55e",
    riskFactors: ["Controlled moisture", "Stable humidity"],
    cropRisk: {
      crop: "Paddy & Vegetable",
      stage: "Tillering Stage",
      level: "Low Risk",
      alertTitle: "Optimal Tillering Growth",
      summary: "Optimal weather profile for paddy tillering with steady root aeration.",
      actions: ["Continue scheduled weeding and aeration."]
    }
  },
  "m_p3": {
    id: "m_p3",
    name: "Natshal-I",
    block: "Mahishadal",
    district: "PurbaMedinipur",
    state: "West Bengal",
    lat: 22.195,
    lng: 88.012,
    rainfall: 32.0,
    rainfallStatus: "Heavy Showers (32.0 mm)",
    rainProb: 88,
    temp: 31.2,
    feelsLike: 36.2,
    humidity: 88,
    dewPoint: 26.0,
    soilMoisture: "90% (Saturated)",
    windSpeed: 25,
    windDirection: "S (175°)",
    windGust: 36,
    riskLevel: "High",
    riskScore: 74,
    riskColor: "#f97316",
    riskFactors: ["Rupnarayan river overflow risk", "Soil saturation >88%"],
    cropRisk: {
      crop: "Paddy & Pisciculture",
      stage: "Tillering Stage",
      level: "High Risk",
      alertTitle: "Riparian Waterlogging Risk",
      summary: "Rupnarayan river proximity brings high moisture saturation and pond spillover alert.",
      actions: ["Reinforce pond embankments.", "Clear canal culverts."]
    }
  },
  "m_p4": {
    id: "m_p4",
    name: "Amritaberia",
    block: "Mahishadal",
    district: "PurbaMedinipur",
    state: "West Bengal",
    lat: 22.162,
    lng: 87.990,
    rainfall: 22.5,
    rainfallStatus: "Moderate Rain (22.5 mm)",
    rainProb: 70,
    temp: 32.2,
    feelsLike: 37.0,
    humidity: 80,
    dewPoint: 24.8,
    soilMoisture: "78% (Optimal)",
    windSpeed: 18,
    windDirection: "SSW (200°)",
    windGust: 27,
    riskLevel: "Low",
    riskScore: 35,
    riskColor: "#22c55e",
    riskFactors: ["Stable soil conditions", "Normal canopy temperature"],
    cropRisk: {
      crop: "Paddy & Vegetables",
      stage: "Vegetative Stage",
      level: "Low Risk",
      alertTitle: "Favorable Field Conditions",
      summary: "Normal growth progression with stable rainfall and low pathogen vectors.",
      actions: ["Normal field operations can continue."]
    }
  },
  "m_p5": {
    id: "m_p5",
    name: "Basulia",
    block: "Mahishadal",
    district: "PurbaMedinipur",
    state: "West Bengal",
    lat: 22.205,
    lng: 87.965,
    rainfall: 26.0,
    rainfallStatus: "Moderate Rain (26.0 mm)",
    rainProb: 76,
    temp: 31.9,
    feelsLike: 36.6,
    humidity: 83,
    dewPoint: 25.1,
    soilMoisture: "82% (Moist)",
    windSpeed: 20,
    windDirection: "S (185°)",
    windGust: 30,
    riskLevel: "Moderate",
    riskScore: 50,
    riskColor: "#facc15",
    riskFactors: ["Moderate cloud cover", "Dew condensation"],
    cropRisk: {
      crop: "Paddy & Jute",
      stage: "Tillering Stage",
      level: "Moderate Risk",
      alertTitle: "Stem Borer Monitoring",
      summary: "Favorable rainfall accumulation for tillering. High humidity warrants pest vigilance.",
      actions: ["Monitor pest threshold levels."]
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
    mockPanchayatDetails["p8"],
    mockPanchayatDetails["p9"],
    mockPanchayatDetails["p10"]
  ],
  "Singur": [
    mockPanchayatDetails["p11"],
    mockPanchayatDetails["p12"],
    mockPanchayatDetails["p13"],
    mockPanchayatDetails["p14"],
    mockPanchayatDetails["p15"]
  ],
  "Haripal": [
    mockPanchayatDetails["p16"],
    mockPanchayatDetails["p17"],
    mockPanchayatDetails["p18"],
    mockPanchayatDetails["p19"],
    mockPanchayatDetails["p20"]
  ],
  "Mahishadal": [
    mockPanchayatDetails["m_p1"],
    mockPanchayatDetails["m_p2"],
    mockPanchayatDetails["m_p3"],
    mockPanchayatDetails["m_p4"],
    mockPanchayatDetails["m_p5"]
  ]
}

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}

export const KNOWN_BLOCK_CENTROIDS = {
  "mahishadal": [22.180, 87.985],
  "tamluk": [22.298, 87.922],
  "haldia": [22.065, 88.070],
  "nandigram": [22.010, 87.985],
  "nandigram-i": [22.010, 87.985],
  "nandigram-ii": [21.930, 87.950],
  "contai": [21.780, 87.750],
  "contai-i": [21.780, 87.750],
  "contai-iii": [21.840, 87.680],
  "panskura": [22.420, 87.730],
  "kolaghat": [22.430, 87.870],
  "sutahata": [22.140, 88.080],
  "polba-dadpur": [22.952, 88.304],
  "chinsurah-mogra": [22.903, 88.397],
  "singur": [22.813, 88.232],
  "haripal": [22.831, 88.117],
  "tarakeswar": [22.880, 88.020],
  "arambagh": [22.880, 87.780],
  "krishnanagar-i": [23.400, 88.500],
  "ranaghat-i": [23.180, 88.580],
  "santipur": [23.250, 88.430],
  "burdwan-i": [23.240, 87.860],
  "burdwan-ii": [23.250, 87.880],
  "kalna-i": [23.220, 88.360],
  "uluberia-i": [22.470, 88.110],
  "bally-jagachha": [22.650, 88.340],
  "barasat-i": [22.720, 88.480],
  "habra-i": [22.830, 88.630],
  "basirhat-i": [22.660, 88.870],
  "baruipur": [22.360, 88.430],
  "diamond harbour-i": [22.190, 88.190],
  "canning-i": [22.310, 88.660],
  "bankura-i": [23.230, 87.070],
  "bishnupur": [23.070, 87.320],
  "malda": [25.010, 88.140],
  "murshidabad": [24.180, 88.270]
}

// Automatically generates authentic Gram Panchayats with geo-coordinates and weather for ANY block
export function generatePanchayatsForBlock(blockName, district = "West Bengal") {
  const cleanName = blockName.trim()
  const key = cleanName.toLowerCase()
  const known = KNOWN_BLOCK_CENTROIDS[key]

  const baseLat = known ? known[0] : 22.25 + (Math.abs(hashString(cleanName) % 130) / 100)
  const baseLng = known ? known[1] : 87.85 + (Math.abs(hashString(cleanName + 'lng') % 85) / 100)

  const panchayatNames = [
    `${cleanName} North`,
    `${cleanName} Gram-I`,
    `${cleanName} Central`,
    `${cleanName} South`,
    `${cleanName} East`
  ]

  const created = panchayatNames.map((name, idx) => {
    const id = `dyn_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_p${idx + 1}`
    const offsetLat = (idx === 0 ? 0.022 : idx === 1 ? -0.018 : idx === 2 ? 0.005 : idx === 3 ? -0.025 : 0.015)
    const offsetLng = (idx === 0 ? -0.012 : idx === 1 ? 0.024 : idx === 2 ? 0.000 : idx === 3 ? -0.020 : 0.022)
    const lat = +(baseLat + offsetLat).toFixed(4)
    const lng = +(baseLng + offsetLng).toFixed(4)

    const rain = +(12.0 + (Math.abs(hashString(id + 'r') % 260) / 10)).toFixed(1)
    const temp = +(29.5 + (Math.abs(hashString(id + 't') % 45) / 10)).toFixed(1)
    const hum = 66 + (Math.abs(hashString(id + 'h') % 24))
    const wind = 12 + (Math.abs(hashString(id + 'w') % 16))
    const gust = wind + 8 + (Math.abs(hashString(id + 'g') % 10))

    const p = {
      id,
      name,
      block: cleanName,
      district: district || "West Bengal",
      state: "West Bengal",
      lat,
      lng,
      rainfall: rain,
      rainfallStatus: rain >= 30 ? `Heavy Rain (${rain} mm)` : rain >= 12 ? `Moderate Rain (${rain} mm)` : `Light Rain (${rain} mm)`,
      rainProb: Math.min(92, Math.max(35, Math.round(rain * 2.2))),
      temp,
      feelsLike: +(temp + 4.2).toFixed(1),
      humidity: hum,
      dewPoint: +(temp - (100 - hum) / 5).toFixed(1),
      soilMoisture: rain >= 25 ? "85% (High Moisture)" : "72% (Optimal)",
      windSpeed: wind,
      windDirection: "SSW (205°)",
      windGust: gust,
      riskLevel: rain >= 30 || temp >= 33.5 ? "High" : rain >= 15 ? "Moderate" : "Low",
      riskScore: Math.round(rain * 1.5 + (temp > 32 ? 20 : 5)),
      riskColor: rain >= 30 || temp >= 33.5 ? "#f97316" : rain >= 15 ? "#facc15" : "#22c55e",
      riskFactors: ["Localized microclimate flux", "Precipitation gradient"],
      cropRisk: {
        crop: "Rice / Multi-crop",
        stage: "Vegetative Stage",
        level: rain >= 30 ? "High Risk" : "Moderate Risk",
        levelColor: rain >= 30 ? "#f97316" : "#facc15",
        alertTitle: "Field Telemetry Active",
        summary: `Microclimate telemetry active for ${name}. Moisture levels favorable for seasonal crops.`,
        actions: ["Maintain clear irrigation runoffs.", "Follow local block advisory."]
      }
    }
    mockPanchayatDetails[id] = p
    return p
  })

  mockPanchayats[cleanName] = created
  return created
}

export const getPanchayatsForBlock = (block) => {
  if (!block) return mockPanchayats["Polba-Dadpur"]
  const trimmed = block.trim()
  if (mockPanchayats[trimmed]) return mockPanchayats[trimmed]
  
  // Case-insensitive lookup
  const foundKey = Object.keys(mockPanchayats).find(k => k.toLowerCase() === trimmed.toLowerCase())
  if (foundKey) return mockPanchayats[foundKey]

  // Automatically generate authentic panchayats for this block!
  return generatePanchayatsForBlock(trimmed)
}

export const getPanchayatDetail = (pid) => mockPanchayatDetails[pid] || mockPanchayatDetails["p1"]

export const getDistrictForBlock = (block) => {
  if (!block) return "PurbaMedinipur"
  const b = block.trim().toLowerCase()
  for (const [dist, blkList] of Object.entries(mockBlocks || {})) {
    if (blkList.some(item => item.toLowerCase() === b)) {
      return dist
    }
  }
  if (b.includes("tamluk") || b.includes("haldia") || b.includes("mahishadal") || b.includes("contai") || b.includes("nandigram")) {
    return "PurbaMedinipur"
  }
  if (b.includes("polba") || b.includes("singur") || b.includes("haripal") || b.includes("chinsurah") || b.includes("mogra")) {
    return "Hooghly"
  }
  if (b.includes("burdwan") || b.includes("kalna")) {
    return "Burdwan"
  }
  if (b.includes("krishnanagar") || b.includes("ranaghat") || b.includes("santipur")) {
    return "Nadia"
  }
  if (b.includes("uluberia") || b.includes("bally")) {
    return "Howrah"
  }
  if (b.includes("bankura") || b.includes("bishnupur")) {
    return "Bankura"
  }
  if (b.includes("barasat") || b.includes("habra") || b.includes("basirhat")) {
    return "North 24 Parganas"
  }
  if (b.includes("baruipur") || b.includes("canning") || b.includes("diamond")) {
    return "South 24 Parganas"
  }
  return "PurbaMedinipur"
}


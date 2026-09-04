import { mockPanchayatDetails, getPanchayatDetail } from './mockPanchayats'

export const riskCategoryConfig = {
  "heavy-rainfall": {
    id: "heavy-rainfall",
    name: "Heavy Rainfall",
    icon: "i-cloud",
    color: "#3b82f6",
    badgeBg: "rgba(59, 130, 246, 0.15)",
    border: "rgba(59, 130, 246, 0.3)",
    unit: "mm/24h",
    parameter: "Precipitation Accumulation"
  },
  "waterlogging": {
    id: "waterlogging",
    name: "Waterlogging / Flood",
    icon: "i-flood",
    color: "#06b6d4",
    badgeBg: "rgba(6, 182, 212, 0.15)",
    border: "rgba(6, 182, 212, 0.3)",
    unit: "cm depth",
    parameter: "Soil Saturation & Runoff"
  },
  "heat-stress": {
    id: "heat-stress",
    name: "Heat Stress",
    icon: "i-flame",
    color: "#f97316",
    badgeBg: "rgba(249, 115, 22, 0.15)",
    border: "rgba(249, 115, 22, 0.3)",
    unit: "°C (HI)",
    parameter: "Temperature-Humidity Index"
  },
  "drought": {
    id: "drought",
    name: "Drought / Dry Spell",
    icon: "i-drought",
    color: "#eab308",
    badgeBg: "rgba(234, 179, 8, 0.15)",
    border: "rgba(234, 179, 8, 0.3)",
    unit: "SPEI index",
    parameter: "Soil Moisture Deficit"
  },
  "strong-wind": {
    id: "strong-wind",
    name: "Strong Wind",
    icon: "i-wind-strong",
    color: "#a855f7",
    badgeBg: "rgba(168, 85, 247, 0.15)",
    border: "rgba(168, 85, 247, 0.3)",
    unit: "km/h gust",
    parameter: "Atmospheric Pressure Gradient"
  },
  "cold-stress": {
    id: "cold-stress",
    name: "Cold Stress",
    icon: "i-snowflake",
    color: "#38bdf8",
    badgeBg: "rgba(56, 189, 248, 0.15)",
    border: "rgba(56, 189, 248, 0.3)",
    unit: "°C min",
    parameter: "Minimum Night Temperature"
  }
}

export const riskLevelColors = {
  CRITICAL: {
    bg: "rgba(239, 68, 68, 0.18)",
    border: "rgba(239, 68, 68, 0.5)",
    solidBorder: "#ef4444",
    text: "#fca5a5",
    glow: "rgba(239, 68, 68, 0.35)",
    label: "CRITICAL",
    badgeClass: "badge-critical"
  },
  HIGH: {
    bg: "rgba(249, 115, 22, 0.18)",
    border: "rgba(249, 115, 22, 0.5)",
    solidBorder: "#f97316",
    text: "#fdba74",
    glow: "rgba(249, 115, 22, 0.3)",
    label: "HIGH",
    badgeClass: "badge-high"
  },
  MODERATE: {
    bg: "rgba(234, 179, 8, 0.18)",
    border: "rgba(234, 179, 8, 0.5)",
    solidBorder: "#eab308",
    text: "#fde047",
    glow: "rgba(234, 179, 8, 0.25)",
    label: "MODERATE",
    badgeClass: "badge-moderate"
  },
  LOW: {
    bg: "rgba(34, 197, 94, 0.14)",
    border: "rgba(34, 197, 94, 0.4)",
    solidBorder: "#22c55e",
    text: "#86efac",
    glow: "rgba(34, 197, 94, 0.2)",
    label: "LOW",
    badgeClass: "badge-low"
  }
}

export const mockPanchayatRisks = {
  "p1": {
    panchayatName: "Amnan (Polba)",
    overallThreatLevel: "HIGH",
    threatScore: 82,
    summary: "Heavy convective rainfall and lowland flood risk active for the next 24 hours. Immediate drainage clearing advised.",
    lastUpdated: "Today, 06:45 PM",
    alerts: [
      {
        id: "alt-p1-1",
        type: "Heavy Rainfall",
        level: "HIGH",
        title: "Heavy Rainfall Alert",
        headline: "Heavy rainfall expected in the next 24 hours.",
        validUntil: "Tomorrow, 8:00 PM",
        issuedAt: "Today, 06:00 PM",
        affectedZones: ["Amnan Lower Fields", "Polba West Drainage Sector", "Babnan Channel Confluence"],
        bulletinText: "Intense downpours (30-45mm) forecast over the block. Saturated topsoil will cause rapid water accumulation in low-lying paddy plots.",
        actions: [
          "Open peripheral field drainage outlets immediately",
          "Postpone foliar pesticide spraying and top-dressing with nitrogen",
          "Ensure harvested produce and seed nurseries are stored in raised dry platforms"
        ],
        acknowledged: false
      },
      {
        id: "alt-p1-2",
        type: "Waterlogging / Flood",
        level: "MODERATE",
        title: "Waterlogging Watch",
        headline: "Moderate water stagnancy anticipated in low-elevation crop zones.",
        validUntil: "Tomorrow, 11:30 PM",
        issuedAt: "Today, 05:15 PM",
        affectedZones: ["Low-lying Tillering Beds", "Bandel Canal Outfall"],
        bulletinText: "Runoff velocity remains slow due to silted trenches. Water depth may exceed 12 cm in depression zones.",
        actions: [
          "Inspect bund height and clear weed blockages from main ditches",
          "Prepare portable suction pumps for vulnerable nursery plots"
        ],
        acknowledged: false
      }
    ],
    risks: [
      {
        id: "heavy-rainfall",
        category: "Heavy Rainfall",
        riskLevel: "HIGH",
        severity: "Severe (34.5 mm/24h)",
        probability: 88,
        expectedTime: "Next 4 - 8 Hours",
        description: "Intense precipitation spells likely as monsoon convective cells track eastward. High runoff potential on saturated soil.",
        affectedCrops: ["Rice (Tillering)", "Jute (Vegetative)", "Vegetables"],
        mitigation: "Halt all chemical applications; reinforce drainage channels to avert water stagnancy.",
        metrics: {
          "Accumulation Rate": "8.5 mm/h",
          "Soil Moisture": "94% Saturation",
          "Flash Runoff Risk": "High"
        }
      },
      {
        id: "waterlogging",
        category: "Waterlogging / Flood",
        riskLevel: "HIGH",
        severity: "High (Submersion risk 10-18 cm)",
        probability: 76,
        expectedTime: "Tonight into Tomorrow Morning",
        description: "Depression plots in low river basins face standing water accumulation. Risk of root suffocation in non-submergence tolerant varieties.",
        affectedCrops: ["Vegetables", "Sesame", "Young Rice Seedlings"],
        mitigation: "Dig temporary trenches at 10m intervals; facilitate unimpeded gravitational drainage.",
        metrics: {
          "Infiltration Rate": "Slow (Clayey)",
          "Field Water Level": "+14 cm",
          "Drainage Efficiency": "42%"
        }
      },
      {
        id: "heat-stress",
        category: "Heat Stress",
        riskLevel: "LOW",
        severity: "Low (Max 32°C, HI 36°C)",
        probability: 18,
        expectedTime: "Tomorrow, 01:00 PM - 04:00 PM",
        description: "Subdued solar radiation and cloud cover maintain moderate daytime temperatures below physiological stress thresholds.",
        affectedCrops: ["None significantly impacted"],
        mitigation: "Standard daylight operations may continue safely.",
        metrics: {
          "Peak Temp": "32°C",
          "Heat Index": "36°C",
          "VPD Index": "1.1 kPa"
        }
      },
      {
        id: "drought",
        category: "Drought / Dry Spell",
        riskLevel: "LOW",
        severity: "None (Adequate moisture)",
        probability: 5,
        expectedTime: "Next 10 Days",
        description: "Abundant soil water reserves and ongoing precipitation guarantee sufficient moisture for the root zone.",
        affectedCrops: ["None"],
        mitigation: "Conserve excess runoff in farm ponds for potential post-monsoon dry spells.",
        metrics: {
          "Moisture Deficit": "0.0 mm",
          "SPEI Index": "+1.8 (Wet)",
          "Groundwater Depth": "2.4m"
        }
      },
      {
        id: "strong-wind",
        category: "Strong Wind",
        riskLevel: "MODERATE",
        severity: "Moderate (Gusts up to 38 km/h)",
        probability: 62,
        expectedTime: "Tonight, 08:00 PM - 02:00 AM",
        description: "Squally wind gusts accompanying thunderstorm cells may tilt tall standing crops and destabilize light nursery netting.",
        affectedCrops: ["Jute", "Banana", "Tall Rice"],
        mitigation: "Provide mechanical earthing-up and bamboo staking for banana trees and horticultural plants.",
        metrics: {
          "Sustained Speed": "24 km/h",
          "Peak Gusts": "38 km/h",
          "Direction": "South-Southeast"
        }
      },
      {
        id: "cold-stress",
        category: "Cold Stress",
        riskLevel: "LOW",
        severity: "Minimal (Min 27°C)",
        probability: 2,
        expectedTime: "Overnight",
        description: "Warm nocturnal tropical temperatures well above chilling injury baseline of 15°C.",
        affectedCrops: ["None"],
        mitigation: "No action needed.",
        metrics: {
          "Min Night Temp": "27°C",
          "Dew Point": "25°C",
          "Chilling Hours": "0"
        }
      }
    ]
  },
  "p2": {
    panchayatName: "Babnan (Polba)",
    overallThreatLevel: "MODERATE",
    threatScore: 54,
    summary: "Scattered showers with intermittent cloud cover. Minor waterlogging risk in clay-heavy lowland plots.",
    lastUpdated: "Today, 07:00 PM",
    alerts: [
      {
        id: "alt-p2-1",
        type: "Heavy Rainfall",
        level: "MODERATE",
        title: "Heavy Rainfall Alert",
        headline: "Heavy rainfall expected in the next 24 hours.",
        validUntil: "Tomorrow, 8:00 PM",
        issuedAt: "Today, 06:15 PM",
        affectedZones: ["Babnan North", "Dadpur Road Farmlands"],
        bulletinText: "Passing rain bands expected to bring 12-20mm rainfall. Favorable for paddy tillering but avoid chemical spray.",
        actions: [
          "Delay pesticide and fertilizer application until skies clear",
          "Check bund stability"
        ],
        acknowledged: false
      }
    ],
    risks: [
      {
        id: "heavy-rainfall",
        category: "Heavy Rainfall",
        riskLevel: "MODERATE",
        severity: "Moderate (12.0 mm/24h)",
        probability: 58,
        expectedTime: "Tomorrow Morning",
        description: "Steady intermittent showers providing beneficial moisture without severe erosion hazards.",
        affectedCrops: ["Vegetables"],
        mitigation: "Delay foliar chemical treatments for 24 hours.",
        metrics: {
          "Accumulation Rate": "3.5 mm/h",
          "Soil Moisture": "78% Field Capacity",
          "Flash Runoff Risk": "Moderate"
        }
      },
      {
        id: "waterlogging",
        category: "Waterlogging / Flood",
        riskLevel: "MODERATE",
        severity: "Mild (5-8 cm depth)",
        probability: 44,
        expectedTime: "Tomorrow Afternoon",
        description: "Localized pooling in depression furrows. Drainage channels able to handle load if kept debris-free.",
        affectedCrops: ["Chilli", "Tomato", "Pulses"],
        mitigation: "Clear trash from main drainage outlet gates.",
        metrics: {
          "Infiltration Rate": "Moderate",
          "Field Water Level": "+6 cm",
          "Drainage Efficiency": "70%"
        }
      },
      {
        id: "heat-stress",
        category: "Heat Stress",
        riskLevel: "LOW",
        severity: "Low (30°C max)",
        probability: 12,
        expectedTime: "Tomorrow, 12:00 PM - 03:00 PM",
        description: "Overcast conditions provide shade and moderate plant transpiration.",
        affectedCrops: ["None"],
        mitigation: "Normal routine farm chores recommended.",
        metrics: {
          "Peak Temp": "30°C",
          "Heat Index": "34°C",
          "VPD Index": "0.9 kPa"
        }
      },
      {
        id: "drought",
        category: "Drought / Dry Spell",
        riskLevel: "LOW",
        severity: "None",
        probability: 8,
        expectedTime: "Next 14 Days",
        description: "Soil moisture levels remain optimal for vegetative tillering.",
        affectedCrops: ["None"],
        mitigation: "Maintain standard weir levels in paddy plots.",
        metrics: {
          "Moisture Deficit": "0.0 mm",
          "SPEI Index": "+0.9 (Normal-Wet)",
          "Groundwater Depth": "2.8m"
        }
      },
      {
        id: "strong-wind",
        category: "Strong Wind",
        riskLevel: "LOW",
        severity: "Light (Gusts up to 22 km/h)",
        probability: 25,
        expectedTime: "Intermittent",
        description: "Gentle to moderate breeze causing no structural or mechanical crop stress.",
        affectedCrops: ["None"],
        mitigation: "No precautions needed.",
        metrics: {
          "Sustained Speed": "14 km/h",
          "Peak Gusts": "22 km/h",
          "Direction": "South"
        }
      },
      {
        id: "cold-stress",
        category: "Cold Stress",
        riskLevel: "LOW",
        severity: "Minimal (Min 28°C)",
        probability: 1,
        expectedTime: "Night",
        description: "Tropical night temperature keeps crops within ideal metabolic thermal envelope.",
        affectedCrops: ["None"],
        mitigation: "No protective measures required.",
        metrics: {
          "Min Night Temp": "28°C",
          "Dew Point": "24°C",
          "Chilling Hours": "0"
        }
      }
    ]
  },
  "p3": {
    panchayatName: "Sugandhya",
    overallThreatLevel: "CRITICAL",
    threatScore: 89,
    summary: "Severe Heat Stress and Dry Spell warning in effect. High temperature spike coupled with intense afternoon solar irradiance.",
    lastUpdated: "Today, 07:15 PM",
    alerts: [
      {
        id: "alt-p3-1",
        type: "Heat Stress",
        level: "CRITICAL",
        title: "Severe Heat Stress Alert",
        headline: "Dangerous heatwave conditions with Heat Index reaching 42°C+.",
        validUntil: "Tomorrow, 8:00 PM",
        issuedAt: "Today, 05:30 PM",
        affectedZones: ["Sugandhya Agricultural Belt", "Polba Eastern Plateau", "Hooghly Uplands"],
        bulletinText: "Maximum temperature forecast at 36-38°C with high solar insolation. Extreme thermal stress risk on flowering crops and field labor.",
        actions: [
          "Apply light and frequent sprinkler/drip irrigation during early morning (5-8 AM) and evening",
          "Avoid direct field manual labor between 11:30 AM and 03:30 PM",
          "Provide mulching around vegetable beds to retain soil moisture and reduce root heat"
        ],
        acknowledged: false
      },
      {
        id: "alt-p3-2",
        type: "Drought / Dry Spell",
        level: "HIGH",
        title: "Dry Spell Warning",
        headline: "Zero rainfall expected for 5+ days with high evapotranspiration rate.",
        validUntil: "In 3 Days, 06:00 PM",
        issuedAt: "Today, 04:00 PM",
        affectedZones: ["Unirrigated Upland Plots", "Sugandhya North"],
        bulletinText: "Topsoil moisture dropping below 35% field capacity. Critical irrigation needed for flowering stage crops.",
        actions: [
          "Activate solar pumps for rotational tube-well irrigation",
          "Apply organic straw mulch to conserve moisture"
        ],
        acknowledged: false
      }
    ],
    risks: [
      {
        id: "heat-stress",
        category: "Heat Stress",
        riskLevel: "CRITICAL",
        severity: "Extreme (36°C ambient, 42°C HI)",
        probability: 95,
        expectedTime: "Tomorrow, 11:00 AM - 04:30 PM",
        description: "Severe atmospheric heating causing pollen sterility in flowering crops and accelerated leaf scorched margins.",
        affectedCrops: ["Rice (Flowering)", "Vegetables", "Sesame", "Maize"],
        mitigation: "Execute evening canopy micro-sprinkling; apply anti-transpirants or potassium nitrate spray.",
        metrics: {
          "Peak Temp": "36°C",
          "Heat Index": "42.4°C",
          "VPD Index": "3.8 kPa (Severe)"
        }
      },
      {
        id: "drought",
        category: "Drought / Dry Spell",
        riskLevel: "HIGH",
        severity: "High (0.0mm rain, ET 6.2 mm/day)",
        probability: 84,
        expectedTime: "Next 5 - 7 Days",
        description: "Rapid soil moisture depletion in the upper 15cm root zone. High wilting vulnerability in newly planted saplings.",
        affectedCrops: ["Vegetables", "Young Jute", "Pulses"],
        mitigation: "Apply straw mulching to conserve moisture; prioritize deficit irrigation on high-value patches.",
        metrics: {
          "Moisture Deficit": "-28.5 mm",
          "SPEI Index": "-1.9 (Dry)",
          "Soil Moisture": "32% Field Capacity"
        }
      },
      {
        id: "heavy-rainfall",
        category: "Heavy Rainfall",
        riskLevel: "LOW",
        severity: "Nil (0.0 mm/24h)",
        probability: 4,
        expectedTime: "No Rain Expected",
        description: "Clear skies and low atmospheric relative humidity suppress convective cloud development.",
        affectedCrops: ["None"],
        mitigation: "Ideal conditions for open-air grain drying and solarization.",
        metrics: {
          "Accumulation Rate": "0.0 mm/h",
          "Soil Moisture": "Dry",
          "Flash Runoff Risk": "Zero"
        }
      },
      {
        id: "waterlogging",
        category: "Waterlogging / Flood",
        riskLevel: "LOW",
        severity: "None",
        probability: 2,
        expectedTime: "None",
        description: "No flood danger. Fields dry and accessible for tractor tilling.",
        affectedCrops: ["None"],
        mitigation: "Ensure bunds are closed to retain any upcoming artificial irrigation water.",
        metrics: {
          "Infiltration Rate": "Very High",
          "Field Water Level": "0 cm",
          "Drainage Efficiency": "100%"
        }
      },
      {
        id: "strong-wind",
        category: "Strong Wind",
        riskLevel: "LOW",
        severity: "Gentle (Gusts 14 km/h)",
        probability: 15,
        expectedTime: "Afternoon thermal breeze",
        description: "Light wind velocity with low kinematic impact on crops.",
        affectedCrops: ["None"],
        mitigation: "Spraying of micronutrients can be safely scheduled in early morning.",
        metrics: {
          "Sustained Speed": "9 km/h",
          "Peak Gusts": "14 km/h",
          "Direction": "West-Northwest"
        }
      },
      {
        id: "cold-stress",
        category: "Cold Stress",
        riskLevel: "LOW",
        severity: "None",
        probability: 1,
        expectedTime: "None",
        description: "No cold shock potential.",
        affectedCrops: ["None"],
        mitigation: "No action required.",
        metrics: {
          "Min Night Temp": "29°C",
          "Dew Point": "21°C",
          "Chilling Hours": "0"
        }
      }
    ]
  },
  "p5": {
    panchayatName: "Rajhat (Polba)",
    overallThreatLevel: "CRITICAL",
    threatScore: 94,
    summary: "Torrential Rainstorm, Extreme Flood Risk, and Squally Winds active. High danger of crop lodging and bund breaches.",
    lastUpdated: "Today, 07:20 PM",
    alerts: [
      {
        id: "alt-p5-1",
        type: "Heavy Rainfall",
        level: "CRITICAL",
        title: "Heavy Rainfall Alert",
        headline: "Heavy rainfall expected in the next 24 hours.",
        validUntil: "Tomorrow, 8:00 PM",
        issuedAt: "Today, 05:00 PM",
        affectedZones: ["Rajhat Lowlands", "Behala River Catchment", "Polba South Belt"],
        bulletinText: "Over 48mm of rainfall forecast in a compressed window. Severe surface inundation and topsoil wash-away expected on unbunded fields.",
        actions: [
          "Evacuate cattle and farm machinery from riverine flats",
          "Create emergency spillways along field perimeters to prevent bund collapse",
          "Do not enter waterlogged fields during lightning episodes"
        ],
        acknowledged: false
      },
      {
        id: "alt-p5-2",
        type: "Waterlogging / Flood",
        level: "CRITICAL",
        title: "Flash Waterlogging & Inundation Warning",
        headline: "Flood water depth exceeding 20cm expected across low-lying paddy zones.",
        validUntil: "Tomorrow, 10:00 PM",
        issuedAt: "Today, 05:45 PM",
        affectedZones: ["Polba-Dadpur Drainage Basin", "Rajhat Sector 1-4"],
        bulletinText: "River backflow and saturated local canals will prevent fast natural drainage. Submergence beyond 48 hours will cause root rot in young rice.",
        actions: [
          "Deploy high-capacity diesel de-watering pumps",
          "Clear aquatic weeds and plastic choke points at culverts"
        ],
        acknowledged: false
      },
      {
        id: "alt-p5-3",
        type: "Strong Wind",
        level: "HIGH",
        title: "High Wind & Squall Advisory",
        headline: "Gusts reaching 46 km/h expected with squall lines.",
        validUntil: "Tonight, 11:59 PM",
        issuedAt: "Today, 06:00 PM",
        affectedZones: ["Open Agricultural Plains", "Polba Ridge"],
        bulletinText: "High wind sheer likely to cause mechanical lodging in mature jute and lodging-prone rice varieties.",
        actions: [
          "Tie together top foliage of tall jute plants in bunches of 4-5 to improve lodging resistance",
          "Secure greenhouse polytunnels and shade netting"
        ],
        acknowledged: false
      }
    ],
    risks: [
      {
        id: "heavy-rainfall",
        category: "Heavy Rainfall",
        riskLevel: "CRITICAL",
        severity: "Extreme (48.2 mm/24h)",
        probability: 96,
        expectedTime: "Next 2 - 6 Hours",
        description: "Cloudburst-grade downpours with intense rainfall rates exceeding 18 mm/hr. Severe splash erosion and nutrient leaching.",
        affectedCrops: ["All standing crops", "Rice Seedlings", "Vegetables", "Jute"],
        mitigation: "Maintain continuous drainage vigilance; halt all chemical and field operations.",
        metrics: {
          "Accumulation Rate": "18.2 mm/h",
          "Soil Moisture": "100% Saturated",
          "Flash Runoff Risk": "Extreme"
        }
      },
      {
        id: "waterlogging",
        category: "Waterlogging / Flood",
        riskLevel: "CRITICAL",
        severity: "Severe (Depth 18-26 cm)",
        probability: 92,
        expectedTime: "Ongoing for 36 Hours",
        description: "Prolonged submersion risk. Lowland plots will remain waterlogged without manual de-watering interventions.",
        affectedCrops: ["Rice (Tillering)", "Vegetable Nurseries", "Banana"],
        mitigation: "Mobilize cooperative tractor pumps; clear all canal culverts of choking debris.",
        metrics: {
          "Infiltration Rate": "Zero (Ponding)",
          "Field Water Level": "+22 cm",
          "Drainage Efficiency": "18%"
        }
      },
      {
        id: "strong-wind",
        category: "Strong Wind",
        riskLevel: "HIGH",
        severity: "Severe (Gusts to 46 km/h)",
        probability: 82,
        expectedTime: "Tonight, 07:00 PM - 02:00 AM",
        description: "Convective downdrafts producing strong crosswinds capable of lodging tall crop stands and tearing polyhouses.",
        affectedCrops: ["Jute", "Sugarcane", "Banana", "Tree Crops"],
        mitigation: "Support fruiting branches with bamboo props; reinforce polyhouse anchor ropes.",
        metrics: {
          "Sustained Speed": "34 km/h",
          "Peak Gusts": "46 km/h",
          "Direction": "South-West"
        }
      },
      {
        id: "heat-stress",
        category: "Heat Stress",
        riskLevel: "LOW",
        severity: "Low (28°C max)",
        probability: 4,
        expectedTime: "None",
        description: "Cooled by heavy rainfall and cloud shade. Thermal stress index is negligible.",
        affectedCrops: ["None"],
        mitigation: "No action required.",
        metrics: {
          "Peak Temp": "28°C",
          "Heat Index": "30°C",
          "VPD Index": "0.4 kPa"
        }
      },
      {
        id: "drought",
        category: "Drought / Dry Spell",
        riskLevel: "LOW",
        severity: "None",
        probability: 1,
        expectedTime: "None",
        description: "Excess precipitation ensures surplus water table recharge.",
        affectedCrops: ["None"],
        mitigation: "Focus on flood mitigation rather than water conservation.",
        metrics: {
          "Moisture Deficit": "0.0 mm",
          "SPEI Index": "+2.6 (Extremely Wet)",
          "Groundwater Depth": "1.2m"
        }
      },
      {
        id: "cold-stress",
        category: "Cold Stress",
        riskLevel: "LOW",
        severity: "Low (Min 25°C)",
        probability: 6,
        expectedTime: "Night",
        description: "No chilling hazard to warm-season tropical crops.",
        affectedCrops: ["None"],
        mitigation: "No action required.",
        metrics: {
          "Min Night Temp": "25°C",
          "Dew Point": "24.5°C",
          "Chilling Hours": "0"
        }
      }
    ]
  }
}

// Fallback generator for other panchayats (p4, p6, p7, p8)
export const getRisksForPanchayat = (panchayatId, weatherData) => {
  // If static entry exists AND matches panchayatId
  if (mockPanchayatRisks[panchayatId]) {
    return mockPanchayatRisks[panchayatId]
  }

  const p = (mockPanchayatDetails && mockPanchayatDetails[panchayatId]) || getPanchayatDetail(panchayatId)
  const rain = p?.rainfall != null ? p.rainfall : parseFloat(weatherData?.rainfall || "15.0")
  const temp = p?.temp != null ? Math.round(p.temp) : parseFloat(weatherData?.temp || "30")
  const wind = p?.windSpeed != null ? p.windSpeed : parseFloat(weatherData?.wind || "18")
  const gust = p?.windGust != null ? p.windGust : Math.round(wind * 1.35)
  const hum = p?.humidity != null ? p.humidity : parseInt(weatherData?.humidity || "80")
  const pName = p?.name || weatherData?.city?.split('(')[0]?.trim() || "Panchayat"
  const blockName = p?.block || "Block"
  const cityName = `${pName} (${blockName})`

  // Assess level thresholds
  const isRainCrit = rain >= 36
  const isRainHigh = rain >= 22 && rain < 36
  const isRainMed = rain >= 10 && rain < 22
  const rainLevel = isRainCrit ? "CRITICAL" : isRainHigh ? "HIGH" : isRainMed ? "MODERATE" : "LOW"

  const isHeatCrit = temp >= 36
  const isHeatHigh = temp >= 33 && temp < 36
  const isHeatMed = temp >= 31 && temp < 33
  const heatLevel = isHeatCrit ? "CRITICAL" : isHeatHigh ? "HIGH" : isHeatMed ? "MODERATE" : "LOW"

  const isFloodHigh = rain >= 24
  const isFloodMed = rain >= 12 && rain < 24
  const floodLevel = isRainCrit ? "CRITICAL" : isFloodHigh ? "HIGH" : isFloodMed ? "MODERATE" : "LOW"

  const isWindHigh = wind >= 28 || gust >= 38
  const isWindMed = wind >= 18 && wind < 28
  const windLevel = isWindHigh ? "HIGH" : isWindMed ? "MODERATE" : "LOW"

  const droughtLevel = rain < 2 && temp > 33 ? "HIGH" : rain < 5 ? "MODERATE" : "LOW"
  const coldLevel = temp < 16 ? "HIGH" : temp < 20 ? "MODERATE" : "LOW"

  const overallThreat = p?.riskLevel ? p.riskLevel.toUpperCase() : ((isRainCrit || isHeatCrit) ? "CRITICAL" : (isRainHigh || isFloodHigh || isHeatHigh) ? "HIGH" : (isRainMed || isHeatMed || isWindMed) ? "MODERATE" : "LOW")
  const threatScore = p?.riskScore ? p.riskScore : (isRainCrit ? 92 : isRainHigh ? 78 : isHeatCrit ? 88 : isRainMed ? 58 : 34)

  // Build alerts
  const alerts = []
  if (rainLevel === "CRITICAL" || rainLevel === "HIGH" || rainLevel === "MODERATE") {
    alerts.push({
      id: `alt-rain-${panchayatId}`,
      type: "Heavy Rainfall",
      level: rainLevel,
      title: rainLevel === "CRITICAL" ? "Severe Downpour & Flash Flood Warning" : "Heavy Rainfall Alert",
      headline: `${rainLevel === "CRITICAL" ? "Severe torrential precipitation" : "Heavy rainfall"} expected in the next 24 hours (${rain} mm).`,
      validUntil: "Tomorrow, 8:00 PM",
      issuedAt: "Today, 06:00 PM",
      affectedZones: [`${pName} Lowland Plots`, `${pName} Drainage Confluence`, `${blockName} Sector`],
      bulletinText: p?.cropRisk?.summary || `Precipitation accumulation forecast at ${rain}mm. Saturated topsoil in ${pName} increases risk of water stagnation in low-lying crop fields.`,
      actions: p?.cropRisk?.actions || [
        "Open peripheral field drainage outlets immediately",
        "Postpone pesticide application and fertilizer top-dressing",
        "Elevate cut produce and seedlings to dry platforms"
      ],
      acknowledged: false
    })
  }

  if (floodLevel === "CRITICAL" || floodLevel === "HIGH") {
    alerts.push({
      id: `alt-flood-${panchayatId}`,
      type: "Waterlogging / Flood",
      level: floodLevel,
      title: "Field Waterlogging Advisory",
      headline: `Standing water risk in lower depression plots across ${pName}.`,
      validUntil: "Tomorrow, 11:30 PM",
      issuedAt: "Today, 05:30 PM",
      affectedZones: [`${pName} Low-elevation Beds`, "Canal Runoff Zone"],
      bulletinText: `Slow runoff rates and high saturation (${hum}%) may result in water depth exceeding 12-18 cm in depression plots.`,
      actions: [
        "Check bund height and clear weed blockages from outlet drains",
        "Keep mobile suction pumps on standby for water-sensitive crops"
      ],
      acknowledged: false
    })
  }

  if (windLevel === "HIGH") {
    alerts.push({
      id: `alt-wind-${panchayatId}`,
      type: "Strong Wind",
      level: "HIGH",
      title: "Squally Wind Gust Alert",
      headline: `Wind gusts up to ${gust} km/h expected during convective passage.`,
      validUntil: "Tonight, 11:00 PM",
      issuedAt: "Today, 04:30 PM",
      affectedZones: [`${pName} Farmland Borders`, "Unsheltered Open Plains"],
      bulletinText: `Gusty convective winds (${gust} km/h) may cause lodging in tall standing crops (Banana, Jute, mature paddy).`,
      actions: [
        "Provide mechanical earthing up and bamboo propping for fruit trees",
        "Secure shade netting and nursery polyhouses"
      ],
      acknowledged: false
    })
  }

  if (alerts.length === 0) {
    alerts.push({
      id: `alt-clear-${panchayatId}`,
      type: "Weather Advisory",
      level: "LOW",
      title: "Favorable Field Conditions",
      headline: `Weather parameters within normal seasonal thresholds for ${pName}.`,
      validUntil: "Tomorrow, 8:00 PM",
      issuedAt: "Today, 06:00 PM",
      affectedZones: [`${pName} Agricultural Area`],
      bulletinText: `Stable hydrometeorological indicators (${rain}mm rain, ${temp}°C). No extreme microclimate threat active.`,
      actions: [
        "Regular field operations, weeding, and fertilizer scheduling may proceed.",
        "Maintain routine pest and disease surveillance."
      ],
      acknowledged: false
    })
  }

  const risks = [
    {
      id: "heavy-rainfall",
      category: "Heavy Rainfall",
      riskLevel: rainLevel,
      severity: `${rainLevel === 'CRITICAL' ? 'Torrential' : rainLevel === 'HIGH' ? 'Severe' : rainLevel === 'MODERATE' ? 'Moderate' : 'Light'} (${rain} mm/24h)`,
      probability: rainLevel === 'CRITICAL' ? 94 : rainLevel === 'HIGH' ? 84 : rainLevel === 'MODERATE' ? 58 : 20,
      expectedTime: rainLevel === 'CRITICAL' ? 'Next 2 - 4 Hours' : rainLevel === 'HIGH' ? 'Next 6 - 12 Hours' : 'Tomorrow',
      description: `Monsoon convective cloud clusters delivering estimated ${rain}mm precipitation over ${pName}.`,
      affectedCrops: ["Rice (Tillering)", "Vegetables", "Jute"],
      mitigation: "Ensure unobstructed ditch flow; postpone foliar pesticide application.",
      metrics: {
        "Accumulation Rate": `${(rain / 5.5).toFixed(1)} mm/h`,
        "Soil Moisture": rain > 25 ? "92% Saturation" : "74% Capacity",
        "Flash Runoff Risk": rainLevel
      }
    },
    {
      id: "waterlogging",
      category: "Waterlogging / Flood",
      riskLevel: floodLevel,
      severity: `${floodLevel === 'CRITICAL' ? 'Severe' : floodLevel === 'HIGH' ? 'High' : floodLevel === 'MODERATE' ? 'Moderate' : 'Low'} (Depth ${rain > 25 ? '14-20' : rain > 12 ? '6-12' : '2-4'} cm)`,
      probability: floodLevel === 'CRITICAL' ? 90 : floodLevel === 'HIGH' ? 76 : floodLevel === 'MODERATE' ? 46 : 14,
      expectedTime: "Next 12 - 24 Hours",
      description: `Low-lying plots in ${pName} face localized ponding risk due to sustained precipitation and slow soil infiltration.`,
      affectedCrops: ["Vegetables", "Sesame", "Young Seedlings"],
      mitigation: "Dig transverse drainage channels; facilitate gravitational water runoff.",
      metrics: {
        "Infiltration Rate": "Slow (Clay-Loam)",
        "Field Water Level": `+${rain > 22 ? '14' : '4'} cm`,
        "Drainage Efficiency": rain > 22 ? "42%" : "82%"
      }
    },
    {
      id: "heat-stress",
      category: "Heat Stress",
      riskLevel: heatLevel,
      severity: `${heatLevel === 'CRITICAL' ? 'Extreme' : heatLevel === 'HIGH' ? 'High' : heatLevel === 'MODERATE' ? 'Moderate' : 'Low'} (${temp}°C, HI ${temp + 4}°C)`,
      probability: heatLevel === 'CRITICAL' ? 92 : heatLevel === 'HIGH' ? 70 : heatLevel === 'MODERATE' ? 38 : 12,
      expectedTime: "Tomorrow, 12:00 PM - 03:30 PM",
      description: `Daytime maximum temperatures hovering near ${temp}°C in ${pName}. High solar insolation during cloud breaks.`,
      affectedCrops: ["Flowering stage crops", "Vegetables"],
      mitigation: "Maintain root-zone moisture through evening irrigation; apply organic mulching.",
      metrics: {
        "Peak Temp": `${temp}°C`,
        "Heat Index": `${temp + 4}°C`,
        "VPD Index": temp > 33 ? "2.8 kPa" : "1.2 kPa"
      }
    },
    {
      id: "drought",
      category: "Drought / Dry Spell",
      riskLevel: droughtLevel,
      severity: `${droughtLevel === 'HIGH' ? 'Severe Deficit' : droughtLevel === 'MODERATE' ? 'Moderate Dryness' : 'Adequate Moisture'}`,
      probability: droughtLevel === 'HIGH' ? 76 : droughtLevel === 'MODERATE' ? 42 : 8,
      expectedTime: "Next 7 - 10 Days",
      description: rain < 5 ? `Consecutive dry spell depleting shallow moisture in ${pName}.` : `Abundant soil moisture from recent ${rain}mm precipitation.`,
      affectedCrops: ["Non-irrigated upland crops"],
      mitigation: "Conserve pond water; schedule supplemental irrigation on priority beds.",
      metrics: {
        "Moisture Deficit": rain < 5 ? "-16.0 mm" : "0.0 mm",
        "SPEI Index": rain < 5 ? "-1.2" : "+1.6",
        "Soil Moisture": rain < 5 ? "38%" : "88%"
      }
    },
    {
      id: "strong-wind",
      category: "Strong Wind",
      riskLevel: windLevel,
      severity: `${windLevel === 'HIGH' ? 'Severe Gusts' : windLevel === 'MODERATE' ? 'Moderate Gusts' : 'Light Breeze'} (${wind} km/h, Gusts ${gust} km/h)`,
      probability: windLevel === 'HIGH' ? 82 : windLevel === 'MODERATE' ? 54 : 18,
      expectedTime: "Tonight, 08:00 PM - 02:00 AM",
      description: `Wind velocities around ${wind} km/h with localized gustiness up to ${gust} km/h during storm passage.`,
      affectedCrops: ["Tall Rice", "Banana", "Jute"],
      mitigation: "Provide bamboo propping for fruit plants; secure light polyhouse structures.",
      metrics: {
        "Sustained Speed": `${wind} km/h`,
        "Peak Gusts": `${gust} km/h`,
        "Direction": "SSW (210°)"
      }
    },
    {
      id: "cold-stress",
      category: "Cold Stress",
      riskLevel: coldLevel,
      severity: `${coldLevel === 'HIGH' ? 'Chilling Risk' : coldLevel === 'MODERATE' ? 'Cool Night' : 'Minimal'} (${Math.max(12, temp - 6)}°C min)`,
      probability: coldLevel === 'HIGH' ? 70 : coldLevel === 'MODERATE' ? 30 : 2,
      expectedTime: "Overnight",
      description: `Nocturnal temperature around ${Math.max(12, temp - 6)}°C is safe for current seasonal crop stages in ${pName}.`,
      affectedCrops: ["None"],
      mitigation: "Standard seasonal agronomic care.",
      metrics: {
        "Min Night Temp": `${Math.max(12, temp - 6)}°C`,
        "Dew Point": "24°C",
        "Chilling Hours": "0"
      }
    }
  ]

  // Sort risks so dominant threat is first
  const scoreMap = { CRITICAL: 4, HIGH: 3, MODERATE: 2, LOW: 1 }
  risks.sort((a, b) => {
    const diff = (scoreMap[b.riskLevel] || 0) - (scoreMap[a.riskLevel] || 0)
    if (diff !== 0) return diff
    return (b.probability || 0) - (a.probability || 0)
  })

  return {
    panchayatName: cityName,
    overallThreatLevel: overallThreat,
    threatScore,
    summary: rain > 20 
      ? `Active precipitation & waterlogging hazard for ${pName}. Inspect bund drainage outlets immediately.`
      : temp > 33
      ? `Elevated thermal stress index in ${pName}. Maintain root-zone moisture.`
      : `Microclimate conditions within manageable seasonal parameters for ${pName}.`,
    lastUpdated: "Today, 07:15 PM",
    alerts,
    risks
  }
}

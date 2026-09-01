// Mock crops and growth stages metadata
export const mockCropsList = [
  { id: "Rice", name: "Rice (Kharif)", icon: "🌾", season: "Kharif", scientific: "Oryza sativa", duration: "120-140 Days" },
  { id: "Potato", name: "Potato", icon: "🥔", season: "Rabi", scientific: "Solanum tuberosum", duration: "90-110 Days" },
  { id: "Wheat", name: "Wheat", icon: "🌾", season: "Rabi", scientific: "Triticum aestivum", duration: "115-130 Days" },
  { id: "Jute", name: "Jute", icon: "🌿", season: "Zaid / Pre-Kharif", scientific: "Corchorus olitorius", duration: "100-120 Days" },
  { id: "Mustard", name: "Mustard", icon: "🌱", season: "Rabi", scientific: "Brassica juncea", duration: "85-100 Days" },
  { id: "Maize", name: "Maize (Corn)", icon: "🌽", season: "Kharif / Rabi", scientific: "Zea mays", duration: "95-115 Days" },
  { id: "Brinjal", name: "Brinjal (Eggplant)", icon: "🍆", season: "Year Round", scientific: "Solanum melongena", duration: "120-150 Days" },
  { id: "Pulses", name: "Pulses (Lentil/Moong)", icon: "🫘", season: "Rabi / Zaid", scientific: "Vigna radiata", duration: "65-75 Days" },
  { id: "Sesame", name: "Sesame (Til)", icon: "🌱", season: "Summer / Zaid", scientific: "Sesamum indicum", duration: "75-90 Days" },
  { id: "Betel", name: "Betel Vine (Paan)", icon: "🍃", season: "Perennial", scientific: "Piper betle", duration: "Perennial" }
]

export const mockCrops = mockCropsList.map(c => c.name)

export const mockGrowthStages = {
  "Rice (Kharif)": [
    "Seedling / Nursery",
    "Tillering",
    "Panicle Initiation",
    "Flowering",
    "Maturity & Harvesting"
  ],
  "Potato": [
    "Sprouting & Emergence",
    "Vegetative Growth",
    "Tuber Initiation",
    "Tuber Bulking",
    "Maturation & Skin Hardening"
  ],
  "Wheat": [
    "Crown Root Initiation (CRI)",
    "Tillering",
    "Jointing / Booting",
    "Flowering & Heading",
    "Dough & Grain Hardening"
  ],
  "Jute": [
    "Seedling & Emergence",
    "Active Vegetative Growth",
    "Pod & Fiber Ripening",
    "Harvesting & Retting"
  ],
  "Mustard": [
    "Vegetative / Rosette",
    "Flowering",
    "Pod Formation (Siliqua)",
    "Seed Filling & Maturity"
  ],
  "Maize (Corn)": [
    "Germination & Seedling",
    "Knee-High Vegetative",
    "Tasseling & Silking",
    "Grain Filling",
    "Maturity"
  ],
  "Brinjal (Eggplant)": [
    "Nursery & Transplanting",
    "Early Vegetative",
    "Flowering & Fruit Set",
    "Fruit Harvesting"
  ],
  "Pulses (Lentil/Moong)": [
    "Seedling",
    "Vegetative Branching",
    "Flowering",
    "Pod Formation & Maturity"
  ],
  "Sesame (Til)": [
    "Seedling",
    "Branching",
    "Flowering & Capsule Set",
    "Capsule Ripening"
  ],
  "Betel Vine (Paan)": [
    "Vine Establishment",
    "Active Leaf Emergence",
    "Leaf Plucking / Harvesting"
  ]
}

// Stage details (Days After Sowing, Sensitivity, Water Need)
export const stageMetadata = {
  "Seedling / Nursery": { das: "0-20 DAS", sensitivity: "High", waterNeed: "Saturated soil, shallow water" },
  "Tillering": { das: "21-45 DAS", sensitivity: "High", waterNeed: "2-5 cm standing water" },
  "Panicle Initiation": { das: "46-65 DAS", sensitivity: "Critical", waterNeed: "5 cm standing water" },
  "Flowering": { das: "66-85 DAS", sensitivity: "Maximum Critical", waterNeed: "5 cm standing water, no flooding" },
  "Maturity & Harvesting": { das: "86-120 DAS", sensitivity: "Medium", waterNeed: "Field drainage / dry soil" },
  
  "Sprouting & Emergence": { das: "0-15 DAS", sensitivity: "Medium", waterNeed: "Light moisture, no waterlogging" },
  "Vegetative Growth": { das: "16-35 DAS", sensitivity: "High", waterNeed: "Moderate moisture, earthing up" },
  "Tuber Initiation": { das: "36-50 DAS", sensitivity: "Critical", waterNeed: "Uniform moisture, avoid dry spell" },
  "Tuber Bulking": { das: "51-75 DAS", sensitivity: "Critical", waterNeed: "Frequent light irrigation" },
  "Maturation & Skin Hardening": { das: "76-95 DAS", sensitivity: "Low", waterNeed: "Withhold water 10-12 days before harvest" }
}

// Dynamic advisory generator based on Panchayat Weather, Crop, and Growth Stage
export const getAdvisory = (crop, stage, weather = {}, panchayatName = "Amnan") => {
  const rainfall = parseFloat(weather.rainfall) || 0
  const temp = parseFloat(weather.temp) || 30
  const humidity = parseFloat(weather.humidity) || 70
  const wind = parseFloat(weather.wind) || 15

  // Base structures
  let weatherImpact = ""
  let cropRiskLevel = "Low"
  let cropRiskScore = 25
  let riskColor = "#22c55e"
  let cropRiskTitle = "Normal Field Conditions"
  let cropRiskDetails = "Weather parameters are within optimal agronomic tolerances."
  let recommendedActions = []
  let actionsToAvoid = []
  let reasonForAdvisory = ""

  let irrigationAdvice = "Maintain standard soil moisture schedule based on stage requirements."
  let fertilizerAdvice = "Apply standard balanced NPK dosage as per crop recommendation."
  let pestAdvice = "Routine crop scouting recommended. No critical pest threshold breached."

  let sprayingSuitability = 85 // %
  let drainagePriority = "Low"
  let topDressingSuitability = 90 // %

  // 1. HEAVY RAINFALL SCENARIO (> 15mm)
  if (rainfall > 15 || weather.condition?.toLowerCase().includes("rain") || weather.condition?.toLowerCase().includes("storm")) {
    weatherImpact = `Heavy rainfall (${rainfall > 0 ? rainfall + " mm" : "25-45 mm"}) expected in the next 2 days with elevated relative humidity (${humidity}%) and gusty surface winds.`
    
    if (stage === "Flowering" || stage === "Flowering & Heading" || stage === "Flowering & Fruit Set") {
      cropRiskLevel = "High"
      cropRiskScore = 85
      riskColor = "#f97316"
      cropRiskTitle = "Submergence Hazard & Flower Dropping Threat"
      cropRiskDetails = `Flowering is the most sensitive phenological phase. Heavy rainfall causes physical flower detachment, washes away pollen grains causing spikelet sterility, and creates warm-humid microclimates that spur bacterial blight and fungal blast.`
      
      recommendedActions = [
        "Avoid unnecessary irrigation immediately; disconnect field supply channels.",
        "Ensure proper field drainage and clear silt/weeds from drainage trenches to prevent water stagnation.",
        "Consider postponing pesticide/fertilizer application if rainfall is imminent.",
        "Monitor crop for weather-related stress, lodging, and foliar fungal lesions after the rain recedes.",
        "Maintain drainage outlets so standing water in paddy does not exceed 5 cm above ground level.",
        "Inspect plot borders for early signs of Sheath Blight or Leaf Blast within 24-48 hours after rain."
      ]

      actionsToAvoid = [
        "Do not apply urea, DAP, or chemical fertilizers before rainfall to prevent nutrient leaching and surface runoff.",
        "Avoid chemical spraying when wind speed exceeds 15 km/h or foliage is saturated with raindrops.",
        "Do not allow standing water to exceed 7 cm in flowering paddy fields, as it induces root asphyxiation.",
        "Avoid walking inside waterlogged fields during heavy rain to prevent soil compaction and root damage."
      ]

      reasonForAdvisory = `Heavy downpours during flowering wash away viable pollen and saturate the root rhizosphere. Prolonged standing water impedes root respiration, increases spikelet sterility by up to 25%, and provides optimal temperature-moisture conditions for rapid bacterial and blast spore germination.`

    } else if (stage === "Seedling / Nursery" || stage === "Sprouting & Emergence") {
      cropRiskLevel = "Critical"
      cropRiskScore = 90
      riskColor = "#ef4444"
      cropRiskTitle = "Seedling Submergence & Seedling Damping-Off Risk"
      cropRiskDetails = "Young tender seedlings lack mechanical rigidity and are prone to silt encrustation, rotting, and flash inundation."

      recommendedActions = [
        "Avoid unnecessary irrigation; drain excess water from nursery beds immediately.",
        "Ensure proper field drainage channels are unobstructed around seedbeds.",
        "Consider postponing pesticide/fertilizer application until weather clears.",
        "Monitor crop for weather-related stress and fungal collar rot.",
        "Provide temporary elevated drainage cuts on nursery bunds."
      ]

      actionsToAvoid = [
        "Do not apply granular fertilizers or foliar nutrients on waterlogged seedbeds.",
        "Avoid transplanting seedlings during active stormy spells or torrential downpours.",
        "Do not allow murky stagnant rainwater to submerge the seedling shoot tips."
      ]

      reasonForAdvisory = "Submerged seedlings suffer severe oxygen starvation and collar rot (Pythium/Rhizoctonia) within 24 hours of warm standing water."

    } else if (stage === "Maturity & Harvesting" || stage === "Maturation & Skin Hardening") {
      cropRiskLevel = "Critical"
      cropRiskScore = 92
      riskColor = "#ef4444"
      cropRiskTitle = "Grain Sprouting, Lodging & Crop Rot Hazard"
      cropRiskDetails = "Mature crop standing in flooded fields risks severe lodging, mold contamination, and in-situ grain sprouting."

      recommendedActions = [
        "Drain all standing water from fields immediately through peripheral ditches.",
        "Suspend harvesting and threshing operations until sunshine resumes.",
        "Move already harvested sheaves to elevated sheds and cover securely with tarpaulins.",
        "Monitor bundled crops for moisture buildup and internal heating."
      ]

      actionsToAvoid = [
        "Do not leave harvested produce uncovered in open fields or low-lying threshing yards.",
        "Avoid threshing wet grain to prevent grain breakage and fungal discoloration.",
        "Do not store grains with moisture content exceeding 14%."
      ]

      reasonForAdvisory = "Mature grains absorb moisture rapidly during continuous showers, triggering pre-harvest viviparous sprouting and Aspergillus aflatoxin contamination."

    } else {
      // General Tillering / Vegetative under heavy rain
      cropRiskLevel = "High"
      cropRiskScore = 78
      riskColor = "#f97316"
      cropRiskTitle = "Excess Moisture & Fungal Disease Pressure"
      cropRiskDetails = `Heavy rain (${rainfall} mm) raises soil saturation to near 100%. Excessive moisture stresses vegetative growth and promotes foliar pathogens.`

      recommendedActions = [
        "Avoid unnecessary irrigation and ensure smooth outflow through drainage canals.",
        "Ensure proper field drainage to maintain standing water at an optimal 3-5 cm.",
        "Consider postponing pesticide/fertilizer application if rainfall is imminent.",
        "Monitor crop for weather-related stress and leaf folder caterpillars after downpours."
      ]

      actionsToAvoid = [
        "Do not broadcast granular fertilizers or herbicide sprays immediately before downpours.",
        "Avoid deep intercultural operations while soil is in a slurry state.",
        "Do not block boundary drainage outlets."
      ]

      reasonForAdvisory = "Excess rain causes nutrient runoff and creates high-humidity canopy conditions conducive to stem borer, brown planthopper, and sheath rot."
    }

    irrigationAdvice = "Drain excess rainwater immediately. Keep field water depth capped at 3-5 cm."
    fertilizerAdvice = "Postpone top dressing of Urea and MOP until rainfall ceases and soil moisture stabilizes."
    pestAdvice = "Scout for fungal sheath blight and bacterial leaf streak 48 hours post-rain."
    sprayingSuitability = 10
    drainagePriority = "Critical"
    topDressingSuitability = 15

  // 2. HIGH TEMPERATURE / HEAT STRESS SCENARIO (temp >= 35°C & rainfall < 5mm)
  } else if (temp >= 35 && rainfall < 5) {
    weatherImpact = `High ambient temperature (${temp}°C) and strong solar radiation expected. Accelerated evapotranspiration causing rapid soil moisture deficit.`
    cropRiskLevel = "High"
    cropRiskScore = 80
    riskColor = "#f97316"
    cropRiskTitle = "Heat Stress & Topsoil Desiccation Hazard"
    cropRiskDetails = `Extreme heat accelerates transpiration, causing midday wilting, leaf tip burn, and pollen desiccation during reproductive stages.`

    recommendedActions = [
      "Apply light and frequent irrigation during early morning or evening hours.",
      "Ensure proper field moisture is maintained to buffer against thermal shock.",
      "Consider applying light organic mulch between crop rows to preserve soil moisture.",
      "Monitor crop for weather-related stress, midday wilting, and mite infestations.",
      "Apply foliar potassium spray (0.5-1% SOP/MOP) during cool morning hours to boost stomatal regulation."
    ]

    actionsToAvoid = [
      "Avoid flood irrigation during peak afternoon sun (12:00 PM - 3:30 PM) to prevent soil scalding.",
      "Do not apply agrochemical sprays during midday as high temperatures cause phytotoxicity and rapid chemical evaporation.",
      "Avoid excessive nitrogen fertilizer application which increases tender vegetative tissue vulnerable to heat scorch."
    ]

    reasonForAdvisory = "High atmospheric evaporative demand and temperatures above 35°C denature enzymes, impair photosynthesis, and desiccate flower stigmas."
    irrigationAdvice = "Apply light irrigation during late evening hours (after 5:30 PM) to cool root rhizosphere."
    fertilizerAdvice = "Foliar spray of 1% Potassium Nitrate (13:0:45) helps crops withstand heat stress."
    pestAdvice = "Monitor for sucking pests (Aphids, Thrips, Whiteflies, and Red Spider Mites) which thrive in dry heat."
    sprayingSuitability = 40
    drainagePriority = "None"
    topDressingSuitability = 65

  // 3. MODERATE SHOWERS / CLOUDY WEATHER (rainfall between 5mm and 15mm, or cloudy)
  } else if (rainfall >= 5 || weather.condition?.toLowerCase().includes("cloud")) {
    weatherImpact = `Overcast skies with intermittent moderate showers (${rainfall > 0 ? rainfall + " mm" : "5-12 mm"}) and high relative humidity (${humidity}%).`
    cropRiskLevel = "Moderate"
    cropRiskScore = 52
    riskColor = "#eab308"
    cropRiskTitle = "Moderate Pest Incidence & Microclimate Shift"
    cropRiskDetails = `Cloudy conditions with mild rain provide adequate soil moisture but elevate pest and fungal spore transmission risks.`

    recommendedActions = [
      "Avoid unnecessary irrigation; let incoming showers replenish root zone moisture.",
      "Ensure proper field drainage channels are clear of debris to prevent localized puddling.",
      "Consider postponing pesticide/fertilizer application if rainfall is imminent within the next 6-12 hours.",
      "Monitor crop for weather-related stress, leaf folders, stem borers, and yellowing foliage.",
      "Install pheromone traps and yellow sticky traps around the perimeter."
    ]

    actionsToAvoid = [
      "Do not apply systemic chemical sprays without an effective rain-fast sticking agent (silicon surfactant).",
      "Avoid leaving field borders unweeded, as weeds act as alternate hosts for insect vectors."
    ]

    reasonForAdvisory = "Overcast canopy conditions combined with high humidity create a favorable breeding environment for chewing insects and leaf-spotting fungi."
    irrigationAdvice = "Utilize rainfall; suspend artificial irrigation for the next 2-3 days."
    fertilizerAdvice = "Proceed with scheduled top-dressing if soil is moist but not muddy or flooded."
    pestAdvice = "Scout weekly. If stem borer infestation exceeds 10% dead hearts, apply recommended bio-pesticide."
    sprayingSuitability = 60
    drainagePriority = "Moderate"
    topDressingSuitability = 70

  // 4. FAVORABLE / NORMAL DRY WEATHER
  } else {
    weatherImpact = `Fair weather conditions with comfortable temperature (${temp}°C), moderate wind (${wind} km/h), and stable atmospheric conditions.`
    cropRiskLevel = "Low"
    cropRiskScore = 20
    riskColor = "#22c55e"
    cropRiskTitle = "Optimal Agronomic Growth Conditions"
    cropRiskDetails = `Weather parameters are well-balanced, supporting robust photosynthesis, nutrient assimilation, and healthy root development.`

    recommendedActions = [
      "Proceed with scheduled agricultural operations, weeding, and intercultural hoeing.",
      "Ensure proper field moisture through standard scheduled irrigation cycles.",
      "Carry out scheduled nutrient top-dressing (Urea + Zinc Sulphate split dose).",
      "Monitor crop for routine growth milestones and maintain clean field bunds."
    ]

    actionsToAvoid = [
      "Avoid over-irrigation that leads to water waste and nutrient leaching.",
      "Do not spray pesticides during windy midday periods."
    ]

    reasonForAdvisory = "Thermal and moisture equilibrium facilitates maximum photosynthetic rate and optimal fertilizer uptake efficiency."
    irrigationAdvice = "Normal irrigation schedule. Irrigate as per stage-specific root depth requirements."
    fertilizerAdvice = "Ideal window for scheduled split application of Urea, Potash, and micronutrients."
    pestAdvice = "Maintain routine weekly scouting. Beneficial predator insect populations are active."
    sprayingSuitability = 95
    drainagePriority = "Low"
    topDressingSuitability = 95
  }

  // 5-Day Day-by-Day Farmer Agromet Schedule
  const fiveDayPlan = [
    {
      day: "Day 1 (Today)",
      task: rainfall > 15 ? "Drain field ditches & suspend chemical spraying" : "Inspect field moisture & carry out routine intercultural operations",
      status: rainfall > 15 ? "High Priority" : "Optimal Window",
      statusColor: rainfall > 15 ? "#ef4444" : "#22c55e",
      icon: "i-check-circle"
    },
    {
      day: "Day 2 (Tomorrow)",
      task: rainfall > 10 ? "Hold fertilizer top-dressing due to high rain probability" : "Apply scheduled split dose of Urea + Micronutrient foliar spray",
      status: rainfall > 10 ? "Precaution" : "Recommended",
      statusColor: rainfall > 10 ? "#eab308" : "#22c55e",
      icon: "i-drop"
    },
    {
      day: "Day 3",
      task: "Scout crop canopy for stem borer, leaf blast, and collar rot symptoms",
      status: "Routine Scouting",
      statusColor: "#3b82f6",
      icon: "i-sparkles"
    },
    {
      day: "Day 4",
      task: "Check soil moisture level; irrigate lightly if topsoil shows dryness",
      status: "Moisture Check",
      statusColor: "#3b82f6",
      icon: "i-sun"
    },
    {
      day: "Day 5",
      task: "Weed removal along field bunds to eliminate alternate insect pest hosts",
      status: "Intercultural",
      statusColor: "#22c55e",
      icon: "i-sprout"
    }
  ]

  // Multilingual translations for vernacular bulletin display and audio readout
  const translations = {
    en: {
      bulletinTitle: `Agro-Advisory Bulletin for ${panchayatName}`,
      cropLabel: "Selected Crop",
      stageLabel: "Growth Stage",
      impactLabel: "Weather Impact",
      riskLabel: "Crop Risk Assessment",
      recLabel: "Recommended Actions",
      avoidLabel: "Actions to Avoid",
      reasonLabel: "Reason for Advisory",
      weatherImpactText: weatherImpact,
      reasonText: reasonForAdvisory,
      audioScript: `Agromet advisory for ${crop} at ${stage} stage in ${panchayatName}. ${weatherImpact} The crop risk is evaluated as ${cropRiskLevel}. Key recommendations: ${recommendedActions.slice(0, 3).join('. ')}. Key precautions: ${actionsToAvoid.slice(0, 2).join('. ')}.`
    },
    bn: {
      bulletinTitle: `${panchayatName} পঞ্চায়েতের কৃষি-আবহাওয়া পরামর্শ`,
      cropLabel: "নির্বাচিত ফসল",
      stageLabel: "বৃদ্ধির পর্যায়",
      impactLabel: "আবহাওয়ার প্রভাব",
      riskLabel: "ফসলের ঝুঁকি মূল্যায়ন",
      recLabel: "করণীয় সুপারিশসমূহ",
      avoidLabel: "যা করবেন না (সতর্কতা)",
      reasonLabel: "পরামর্শের বৈজ্ঞানিক কারণ",
      weatherImpactText: `আগামী ২ দিনে ভারী বৃষ্টিপাতের (${rainfall > 0 ? rainfall + " মিমি" : "২৫-৪৫ মিমি"}) সম্ভাবনা রয়েছে, বাতাসের আর্দ্রতা ${humidity}% থাকবে।`,
      reasonText: `ফুল আসার পর্যায়ে জমিতে অতিরিক্ত জল জমে থাকলে পরাগায়ন ব্যাহত হয়, ফুলের কুঁড়ি ঝরে পড়ে এবং ছত্রাকঘটিত ব্লাস্ট ও ব্যাকটেরিয়াজনিত রোগ দ্রুত ছড়িয়ে পড়ে।`,
      audioScript: `${panchayatName} অঞ্চলের ${crop} চাষিদের জন্য বিশেষ আবহাওয়া বার্তা। আগামী ২ দিনে ভারী বৃষ্টির সম্ভাবনা। জমিতে বাড়তি জল জমতে দেবেন না এবং নিকাশি নালা পরিষ্কার রাখুন। বৃষ্টির আগে জমিতে ইউরিয়া বা রাসায়নিক সার ও কীটনাশক স্প্রে করবেন না।`
    },
    hi: {
      bulletinTitle: `${panchayatName} पंचायत के लिए कृषि-मौसम परामर्श`,
      cropLabel: "चयनित फसल",
      stageLabel: "विकास अवस्था",
      impactLabel: "मौसम का प्रभाव",
      riskLabel: "फसल जोखिम आकलन",
      recLabel: "अनुशंसित कृषि कार्य",
      avoidLabel: "क्या न करें (सावधानियां)",
      reasonLabel: "परामर्श का वैज्ञानिक कारण",
      weatherImpactText: `अगले 2 दिनों में भारी बारिश (${rainfall > 0 ? rainfall + " मिमी" : "25-45 मिमी"}) की संभावना है, सापेक्षिक आर्द्रता ${humidity}% तक रहेगी।`,
      reasonText: `फूल आने की अवस्था में खेत में जलभराव होने से परागण प्रभावित होता है और झुलसा (ब्लास्ट) व सड़न रोग का प्रकोप तेजी से बढ़ता है।`,
      audioScript: `${panchayatName} के किसान भाइयों के लिए कृषि-मौसम सलाह। ${crop} की ${stage} अवस्था पर आगामी 2 दिनों में भारी वर्षा का पूर्वानुमान है। खेतों से जल निकासी की समुचित व्यवस्था करें और वर्षा से पूर्व रासायनिक उर्वरक व कीटनाशक छिड़काव स्थगित रखें।`
    }
  }

  return {
    crop,
    stage,
    panchayatName,
    weatherImpact,
    cropRisk: {
      level: cropRiskLevel,
      score: cropRiskScore,
      color: riskColor,
      title: cropRiskTitle,
      details: cropRiskDetails
    },
    recommendedActions,
    actionsToAvoid,
    reasonForAdvisory,
    operations: {
      irrigation: irrigationAdvice,
      fertilizer: fertilizerAdvice,
      pest: pestAdvice,
      sprayingSuitability,
      drainagePriority,
      topDressingSuitability
    },
    fiveDayPlan,
    translations
  }
}

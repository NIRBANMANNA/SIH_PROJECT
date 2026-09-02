// Mock crops and growth stages metadata with vernacular names
export const mockCropsList = [
  { id: "Rice", name: "Rice (Kharif)", bnName: "ধান (খরিফ)", hiName: "धान (खरीफ)", icon: "🌾", season: "Kharif", scientific: "Oryza sativa", duration: "120-140 Days" },
  { id: "Potato", name: "Potato", bnName: "আলু", hiName: "आलू", icon: "🥔", season: "Rabi", scientific: "Solanum tuberosum", duration: "90-110 Days" },
  { id: "Wheat", name: "Wheat", bnName: "গম", hiName: "गेहूं", icon: "🌾", season: "Rabi", scientific: "Triticum aestivum", duration: "115-130 Days" },
  { id: "Jute", name: "Jute", bnName: "পাট", hiName: "जूट", icon: "🌿", season: "Zaid / Pre-Kharif", scientific: "Corchorus olitorius", duration: "100-120 Days" },
  { id: "Mustard", name: "Mustard", bnName: "সরিষা", hiName: "सरसों", icon: "🌱", season: "Rabi", scientific: "Brassica juncea", duration: "85-100 Days" },
  { id: "Maize", name: "Maize (Corn)", bnName: "ভুট্টা", hiName: "मक्का", icon: "🌽", season: "Kharif / Rabi", scientific: "Zea mays", duration: "95-115 Days" },
  { id: "Brinjal", name: "Brinjal (Eggplant)", bnName: "বেগুন", hiName: "बैंगन", icon: "🍆", season: "Year Round", scientific: "Solanum melongena", duration: "120-150 Days" },
  { id: "Pulses", name: "Pulses (Lentil/Moong)", bnName: "ডাল (মসুর/মুগ)", hiName: "दालें (मसूर/मूंग)", icon: "🫘", season: "Rabi / Zaid", scientific: "Vigna radiata", duration: "65-75 Days" },
  { id: "Sesame", name: "Sesame (Til)", bnName: "তিল", hiName: "तिल", icon: "🌱", season: "Summer / Zaid", scientific: "Sesamum indicum", duration: "75-90 Days" },
  { id: "Betel", name: "Betel Vine (Paan)", bnName: "পান", hiName: "पान", icon: "🍃", season: "Perennial", scientific: "Piper betle", duration: "Perennial" }
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
  // Rice
  "Seedling / Nursery": { das: "0-20 DAS", sensitivity: "High", waterNeed: "Saturated soil, shallow water" },
  "Tillering": { das: "21-45 DAS", sensitivity: "High", waterNeed: "2-5 cm standing water" },
  "Panicle Initiation": { das: "46-65 DAS", sensitivity: "Critical", waterNeed: "5 cm standing water" },
  "Flowering": { das: "66-85 DAS", sensitivity: "Maximum Critical", waterNeed: "5 cm standing water, no flooding" },
  "Maturity & Harvesting": { das: "86-120 DAS", sensitivity: "Medium", waterNeed: "Field drainage / dry soil" },
  
  // Potato
  "Sprouting & Emergence": { das: "0-15 DAS", sensitivity: "Medium", waterNeed: "Light moisture, no waterlogging" },
  "Vegetative Growth": { das: "16-35 DAS", sensitivity: "High", waterNeed: "Moderate moisture, earthing up" },
  "Tuber Initiation": { das: "36-50 DAS", sensitivity: "Critical", waterNeed: "Uniform moisture, avoid dry spell" },
  "Tuber Bulking": { das: "51-75 DAS", sensitivity: "Critical", waterNeed: "Frequent light irrigation" },
  "Maturation & Skin Hardening": { das: "76-95 DAS", sensitivity: "Low", waterNeed: "Withhold water 10-12 days before harvest" },

  // Wheat
  "Crown Root Initiation (CRI)": { das: "20-25 DAS", sensitivity: "Maximum Critical", waterNeed: "First critical irrigation" },
  "Jointing / Booting": { das: "60-70 DAS", sensitivity: "High", waterNeed: "Adequate soil moisture" },
  "Flowering & Heading": { das: "80-90 DAS", sensitivity: "Critical", waterNeed: "Light irrigation, avoid lodging" },
  "Dough & Grain Hardening": { das: "95-115 DAS", sensitivity: "Low", waterNeed: "Withhold water for ripening" },

  // Jute
  "Active Vegetative Growth": { das: "16-70 DAS", sensitivity: "High", waterNeed: "Frequent weeding, moist soil" },
  "Pod & Fiber Ripening": { das: "71-100 DAS", sensitivity: "Medium", waterNeed: "Moderate moisture" },
  "Harvesting & Retting": { das: "100-120 DAS", sensitivity: "High", waterNeed: "Slow moving clean water" },

  // Mustard
  "Vegetative / Rosette": { das: "15-30 DAS", sensitivity: "Medium", waterNeed: "First light irrigation" },
  "Pod Formation (Siliqua)": { das: "50-70 DAS", sensitivity: "Critical", waterNeed: "Adequate moisture" },
  "Seed Filling & Maturity": { das: "70-95 DAS", sensitivity: "Low", waterNeed: "Dry weather for drying" },

  // Maize
  "Germination & Seedling": { das: "0-18 DAS", sensitivity: "High", waterNeed: "Good drainage, no logging" },
  "Knee-High Vegetative": { das: "20-40 DAS", sensitivity: "High", waterNeed: "Top-dressing moisture" },
  "Tasseling & Silking": { das: "45-65 DAS", sensitivity: "Maximum Critical", waterNeed: "High water demand, no drought" },
  "Grain Filling": { das: "66-85 DAS", sensitivity: "Critical", waterNeed: "Uniform moisture" },
  "Maturity": { das: "86-110 DAS", sensitivity: "Low", waterNeed: "Dry weather" },

  // Brinjal
  "Nursery & Transplanting": { das: "0-25 DAS", sensitivity: "High", waterNeed: "Daily light watering" },
  "Early Vegetative": { das: "26-50 DAS", sensitivity: "Medium", waterNeed: "Irrigate every 5-7 days" },
  "Flowering & Fruit Set": { das: "51-85 DAS", sensitivity: "Critical", waterNeed: "Avoid water stress" },
  "Fruit Harvesting": { das: "86-140 DAS", sensitivity: "Medium", waterNeed: "Irrigate post-picking" },

  // Pulses
  "Seedling": { das: "0-15 DAS", sensitivity: "Medium", waterNeed: "Light moisture" },
  "Vegetative Branching": { das: "16-35 DAS", sensitivity: "Medium", waterNeed: "Avoid waterlogging" },
  "Pod Formation & Maturity": { das: "51-70 DAS", sensitivity: "Low", waterNeed: "Dry harvest conditions" },

  // Sesame
  "Branching": { das: "16-35 DAS", sensitivity: "Medium", waterNeed: "Intercultural hoeing" },
  "Flowering & Capsule Set": { das: "36-55 DAS", sensitivity: "Critical", waterNeed: "Strict drainage" },
  "Capsule Ripening": { das: "56-80 DAS", sensitivity: "Low", waterNeed: "Dry sun" },

  // Betel Vine
  "Vine Establishment": { das: "0-40 DAS", sensitivity: "High", waterNeed: "Constant fine misting" },
  "Active Leaf Emergence": { das: "41-120 DAS", sensitivity: "High", waterNeed: "Controlled humid shade" },
  "Leaf Plucking / Harvesting": { das: "Perennial", sensitivity: "Medium", waterNeed: "Daily light watering" }
}

export const stageTranslations = {
  // Rice
  "Seedling / Nursery": { bn: "চারাগাছ / বীজতলা", hi: "पौध / नर्सरी" },
  "Tillering": { bn: "কুশি গজানো পর্যায়", hi: "कल्ले फूटने की अवस्था" },
  "Panicle Initiation": { bn: "শীষ আসার প্রাথমিক পর্যায়", hi: "बाली बनने की शुरुआत" },
  "Flowering": { bn: "ফুল আসার পর্যায়", hi: "फूल आने की अवस्था" },
  "Maturity & Harvesting": { bn: "পাকা ও ফসল তোলার পর্যায়", hi: "परिपक्वता एवं कटाई" },
  
  // Potato
  "Sprouting & Emergence": { bn: "অঙ্কুরোদগম ও চারা বের হওয়া", hi: "अंकुरण एवं उद्भव" },
  "Vegetative Growth": { bn: "অঙ্গজ বৃদ্ধি", hi: "वानस्पतिक वृद्धि" },
  "Tuber Initiation": { bn: "আলু তৈরি শুরু (টিউবার ইনিশিয়েশন)", hi: "कंद निर्माण शुरुआत" },
  "Tuber Bulking": { bn: "আলুর আকার বৃদ্ধি (টিউবার বাল্কিং)", hi: "कंद का विकास" },
  "Maturation & Skin Hardening": { bn: "ত্বক শক্ত হওয়া ও পরিপক্কতা", hi: "परिपक्वता एवं छिलका सख्त होना" },

  // Wheat
  "Crown Root Initiation (CRI)": { bn: "প্রাথমিক শিকড় গজানো (CRI)", hi: "शीर्ष जड़ जमने की अवस्था (CRI)" },
  "Jointing / Booting": { bn: "গাঁট ও থোর পর্যায়", hi: "गांठ व बूटिंग अवस्था" },
  "Flowering & Heading": { bn: "ফুল ও শীষ আসা", hi: "फूल एवं बाली निकलना" },
  "Dough & Grain Hardening": { bn: "দানা শক্ত হওয়া ও পাকা", hi: "दाना भराव व पकना" },

  // Jute
  "Active Vegetative Growth": { bn: "সক্রিয় বৃদ্ধি পর্যায়", hi: "सक्रिय वानस्पतिक वृद्धि" },
  "Pod & Fiber Ripening": { bn: "আঁশ পরিপক্কতা", hi: "रेशा परिपक्वता" },
  "Harvesting & Retting": { bn: "কাটাই ও পাট পচানো", hi: "कटाई एवं पानी में गलाना" },

  // Mustard
  "Vegetative / Rosette": { bn: "অঙ্গজ বৃদ্ধি পর্যায়", hi: "वानस्पतिक अवस्था" },
  "Pod Formation (Siliqua)": { bn: "শুঁটি গঠন পর্যায়", hi: "फली निर्माण अवस्था" },
  "Seed Filling & Maturity": { bn: "দানা পরিপক্কতা", hi: "दाना भराव व परिपक्वता" },

  // Maize
  "Germination & Seedling": { bn: "অঙ্কুরোদগম ও চারা", hi: "अंकुरण व पौध" },
  "Knee-High Vegetative": { bn: "হাঁটু সমান বৃদ্ধি পর্যায়", hi: "घुटने तक ऊंचाई वृद्धि" },
  "Tasseling & Silking": { bn: "মোচা ও পুংকেশর আসা", hi: "नर व मादा फूल निकलना" },
  "Grain Filling": { bn: "দানা গঠন পর্যায়", hi: "दाना भराव अवस्था" },
  "Maturity": { bn: "পরিপক্কতা ও ফসল তোলা", hi: "परिपक्वता एवं कटाई" },

  // Brinjal
  "Nursery & Transplanting": { bn: "বীজতলা ও চারা রোপণ", hi: "नर्सरी व रोपाई" },
  "Early Vegetative": { bn: "প্রাথমিক অঙ্গজ বৃদ্ধি", hi: "प्रारंभिक वृद्धि" },
  "Flowering & Fruit Set": { bn: "ফুল ও ফল ধরা", hi: "फूल व फल लगना" },
  "Fruit Harvesting": { bn: "ফল তোলা পর্যায়", hi: "फल तुड़ाई अवस्था" },

  // Pulses
  "Seedling": { bn: "চারা পর্যায়", hi: "पौध अवस्था" },
  "Vegetative Branching": { bn: "ডালপালা বৃদ্ধি", hi: "शाखा वृद्धि" },
  "Pod Formation & Maturity": { bn: "শুঁটি গঠন ও পরিপক্কতা", hi: "फली बनना व पकना" },

  // Sesame
  "Branching": { bn: "শাখা প্রশাখা বৃদ্ধি", hi: "शाखा विस्तार" },
  "Flowering & Capsule Set": { bn: "ফুল ও ফল তৈরি", hi: "फूल व फली निर्माण" },
  "Capsule Ripening": { bn: "বীজ পাকা", hi: "दाना पकना" },

  // Betel Vine
  "Vine Establishment": { bn: "লতা স্থাপন পর্যায়", hi: "बेल स्थापना" },
  "Active Leaf Emergence": { bn: "সক্রিয় পাতা বের হওয়া", hi: "सक्रिय पत्ती वृद्धि" },
  "Leaf Plucking / Harvesting": { bn: "পাতা তোলা ও বিক্রি", hi: "पत्ता तुड़ाई व विपणन" }
}

// Dynamic advisory generator based on Panchayat Weather, Crop, and Growth Stage
export const getAdvisory = (crop, stage, weather = {}, panchayatName = "Amnan") => {
  const rainfall = parseFloat(weather.rainfall) || 0
  const temp = parseFloat(weather.temp) || 30
  const humidity = parseFloat(weather.humidity) || 70
  const wind = parseFloat(weather.wind) || 15

  // Multilingual dynamic holders
  let scenarioKey = "normal" // "heavyRain" | "heatStress" | "moderateRain" | "normal"

  // Base structures (English)
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

  // Multilingual specific content structures
  let bnRiskLevel = "স্বাভাবিক"
  let bnRiskTitle = "স্বাভাবিক আবহাওয়া পরিস্থিতি"
  let bnRiskDetails = "আবহাওয়ার পরিমিতি ফসলের স্বাভাবিক বৃদ্ধির অনুকূলে রয়েছে।"
  let bnWeatherImpact = ""
  let bnReason = ""
  let bnRecommendedActions = []
  let bnActionsToAvoid = []
  let bnIrrigationAdvice = ""
  let bnFertilizerAdvice = ""
  let bnSprayAdvice = ""
  let bnPestAdvice = ""

  let hiRiskLevel = "सामान्य"
  let hiRiskTitle = "सामान्य कृषि परिस्थितियां"
  let hiRiskDetails = "मौसम के कारक फसल विकास के लिए अनुकूल हैं।"
  let hiWeatherImpact = ""
  let hiReason = ""
  let hiRecommendedActions = []
  let hiActionsToAvoid = []
  let hiIrrigationAdvice = ""
  let hiFertilizerAdvice = ""
  let hiSprayAdvice = ""
  let hiPestAdvice = ""

  // 1. HEAVY RAINFALL SCENARIO (> 15mm)
  if (rainfall > 15 || weather.condition?.toLowerCase().includes("rain") || weather.condition?.toLowerCase().includes("storm")) {
    scenarioKey = "heavyRain"
    weatherImpact = `Heavy rainfall (${rainfall > 0 ? rainfall + " mm" : "25-45 mm"}) expected in the next 2 days with elevated relative humidity (${humidity}%) and gusty surface winds.`
    bnWeatherImpact = `আগামী ২ দিনে ভারী বৃষ্টিপাতের (${rainfall > 0 ? rainfall + " মিমি" : "২৫-৪৫ মিমি"}) সম্ভাবনা রয়েছে, বাতাসের আর্দ্রতা ${humidity}% এবং দমকা হাওয়া বইতে পারে।`
    hiWeatherImpact = `अगले 2 दिनों में भारी बारिश (${rainfall > 0 ? rainfall + " मिमी" : "25-45 मिमी"}) का पूर्वानुमान है, सापेक्षिक आर्द्रता ${humidity}% और तेज हवाएं चल सकती हैं।`

    if (stage === "Flowering" || stage === "Flowering & Heading" || stage === "Flowering & Fruit Set") {
      cropRiskLevel = "High"
      cropRiskScore = 85
      riskColor = "#f97316"
      cropRiskTitle = "Submergence Hazard & Flower Dropping Threat"
      cropRiskDetails = `Flowering is the most sensitive phenological phase. Heavy rainfall causes physical flower detachment, washes away pollen grains causing spikelet sterility, and creates warm-humid microclimates that spur bacterial blight and fungal blast.`
      
      bnRiskLevel = "উচ্চ"
      bnRiskTitle = "জলাবদ্ধতা ও ফুল ঝরে পড়ার উচ্চ ঝুঁকি"
      bnRiskDetails = `ফুল আসার পর্যায়টি অত্যন্ত সংবেদনশীল। ভারী বৃষ্টিতে পরাগরেণু ধুয়ে যায়, ফুলের কুঁড়ি ঝরে পড়ে এবং ছত্রাক ও ব্যাকটেরিয়াজনিত ব্লাস্টের প্রকোপ বৃদ্ধি পায়।`

      hiRiskLevel = "उच्च"
      hiRiskTitle = "जलभराव एवं फूल गिरने का उच्च जोखिम"
      hiRiskDetails = `फूल आने की अवस्था अत्यंत संवेदनशील होती है। तेज वर्षा से परागकण धुल जाते हैं, फूल गिरते हैं और झुलसा व सड़न रोग का खतरा बढ़ता है।`

      recommendedActions = [
        "Avoid unnecessary irrigation immediately; disconnect field supply channels.",
        "Ensure proper field drainage and clear silt/weeds from drainage trenches to prevent water stagnation.",
        "Consider postponing pesticide/fertilizer application if rainfall is imminent.",
        "Monitor crop for weather-related stress, lodging, and foliar fungal lesions after the rain recedes.",
        "Maintain drainage outlets so standing water in paddy does not exceed 5 cm above ground level."
      ]

      actionsToAvoid = [
        "Do not apply urea, DAP, or chemical fertilizers before rainfall to prevent nutrient leaching and surface runoff.",
        "Avoid chemical spraying when wind speed exceeds 15 km/h or foliage is saturated with raindrops.",
        "Do not allow standing water to exceed 7 cm in flowering paddy fields, as it induces root asphyxiation.",
        "Avoid walking inside waterlogged fields during heavy rain to prevent soil compaction and root damage."
      ]

      reasonForAdvisory = `Heavy downpours during flowering wash away viable pollen and saturate the root rhizosphere. Prolonged standing water impedes root respiration, increases spikelet sterility by up to 25%, and provides optimal temperature-moisture conditions for rapid bacterial and blast spore germination.`
      bnReason = `ফুল আসার সময় ভারী বৃষ্টিতে পরাগায়ন মারাত্মকভাবে ব্যাহত হয় এবং শিকড়ে অক্সিজেন ঘাটতি ঘটে। জমিতে অতিরিক্ত জল জমে থাকলে ফসলের বন্ধ্যাত্ব ২৫% পর্যন্ত বাড়তে পারে এবং ব্লাস্ট রোগের অনুকূল পরিবেশ তৈরি হয়।`
      hiReason = `फूल खिलने के दौरान भारी बारिश से परागण बाधित होता है और जड़ों में ऑक्सीजन की कमी हो जाती है। खेत में अधिक समय तक जलभराव से दाना भराव 25% तक कम हो सकता है तथा झुलसा रोग तेजी से फैलता है।`

    } else if (stage === "Seedling / Nursery" || stage === "Sprouting & Emergence" || stage === "Germination & Seedling") {
      cropRiskLevel = "Critical"
      cropRiskScore = 90
      riskColor = "#ef4444"
      cropRiskTitle = "Seedling Submergence & Damping-Off Risk"
      cropRiskDetails = "Young tender seedlings lack mechanical rigidity and are prone to silt encrustation, rotting, and flash inundation."

      bnRiskLevel = "জরুরি"
      bnRiskTitle = "চারা ডুবে যাওয়া ও গোড়া পচা রোগের জরুরি ঝুঁকি"
      bnRiskDetails = "কচি চারার কান্ড নরম থাকায় জলমগ্ন হলে দ্রুত পচে যায় এবং পলির নিচে চাপা পড়ে নষ্ট হয়।"

      hiRiskLevel = "गंभीर"
      hiRiskTitle = "पौध डूबने एवं गलन रोग का गंभीर खतरा"
      hiRiskDetails = "छोटे कोमल पौधे अत्यधिक पानी में जल्दी गल जाते हैं और गाद जमने से नष्ट हो जाते हैं।"

      recommendedActions = [
        "Avoid unnecessary irrigation; drain excess water from nursery beds immediately.",
        "Ensure proper field drainage channels are unobstructed around seedbeds.",
        "Consider postponing pesticide/fertilizer application until weather clears.",
        "Provide temporary elevated drainage cuts on nursery bunds."
      ]

      actionsToAvoid = [
        "Do not apply granular fertilizers or foliar nutrients on waterlogged seedbeds.",
        "Avoid transplanting seedlings during active stormy spells or torrential downpours.",
        "Do not allow murky stagnant rainwater to submerge the seedling shoot tips."
      ]

      reasonForAdvisory = "Submerged seedlings suffer severe oxygen starvation and collar rot (Pythium/Rhizoctonia) within 24 hours of warm standing water."
      bnReason = "বীজতলায় জল জমে থাকলে ২৪ ঘণ্টার মধ্যে শিকড়ে বাতাস চলাচল বন্ধ হয়ে ড্যাম্পিং অফ ও শিকড় পচা রোগ সৃষ্টি হয়।"
      hiReason = "नर्सरी में जलभराव से 24 घंटे के भीतर पौधों की जड़ों में ऑक्सीजन की कमी हो जाती है और पौध गलन रोग लग जाता है।"

    } else if (stage === "Maturity & Harvesting" || stage === "Maturation & Skin Hardening" || stage === "Dough & Grain Hardening") {
      cropRiskLevel = "Critical"
      cropRiskScore = 92
      riskColor = "#ef4444"
      cropRiskTitle = "Grain Sprouting, Lodging & Crop Rot Hazard"
      cropRiskDetails = "Mature crop standing in flooded fields risks severe lodging, mold contamination, and in-situ grain sprouting."

      bnRiskLevel = "জরুরি"
      bnRiskTitle = "পাকা ফসল হেলে পড়া ও শিষেই দানা গজানোর ঝুঁকি"
      bnRiskDetails = "পাকা ফসলে জল জমলে গাছ শুয়ে পড়ে এবং শিষেই দানা অঙ্কুরিত হয়ে ফসলের গুণমান নষ্ট হয়।"

      hiRiskLevel = "गंभीर"
      hiRiskTitle = "फसल गिरने एवं बाली में दाना अंकुरण का गंभीर खतरा"
      hiRiskDetails = "खेत में पकी फसल पर पानी भरने से फसल गिर जाती है और बाली में ही दाना अंकुरित होने लगता है।"

      recommendedActions = [
        "Drain all standing water from fields immediately through peripheral ditches.",
        "Suspend harvesting and threshing operations until sunshine resumes.",
        "Move already harvested sheaves to elevated sheds and cover securely with tarpaulins."
      ]

      actionsToAvoid = [
        "Do not leave harvested produce uncovered in open fields or low-lying threshing yards.",
        "Avoid threshing wet grain to prevent grain breakage and fungal discoloration.",
        "Do not store grains with moisture content exceeding 14%."
      ]

      reasonForAdvisory = "Mature grains absorb moisture rapidly during continuous showers, triggering pre-harvest viviparous sprouting and Aspergillus aflatoxin contamination."
      bnReason = "ধারাবাহিক বৃষ্টিতে পাকা দানা আর্দ্রতা শোষণ করে শিষেই গজাতে শুরু করে এবং ছত্রাকের বিষাক্ত সংক্রমণ ঘটে।"
      hiReason = "लगातार वर्षा से पके दानों में नमी बढ़ जाती है जिससे कटाई पूर्व अंकुरण और फफूंद संक्रमण का खतरा होता है।"

    } else {
      // General Tillering / Vegetative under heavy rain
      cropRiskLevel = "High"
      cropRiskScore = 78
      riskColor = "#f97316"
      cropRiskTitle = "Excess Moisture & Fungal Disease Pressure"
      cropRiskDetails = `Heavy rain (${rainfall} mm) raises soil saturation to near 100%. Excessive moisture stresses vegetative growth and promotes foliar pathogens.`

      bnRiskLevel = "উচ্চ"
      bnRiskTitle = "অতিরিক্ত আর্দ্রতা ও ছত্রাকজনিত রোগের চাপ"
      bnRiskDetails = `ভারী বৃষ্টিতে মাটি পুরোপুরি জলমগ্ন হয়ে পড়ে, যা উদ্ভিদের বৃদ্ধিতে বাধা দেয় এবং পাতায় রোগ ছড়ায়।`

      hiRiskLevel = "उच्च"
      hiRiskTitle = "अत्यधिक नमी एवं फफूंद जनित रोगों का दबाव"
      hiRiskDetails = `भारी बारिश से मिट्टी पूरी तरह संतृप्त हो जाती है, जिससे जड़ों के विकास में रुकावट और पत्तों पर रोग पनपते हैं।`

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
      bnReason = "অতিরিক্ত বৃষ্টির কারণে সারের অপচয় হয় এবং জমিতে মাজরা পোকা ও বাদামী গাছফড়িং-এর প্রাদুর্ভাবের অনুকূল পরিবেশ তৈরি হয়।"
      hiReason = "अत्यधिक बारिश से उर्वरक बह जाता है और तना छेदक व भूरा फुदका कीटों के पनपने की अनुकूल परिस्थिति बनती है।"
    }

    irrigationAdvice = "Drain excess rainwater immediately. Keep field water depth capped at 3-5 cm."
    fertilizerAdvice = "Postpone top dressing of Urea and MOP until rainfall ceases and soil moisture stabilizes."
    pestAdvice = "Scout for fungal sheath blight and bacterial leaf streak 48 hours post-rain."
    
    bnIrrigationAdvice = "জমির অতিরিক্ত জল দ্রুত বের করে দিন। জলের গভীরতা ৩-৫ সেন্টিমিটারের মধ্যে রাখুন।"
    bnFertilizerAdvice = "বৃষ্টি না থামা পর্যন্ত এবং মাটি স্থিতিশীল না হওয়া পর্যন্ত ইউরিয়া ও পটাশ সার প্রয়োগ স্থগিত রাখুন।"
    bnSprayAdvice = "বৃষ্টির সময় ও ভেজা পাতার উপর কোন প্রকার কীটনাশক বা ছত্রাকনাশক স্প্রে করবেন না।"
    bnPestAdvice = "বৃষ্টি থামার ৪৮ ঘণ্টা পর পাতা পোড়া ও খোল পোড়া রোগের লক্ষণ সতর্কতার সাথে পর্যবেক্ষণ করুন।"

    hiIrrigationAdvice = "खेत से अतिरिक्त पानी तुरंत निकालें। जल स्तर 3-5 सेमी से अधिक न होने दें।"
    hiFertilizerAdvice = "बारिश रुकने और खेत की मिट्टी सूखने तक यूरिया व पोटाश का छिड़काव स्थगित रखें।"
    hiSprayAdvice = "बारिश के दौरान और गीली पत्तियों पर किसी भी रसायन का छिड़काव न करें।"
    hiPestAdvice = "बारिश के 48 घंटे बाद शीथ ब्लाइट और झुलसा रोग के लक्षणों की निगरानी करें।"

    sprayingSuitability = 10
    drainagePriority = "Critical"
    topDressingSuitability = 15

    bnRecommendedActions = [
      "অপ্রয়োজনীয় সেচ অবিলম্বে বন্ধ করুন এবং নালা পরিষ্কার রাখুন।",
      "জমিতে জল যাতে জমে না থাকে সেজন্য নিকাশি নালা দিয়ে জল বের করে দিন।",
      "বৃষ্টির পূর্বাভাস থাকলে সার ও কীটনাশক স্প্রে করা স্থগিত রাখুন।",
      "বৃষ্টি কমার পর ফসলের গোড়া পচা ও ছত্রাকঘটিত রোগ পর্যবেক্ষণ করুন।"
    ]
    bnActionsToAvoid = [
      "বৃষ্টির আগে ইউরিয়া বা ডিএপি সার ছড়াবেন না, এতে সার ধুয়ে অপচয় হয়।",
      "বাতাসের গতিবেগ বেশি থাকলে বা ভেজা পাতায় কীটনাশক স্প্রে করবেন না।",
      "জমিতে অতিরিক্ত জল ৫ সেন্টিমিটারের বেশি জমতে দেবেন না।"
    ]

    hiRecommendedActions = [
      "अनावश्यक सिंचाई तुरंत बंद करें और खेत की नालियों को साफ रखें।",
      "खेत में जलभराव रोकने के लिए उचित जल निकासी सुनिश्चित करें।",
      "बारिश की संभावना को देखते हुए कीटनाशक व उर्वरक प्रयोग टालें।",
      "बारिश के बाद फसल में फफूंद व सड़न रोग की नियमित निगरानी करें।"
    ]
    hiActionsToAvoid = [
      "बारिश से पहले यूरिया या डीएपी न डालें, इससे पोषक तत्व बह जाते हैं।",
      "हवा तेज होने या पत्तियों पर पानी होने पर कीटनाशक न छिड़कें।",
      "खेत में 5 सेमी से अधिक जलभराव न होने दें।"
    ]

  // 2. HIGH TEMPERATURE / HEAT STRESS SCENARIO (temp >= 35°C & rainfall < 5mm)
  } else if (temp >= 35 && rainfall < 5) {
    scenarioKey = "heatStress"
    weatherImpact = `High ambient temperature (${temp}°C) and strong solar radiation expected. Accelerated evapotranspiration causing rapid soil moisture deficit.`
    bnWeatherImpact = `উচ্চ তাপমাত্রা (${temp}°C) এবং প্রখর রৌদ্রের কারণে বাষ্পীভবন দ্রুত ঘটছে এবং মাটিতে আর্দ্রতার ঘাটতি দেখা দিচ্ছে।`
    hiWeatherImpact = `उच्च तापमान (${temp}°C) एवं तेज धूप के कारण वाष्पोत्सर्जन बढ़ रहा है, जिससे मिट्टी में नमी की तीव्र कमी हो रही है।`

    cropRiskLevel = "High"
    cropRiskScore = 80
    riskColor = "#f97316"
    cropRiskTitle = "Heat Stress & Topsoil Desiccation Hazard"
    cropRiskDetails = `Extreme heat accelerates transpiration, causing midday wilting, leaf tip burn, and pollen desiccation during reproductive stages.`

    bnRiskLevel = "উচ্চ"
    bnRiskTitle = "তীব্র তাপপ্রবাহ ও মাটির আর্দ্রতা ঘাটতির ঝুঁকি"
    bnRiskDetails = `তীব্র গরমে গাছ দুপুরের দিকে নেতিয়ে পড়ে, পাতার ডগা শুকিয়ে যায় এবং ফুল ঝরে পরাগায়ন ব্যাহত হয়।`

    hiRiskLevel = "उच्च"
    hiRiskTitle = "ताप तनाव एवं मिट्टी में अत्यधिक सूखापन का खतरा"
    hiRiskDetails = `अत्यधिक गर्मी से पौधे दोपहर में मुरझाते हैं, पत्तियों के सिरे जलते हैं और परागकण सूखने से उपज घटती है।`

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
    bnReason = "৩৫ ডিগ্রি সেলসিয়াসের বেশি তাপমাত্রায় সালোকসংশ্লেষণ ব্যাহত হয় এবং গাছের পত্ররন্ধ্র বন্ধ হয়ে গিয়ে খাদ্য তৈরি বাধাগ্রস্ত হয়।"
    hiReason = "35 डिग्री सेल्सियस से अधिक तापमान में पौधों में प्रकाश संश्लेषण रुकने लगता है और फूलों के सूखने से पैदावार प्रभावित होती है।"

    irrigationAdvice = "Apply light irrigation during late evening hours (after 5:30 PM) to cool root rhizosphere."
    fertilizerAdvice = "Foliar spray of 1% Potassium Nitrate (13:0:45) helps crops withstand heat stress."
    pestAdvice = "Monitor for sucking pests (Aphids, Thrips, Whiteflies, and Red Spider Mites) which thrive in dry heat."
    
    bnIrrigationAdvice = "বিকাল বা সন্ধ্যার দিকে হালকা সেচ দিন যাতে শিকড় ঠান্ডা থাকে।"
    bnFertilizerAdvice = "তাপপ্রবাহ কাটিয়ে উঠতে ১% পটাসিয়াম নাইট্রেট স্প্রে করা উপকারী।"
    bnSprayAdvice = "দুপুরের প্রখর রোদে স্প্রে করবেন না; সকালের ঠান্ডা আবহাওয়ায় স্প্রে করুন।"
    bnPestAdvice = "শুকনো আবহাওয়ায় শোষক পোকা (জাবপোকা, সাদা মাছি ও মাকড়)-র আক্রমণ লক্ষ্য করুন।"

    hiIrrigationAdvice = "शाम के समय हल्की सिंचाई करें ताकि जड़ों का तापमान संतुलित रहे।"
    hiFertilizerAdvice = "गर्मी के प्रभाव को कम करने के लिए 1% पोटेशियम नाइट्रेट का छिड़काव करें।"
    hiSprayAdvice = "दोपहर की तेज धूप में छिड़काव न करें; सुबह के ठंडे समय में ही करें।"
    hiPestAdvice = "शुष्क मौसम में रस चूसक कीटों (माहू, थ्रिप्स, सफेद मक्खी) की निगरानी करें।"

    sprayingSuitability = 40
    drainagePriority = "None"
    topDressingSuitability = 65

    bnRecommendedActions = [
      "ভোরবেলা বা সন্ধ্যায় হালকা সেচ দিয়ে মাটিতে রস বজায় রাখুন।",
      "মাটির আর্দ্রতা ধরে রাখতে ফসলের সারির মাঝে খড়ের মালচিং ব্যবহার করুন।",
      "সকালের দিকে পটাসিয়াম স্প্রে করে ফসলের সহ্যক্ষমতা বাড়ান।",
      "দুপুরে গাছ নেতিয়ে পড়ছে কিনা নিয়মিত লক্ষ্য রাখুন।"
    ]
    bnActionsToAvoid = [
      "দুপুর ১২টা থেকে বিকাল ৩টার মধ্যে কড়া রোদে জমিতে সেচ দেবেন না।",
      "দুপুরের গরমে কোন রাসায়নিক স্প্রে করবেন না, এতে পাতা পুড়ে যেতে পারে।",
      "অতিরিক্ত নাইট্রোজেন বা ইউরিয়া সার প্রয়োগ এড়িয়ে চলুন।"
    ]

    hiRecommendedActions = [
      "सुबह या शाम के समय हल्की सिंचाई करके खेत में नमी बनाए रखें।",
      "नमी सुरक्षित रखने के लिए कतारों के बीच पुआल या घास से मल्चिंग करें।",
      "सुबह के ठंडे समय में पोटेशियम का पर्णीय छिड़काव करें।",
      "दोपहर में पौधों के मुरझाने पर नजर रखें।"
    ]
    hiActionsToAvoid = [
      "दोपहर 12 से 3 बजे के बीच तेज धूप में खेत में पानी न लगाएं।",
      "कड़ी धूप में किसी भी रसायन का छिड़काव न करें, पत्तियां झुलस सकती हैं।",
      "अत्यधिक यूरिया का उपयोग न करें।"
    ]

  // 3. MODERATE SHOWERS / CLOUDY WEATHER (rainfall between 5mm and 15mm, or cloudy)
  } else if (rainfall >= 5 || weather.condition?.toLowerCase().includes("cloud")) {
    scenarioKey = "moderateRain"
    weatherImpact = `Overcast skies with intermittent moderate showers (${rainfall > 0 ? rainfall + " mm" : "5-12 mm"}) and high relative humidity (${humidity}%).`
    bnWeatherImpact = `আংশিক মেঘলা আকাশ এবং মাঝে মাঝে হালকা থেকে মাঝারি বৃষ্টি (${rainfall > 0 ? rainfall + " মিমি" : "৫-১২ মিমি"}), বাতাসের আর্দ্রতা ${humidity}%।`
    hiWeatherImpact = `बादल छाए रहने और रुक-रुक कर हल्की से मध्यम वर्षा (${rainfall > 0 ? rainfall + " मिमी" : "5-12 मिमी"}) का अनुमान, आर्द्रता ${humidity}%।`

    cropRiskLevel = "Moderate"
    cropRiskScore = 52
    riskColor = "#eab308"
    cropRiskTitle = "Moderate Pest Incidence & Microclimate Shift"
    cropRiskDetails = `Cloudy conditions with mild rain provide adequate soil moisture but elevate pest and fungal spore transmission risks.`

    bnRiskLevel = "মাঝারি"
    bnRiskTitle = "মাঝারি কীটপতঙ্গ ও ছত্রাকের ঝুঁকি"
    bnRiskDetails = `মেঘলা আবহাওয়া এবং হালকা বৃষ্টি মাটির পক্ষে ভালো হলেও পোকা ও ছত্রাকের বংশবৃদ্ধির ঝুঁকি বাড়ায়।`

    hiRiskLevel = "मध्यम"
    hiRiskTitle = "मध्यम कीट एवं फफूंद संक्रमण का जोखिम"
    hiRiskDetails = `बादल और हल्की बारिश से मिट्टी में पर्याप्त नमी रहती है, परंतु कीट व फफूंद रोगों का खतरा बढ़ जाता है।`

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
    bnReason = "মেঘলা আকাশ ও আর্দ্র পরিবেশের কারণে পাতা মোড়ানো পোকা এবং ছত্রাকের স্পোর দ্রুত বৃদ্ধি পায়।"
    hiReason = "लगातार बादल और उच्च आर्द्रता से पत्ती लपेटक कीट और पत्तियों पर धब्बा रोग तेजी से पनपते हैं।"

    irrigationAdvice = "Utilize rainfall; suspend artificial irrigation for the next 2-3 days."
    fertilizerAdvice = "Proceed with scheduled top-dressing if soil is moist but not muddy or flooded."
    pestAdvice = "Scout weekly. If stem borer infestation exceeds 10% dead hearts, apply recommended bio-pesticide."
    
    bnIrrigationAdvice = "বৃষ্টির জল কাজে লাগান; আগামী ২-৩ দিন আলাদা সেচ দেওয়ার প্রয়োজন নেই।"
    bnFertilizerAdvice = "মাটিতে পর্যাপ্ত জো থাকলে তবেই সার প্রয়োগ করুন।"
    bnSprayAdvice = "কীটনাশক প্রয়োগের সময় অবশ্যই স্টিকার/সারফ্যাক্ট্যান্ট মেশান যাতে বৃষ্টিতে ধুয়ে না যায়।"
    bnPestAdvice = "মাজরা পোকা ও পাতা মোড়ানো পোকার আক্রমণ সপ্তাহে একবার নিবিড়ভাবে পর্যবেক্ষণ করুন।"

    hiIrrigationAdvice = "वर्षा जल का सदुपयोग करें; अगले 2-3 दिनों तक अलग से सिंचाई न करें।"
    hiFertilizerAdvice = "मिट्टी में उचित नमी होने पर ही यूरिया का भुरकाव करें।"
    hiSprayAdvice = "कीटनाशक के साथ स्टीकर अवश्य मिलाएं ताकि वर्षा से दवा न धुले।"
    hiPestAdvice = "तना छेदक और पत्ता लपेटक कीटों की साप्ताहिक निगरानी करें।"

    sprayingSuitability = 60
    drainagePriority = "Moderate"
    topDressingSuitability = 70

    bnRecommendedActions = [
      "অপ্রয়োজনীয় সেচ বন্ধ রাখুন; বৃষ্টির জলকে মাটিতে ধরে রাখুন।",
      "জমির আইল ও নিকাশি মুখ পরিষ্কার রাখুন যাতে জল জমতে না পারে।",
      "পাতা মোড়ানো পোকা ও মাজরা পোকার আক্রমণ নিয়মিত পর্যবেক্ষণ করুন।",
      "জমির সীমানায় ফেরোমন ট্র্যাপ ও হলুদ ফাঁদ স্থাপন করুন।"
    ]
    bnActionsToAvoid = [
      "স্টিকার বা আঠা ছাড়া কোনো তরল কীটনাশক স্প্রে করবেন না।",
      "জমির চারপাশে আগাছা জমতে দেবেন না, আগাছায় পোকা আশ্রয় নেয়।"
    ]

    hiRecommendedActions = [
      "अनावश्यक सिंचाई रोकें; बारिश की नमी का लाभ उठाएं।",
      "खेत की मेड़ों और जल निकासी रास्तों को साफ रखें।",
      "पत्ता लपेटक व तना छेदक कीटों के प्रकोप पर नजर रखें।",
      "खेत में फेरोमोन ट्रैप और पीले चिपचिपे कार्ड लगाएं।"
    ]
    hiActionsToAvoid = [
      "बिना स्टीकर के कीटनाशक का छिड़काव न करें।",
      "खेत की मेड़ों पर खरपतवार न उगने दें।"
    ]

  // 4. FAVORABLE / NORMAL DRY WEATHER
  } else {
    scenarioKey = "normal"
    weatherImpact = `Fair weather conditions with comfortable temperature (${temp}°C), moderate wind (${wind} km/h), and stable atmospheric conditions.`
    bnWeatherImpact = `অনুকূল ও মনোরম আবহাওয়া (${temp}°C), পরিমিত বাতাস (${wind} কিমি/ঘণ্টা) এবং স্থিতিশীল পরিবেশ বিরাজ করছে।`
    hiWeatherImpact = `अनुकूल मौसम परिस्थिति (${temp}°C), सामान्य हवा (${wind} किमी/घंटा) एवं स्थिर वायुमंडलीय स्थिति।`

    cropRiskLevel = "Low"
    cropRiskScore = 20
    riskColor = "#22c55e"
    cropRiskTitle = "Optimal Agronomic Growth Conditions"
    cropRiskDetails = `Weather parameters are well-balanced, supporting robust photosynthesis, nutrient assimilation, and healthy root development.`

    bnRiskLevel = "স্বাভাবিক"
    bnRiskTitle = "চাষাবাদের জন্য আদর্শ অনুকূল আবহাওয়া"
    bnRiskDetails = `আবহাওয়ার সমস্ত উপাদান সুষম অবস্থায় রয়েছে, যা ফসলের সুষম বৃদ্ধি ও শিকড়ের বিকাশে সহায়ক।`

    hiRiskLevel = "सामान्य"
    hiRiskTitle = "फसल वृद्धि हेतु आदर्श मौसम"
    hiRiskDetails = `मौसम के सभी कारक अनुकूल हैं, जिससे फसलों में समुचित विकास और पोषण ग्रहण हो रहा है।`

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
    bnReason = "তাপমাত্রা ও আর্দ্রতার ভারসাম্য ফসলের স্বাভাবিক খাদ্য তৈরি ও সার গ্রহণের ক্ষমতা সর্বোচ্চ রাখে।"
    hiReason = "तापमान और नमी का संतुलन फसल में पोषक तत्वों के अवशोषण और भोजन निर्माण की प्रक्रिया को तेज करता है।"

    irrigationAdvice = "Normal irrigation schedule. Irrigate as per stage-specific root depth requirements."
    fertilizerAdvice = "Ideal window for scheduled split application of Urea, Potash, and micronutrients."
    pestAdvice = "Maintain routine weekly scouting. Beneficial predator insect populations are active."

    bnIrrigationAdvice = "স্বাভাবিক সেচ বজায় রাখুন। ফসলের বৃদ্ধির পর্যায় অনুযায়ী হালকা সেচ দিন।"
    bnFertilizerAdvice = "ইউরিয়া, পটাশ এবং অনুখাদ্য সার প্রয়োগের জন্য এটি আদর্শ সময়।"
    bnSprayAdvice = "প্রয়োজনে সকালের শান্ত আবহাওয়ায় যে কোন নির্ধারিত স্প্রে সম্পন্ন করুন।"
    bnPestAdvice = "সপ্তাহে একবার রুটিন পর্যবেক্ষণ করুন। উপকারী পোকার সংখ্যা ভালো রয়েছে।"

    hiIrrigationAdvice = "नियमित सिंचाई चक्र जारी रखें। आवश्यकतानुसार हल्की सिंचाई करें।"
    hiFertilizerAdvice = "यूरिया, पोटाश एवं सूक्ष्म पोषक तत्वों के प्रयोग के लिए उपयुक्त समय।"
    hiSprayAdvice = "शांत हवा में सुबह के समय अनुशंसित छिड़काव पूरा करें।"
    hiPestAdvice = "साप्ताहिक निरीक्षण जारी रखें। मित्र कीट सक्रिय हैं।"

    sprayingSuitability = 95
    drainagePriority = "Low"
    topDressingSuitability = 95

    bnRecommendedActions = [
      "নির্ধারিত কৃষি কাজ, নিড়ানি ও মাটি আলগা করার কাজ চালিয়ে যান।",
      "প্রয়োজনে হালকা সেচ দিয়ে মাটিতে পরিমিত রস বজায় রাখুন।",
      "সারের নির্ধারিত কিস্তি (ইউরিয়া ও জিংক) সঠিক নিয়মে প্রয়োগ করুন।",
      "জমির আইল পরিষ্কার রাখুন এবং নিয়মিত ফসল পরিদর্শন করুন।"
    ]
    bnActionsToAvoid = [
      "অতিরিক্ত সেচ দিয়ে জল ও সারের অপচয় করবেন না।",
      "দুপুরের অতিরিক্ত গরমে কীটনাশক স্প্রে করবেন না।"
    ]

    hiRecommendedActions = [
      "निर्धारित कृषि कार्य, निराई-गुड़ाई एवं खाद प्रबंधन जारी रखें।",
      "खेत में आवश्यकतानुसार हल्की सिंचाई बनाए रखें।",
      "उर्वरकों की निर्धारित खुराक (यूरिया व जिंक) का प्रयोग करें।",
      "खेत की मेड़ साफ रखें और फसलों का सामान्य निरीक्षण करें।"
    ]
    hiActionsToAvoid = [
      "अत्यधिक सिंचाई से बचें, इससे जल व पोषक तत्वों की बर्बादी होती है।",
      "तेज हवा या दोपहर में छिड़काव न करें।"
    ]
  }

  // 5-Day Day-by-Day Farmer Agromet Schedule (English)
  const fiveDayPlanEn = [
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

  // 5-Day Plan (Bengali)
  const fiveDayPlanBn = [
    {
      day: "দিন ১ (আজ)",
      task: rainfall > 15 ? "নিকাশি নালা খুলে দিন ও সব ধরনের স্প্রে বন্ধ রাখুন" : "মাটির আর্দ্রতা পরীক্ষা করুন ও নিড়ানির কাজ সম্পন্ন করুন",
      status: rainfall > 15 ? "জরুরি অগ্রাধিকার" : "উপযুক্ত সময়",
      statusColor: rainfall > 15 ? "#ef4444" : "#22c55e",
      icon: "i-check-circle"
    },
    {
      day: "দিন ২ (আগামীকাল)",
      task: rainfall > 10 ? "বৃষ্টির আশঙ্কায় সার প্রয়োগ স্থগিত রাখুন" : "নির্ধারিত ইউরিয়া ও অনুখাদ্য স্প্রে প্রয়োগ করুন",
      status: rainfall > 10 ? "সতর্কতা" : "সুপারিশকৃত",
      statusColor: rainfall > 10 ? "#eab308" : "#22c55e",
      icon: "i-drop"
    },
    {
      day: "দিন ৩",
      task: "মাজরা পোকা, পাতা পোড়া ও শিকড় পচা রোগের লক্ষণ পর্যবেক্ষণ করুন",
      status: "রুটিন পরিদর্শন",
      statusColor: "#3b82f6",
      icon: "i-sparkles"
    },
    {
      day: "দিন ৪",
      task: "মাটির রস পরীক্ষা করুন; প্রয়োজন হলে হালকা সেচ দিন",
      status: "আর্দ্রতা পরীক্ষা",
      statusColor: "#3b82f6",
      icon: "i-sun"
    },
    {
      day: "দিন ৫",
      task: "জমির আইলের আগাছা পরিষ্কার করে পোকার আশ্রয়স্থল ধ্বংস করুন",
      status: "পরিচর্যা",
      statusColor: "#22c55e",
      icon: "i-sprout"
    }
  ]

  // 5-Day Plan (Hindi)
  const fiveDayPlanHi = [
    {
      day: "दिन 1 (आज)",
      task: rainfall > 15 ? "जल निकासी नाली खोलें और रसायनों का छिड़काव स्थगित रखें" : "खेत की नमी जांचें और आवश्यक निराई-गुड़ाई करें",
      status: rainfall > 15 ? "उच्च प्राथमिकता" : "अनुकूल समय",
      statusColor: rainfall > 15 ? "#ef4444" : "#22c55e",
      icon: "i-check-circle"
    },
    {
      day: "दिन 2 (कल)",
      task: rainfall > 10 ? "वर्षा की संभावना के कारण खाद का छिड़काव रोकें" : "अनुशंसित यूरिया व सूक्ष्म पोषक तत्वों का छिड़काव करें",
      status: rainfall > 10 ? "सावधानी" : "अनुशंसित",
      statusColor: rainfall > 10 ? "#eab308" : "#22c55e",
      icon: "i-drop"
    },
    {
      day: "दिन 3",
      task: "तना छेदक, झुलसा व जड़ गलन रोगों की निगरानी करें",
      status: "नियमित निरीक्षण",
      statusColor: "#3b82f6",
      icon: "i-sparkles"
    },
    {
      day: "दिन 4",
      task: "मिट्टी की नमी जांचें; आवश्यकता होने पर हल्की सिंचाई करें",
      status: "नमी जांच",
      statusColor: "#3b82f6",
      icon: "i-sun"
    },
    {
      day: "दिन 5",
      task: "मेड़ों से खरपतवार हटाएं ताकि कीटों का वास समाप्त हो सके",
      status: "खेत प्रबंधन",
      statusColor: "#22c55e",
      icon: "i-sprout"
    }
  ]

  // Multilingual translations structure guaranteed for CropAdvisory.jsx
  const translations = {
    en: {
      bulletinTitle: `Agro-Advisory Bulletin for ${panchayatName}`,
      bulletinNo: "BULLETIN NO: WB-DAMU-2026/84",
      liveBadge: "DAMU Live Telemetry",
      subtitle: `Gram Panchayat: ${panchayatName} • Comprehensive Crop Phenology & Weather Directive`,
      cropLabel: "Selected Crop",
      stageLabel: "Growth Stage",
      impactLabel: "Weather Impact Assessment",
      riskLabel: "Crop Risk Assessment",
      recLabel: "Recommended Actions",
      avoidLabel: "Actions to Avoid",
      reasonLabel: "Scientific Rationale & Agronomic Analysis",
      outlook48h: "48-Hour Microclimate Outlook",
      stageDuration: "Stage Duration",
      stageSensitivityLabel: "Stage Weather Sensitivity",
      riskScoreLabel: "Risk Level",
      weatherImpactText: weatherImpact,
      reasonText: reasonForAdvisory,
      buttons: {
        voice: "Agromet Voice",
        broadcast: "Broadcast to Farmers",
        print: "Print Bulletin"
      },
      selectors: {
        block: "Block / Tehsil",
        panchayat: "Gram Panchayat",
        crop: "Target Crop",
        growthStage: "Growth Stage",
        rain: "Rainfall",
        rh: "RH",
        quickSwitch: "Quick Switch GP"
      },
      cropRisk: {
        level: cropRiskLevel,
        score: cropRiskScore,
        title: cropRiskTitle,
        details: cropRiskDetails
      },
      operations: {
        irrigationTitle: "Irrigation Scheduling",
        irrigationTag: drainagePriority === "Critical" ? "Drainage Priority" : "Moisture Adequate",
        irrigationText: irrigationAdvice,
        fertilizerTitle: "Nutrient Application",
        fertilizerTag: topDressingSuitability > 60 ? "Window Open" : "Hold Application",
        fertilizerText: fertilizerAdvice,
        sprayTitle: "Spray Window",
        sprayTag: sprayingSuitability > 60 ? "Favorable" : "Unfavorable",
        sprayText: rainfall > 15 ? "Strongly avoid foliar spraying due to rainfall washout." : temp >= 35 ? "Spray only in early cool morning hours." : "Ideal window for scheduled biopesticide/fungicide sprays.",
        pestTitle: "Pest & Disease Surveillance",
        pestTag: cropRiskLevel === "Critical" || cropRiskLevel === "High" ? "Elevated Alert" : "Routine Scouting",
        pestText: pestAdvice
      },
      recommendedActions,
      actionsToAvoid,
      fiveDayPlan: fiveDayPlanEn,
      tabs: {
        fiveday: "5-Day Agromet Plan",
        operations: "Field Operations Matrix",
        askai: "Agromet AI Intelligence",
        fivedayTitle: "5-Day Step-by-Step Agromet Implementation Plan",
        fivedaySubtitle: "Precision daily agricultural recommendations tailored to forecasted weather events",
        askaiTitle: "Agromet AI Intelligence Advisor",
        askaiPlaceholder: "Ask Agromet AI about crops, fertilizers, pest control, or weather...",
        askaiBtn: "Ask AI"
      },
      audioScript: `Agromet advisory for ${crop} at ${stage} stage in ${panchayatName}. ${weatherImpact} The crop risk is evaluated as ${cropRiskLevel}. Key recommendations: ${recommendedActions.slice(0, 3).join('. ')}. Key precautions: ${actionsToAvoid.slice(0, 2).join('. ')}.`
    },
    bn: {
      bulletinTitle: `${panchayatName} পঞ্চায়েতের কৃষি-আবহাওয়া বুলেটিন`,
      bulletinNo: "বুলেটিন নং: WB-DAMU-2026/84",
      liveBadge: "ডিজিটাল কৃষি তথ্য",
      subtitle: `গ্রাম পঞ্চায়েত: ${panchayatName} • ফসলের বৃদ্ধি পর্যায় ও সুনির্দিষ্ট আবহাওয়া নির্দেশিকা`,
      cropLabel: "নির্বাচিত ফসল",
      stageLabel: "বৃদ্ধির পর্যায়",
      impactLabel: "আবহাওয়ার প্রভাব মূল্যায়ন",
      riskLabel: "ফসলের ঝুঁকি মূল্যায়ন",
      recLabel: "করণীয় সুপারিশসমূহ",
      avoidLabel: "যা করবেন না (সতর্কতা)",
      reasonLabel: "পরামর্শের বৈজ্ঞানিক কারণ ও ব্যাখ্যা",
      outlook48h: "৪৮ ঘণ্টার আবহাওয়া পূর্বাভাস",
      stageDuration: "পর্যায়ের সময়কাল",
      stageSensitivityLabel: "আবহাওয়া সংবেদনশীলতা",
      riskScoreLabel: "ঝুঁকির মাত্রা",
      weatherImpactText: bnWeatherImpact,
      reasonText: bnReason,
      buttons: {
        voice: "ভয়েস বার্তা",
        broadcast: "কৃষকদের সম্প্রচার",
        print: "বুলেটিন প্রিন্ট"
      },
      selectors: {
        block: "ব্লক নির্বাচন",
        panchayat: "গ্রাম পঞ্চায়েত",
        crop: "ফসল নির্বাচন",
        growthStage: "বৃদ্ধির পর্যায়",
        rain: "বৃষ্টিপাত",
        rh: "আর্দ্রতা",
        quickSwitch: "দ্রুত পঞ্চায়েত পরিবর্তন"
      },
      cropRisk: {
        level: bnRiskLevel,
        score: cropRiskScore,
        title: bnRiskTitle,
        details: bnRiskDetails
      },
      operations: {
        irrigationTitle: "সেচ ও নিকাশি ব্যবস্থাপনা",
        irrigationTag: drainagePriority === "Critical" ? "জরুরি নিকাশি" : "আর্দ্রতা পর্যাপ্ত",
        irrigationText: bnIrrigationAdvice,
        fertilizerTitle: "সার ও পুষ্টি প্রয়োগ",
        fertilizerTag: topDressingSuitability > 60 ? "প্রয়োগের উপযুক্ত সময়" : "সার প্রয়োগ স্থগিত",
        fertilizerText: bnFertilizerAdvice,
        sprayTitle: "স্প্রে করার উপযুক্ত সময়",
        sprayTag: sprayingSuitability > 60 ? "অনুকূল" : "প্রতিকূল",
        sprayText: bnSprayAdvice,
        pestTitle: "কীটপতঙ্গ ও রোগ নজরদারি",
        pestTag: cropRiskLevel === "Critical" || cropRiskLevel === "High" ? "উচ্চ সতর্কতা" : "নিয়মিত নজরদারি",
        pestText: bnPestAdvice
      },
      recommendedActions: bnRecommendedActions,
      actionsToAvoid: bnActionsToAvoid,
      fiveDayPlan: fiveDayPlanBn,
      tabs: {
        fiveday: "৫ দিনের কৃষি কর্মপরিকল্পনা",
        operations: "মাঠ পর্যায়ের অপারেশন ম্যাট্রিক্স",
        askai: "এআই কৃষি পরামর্শদাতা",
        fivedayTitle: "৫ দিনের ধাপে ধাপে কৃষি আবহাওয়া নির্দেশিকা",
        fivedaySubtitle: "পূর্বাভাসকৃত আবহাওয়ার সাথে সামঞ্জস্য রেখে কৃষকদের জন্য দৈনিক করণীয় তালিকা",
        askaiTitle: "এআই কৃষি পরামর্শ সহকারী",
        askaiPlaceholder: "ফসল, সার, রোগবালাই বা আবহাওয়া সম্পর্কে এআই-কে জিজ্ঞাসা করুন...",
        askaiBtn: "পাঠান"
      },
      audioScript: `${panchayatName} অঞ্চলের ${crop} চাষিদের জন্য আবহাওয়া বার্তা। ${bnWeatherImpact} ফসলের ঝুঁকির মাত্রা ${bnRiskLevel}। প্রধান করণীয়: ${bnRecommendedActions.slice(0, 2).join('। ')}। সতর্কতা: ${bnActionsToAvoid.slice(0, 2).join('। ')}।`
    },
    hi: {
      bulletinTitle: `${panchayatName} पंचायत कृषि-मौसम बुलेटिन`,
      bulletinNo: "बुलेटिन संख्या: WB-DAMU-2026/84",
      liveBadge: "डिजिटल मौसम प्रसारण",
      subtitle: `ग्राम पंचायत: ${panchayatName} • फसल अवस्था एवं मौसम आधारित सटीक सलाह`,
      cropLabel: "चयनित फसल",
      stageLabel: "विकास अवस्था",
      impactLabel: "मौसम प्रभाव आकलन",
      riskLabel: "फसल जोखिम आकलन",
      recLabel: "अनुशंसित कृषि कार्य",
      avoidLabel: "क्या न करें (सावधानियां)",
      reasonLabel: "परामर्श का वैज्ञानिक कारण एवं विश्लेषण",
      outlook48h: "48 घंटे का मौसम पूर्वानुमान",
      stageDuration: "अवस्था अवधि",
      stageSensitivityLabel: "मौसम संवेदनशीलता",
      riskScoreLabel: "जोखिम स्तर",
      weatherImpactText: hiWeatherImpact,
      reasonText: hiReason,
      buttons: {
        voice: "ध्वनि संदेश",
        broadcast: "किसानों को प्रसारण",
        print: "बुलेटिन प्रिंट"
      },
      selectors: {
        block: "प्रखंड चयन",
        panchayat: "ग्राम पंचायत",
        crop: "फसल चयन",
        growthStage: "विकास अवस्था",
        rain: "वर्षा",
        rh: "आर्द्रता",
        quickSwitch: "त्वरित पंचायत चयन"
      },
      cropRisk: {
        level: hiRiskLevel,
        score: cropRiskScore,
        title: hiRiskTitle,
        details: hiRiskDetails
      },
      operations: {
        irrigationTitle: "सिंचाई एवं जल प्रबंधन",
        irrigationTag: drainagePriority === "Critical" ? "निकासी प्राथमिकता" : "नमी पर्याप्त",
        irrigationText: hiIrrigationAdvice,
        fertilizerTitle: "उर्वरक एवं पोषण प्रबंधन",
        fertilizerTag: topDressingSuitability > 60 ? "छिड़काव अनुकूल" : "उर्वरक रोकें",
        fertilizerText: hiFertilizerAdvice,
        sprayTitle: "कीटनाशक छिड़काव समय",
        sprayTag: sprayingSuitability > 60 ? "अनुकूल" : "प्रतिकूल",
        sprayText: hiSprayAdvice,
        pestTitle: "कीट एवं रोग निगरानी",
        pestTag: cropRiskLevel === "Critical" || cropRiskLevel === "High" ? "उच्च सतर्कता" : "नियमित निगरानी",
        pestText: hiPestAdvice
      },
      recommendedActions: hiRecommendedActions,
      actionsToAvoid: hiActionsToAvoid,
      fiveDayPlan: fiveDayPlanHi,
      tabs: {
        fiveday: "5-दिवसीय कृषि कार्य योजना",
        operations: "क्षेत्रीय परिचालन मैट्रिक्स",
        askai: "एआई कृषि सलाहकार",
        fivedayTitle: "5-दिवसीय चरणबद्ध कृषि मौसम कार्य योजना",
        fivedaySubtitle: "मौसम पूर्वानुमान के अनुसार किसानों के लिए दैनिक सटीक कृषि सिफारिशें",
        askaiTitle: "एआई कृषि-मौसम सहायक",
        askaiPlaceholder: "फसल, खाद, कीट नियंत्रण या मौसम के बारे में एआई से पूछें...",
        askaiBtn: "पूछें"
      },
      audioScript: `${panchayatName} क्षेत्र के किसान भाइयों के लिए सलाह। ${hiWeatherImpact} फसल जोखिम ${hiRiskLevel} है। मुख्य कार्य: ${hiRecommendedActions.slice(0, 2).join('। ')}। सावधानियां: ${hiActionsToAvoid.slice(0, 2).join('। ')}।`
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
    fiveDayPlan: fiveDayPlanEn,
    translations
  }
}

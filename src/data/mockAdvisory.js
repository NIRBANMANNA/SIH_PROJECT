export const mockCrops = ["Rice (Kharif)", "Potato", "Wheat", "Jute", "Mustard"]

export const mockGrowthStages = {
  "Rice (Kharif)": ["Seedling", "Tillering", "Panicle Initiation", "Flowering", "Maturity"],
  "Potato": ["Sprouting", "Vegetative", "Tuber Initiation", "Tuber Bulking", "Maturation"],
  "Wheat": ["Crown Root Initiation", "Tillering", "Jointing", "Heading", "Dough"],
  "Jute": ["Seedling", "Vegetative", "Harvesting"],
  "Mustard": ["Vegetative", "Flowering", "Pod Formation", "Maturity"]
}

export const getAdvisory = (crop, stage, weather) => {
  let advisory = {
    action: "Normal agricultural operations can continue.",
    warnings: [],
    fertilizer: "Apply standard NPK ratio as scheduled.",
    irrigation: "Maintain standard soil moisture based on stage requirements."
  }
  
  if (weather.rainfall > 10) {
    advisory.action = "Postpone fertilizer application and spraying of pesticides."
    advisory.warnings.push("High risk of waterlogging in low-lying areas.")
    advisory.irrigation = "Drain excess water from the fields immediately."
  }
  
  if (weather.temp > 35 && weather.rainfall === 0) {
    advisory.warnings.push("High temperature stress expected.")
    advisory.irrigation = "Apply light and frequent irrigation during evening hours."
  }
  
  if (crop === "Rice (Kharif)" && stage === "Tillering" && weather.rainfall > 5) {
      advisory.action = "Maintain 5cm standing water in the field. Ideal condition for tillering."
  }
  
  if (weather.humidity > 80 && weather.temp > 28) {
      advisory.warnings.push("High risk of pest incidence (e.g. Stem borer, Aphids). Monitor closely.")
  }
  
  return advisory
}

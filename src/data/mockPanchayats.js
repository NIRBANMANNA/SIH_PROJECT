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
export const mockPanchayats = {
  "Polba-Dadpur": [
    { id: "p1", name: "Amnan", lat: 22.95, lng: 88.30 },
    { id: "p2", name: "Babnan", lat: 22.97, lng: 88.28 },
    { id: "p3", name: "Sugandhya", lat: 22.93, lng: 88.33 },
    { id: "p4", name: "Polba", lat: 22.94, lng: 88.31 }
  ],
  "Chinsurah-Mogra": [
    { id: "p5", name: "Bandel", lat: 22.92, lng: 88.38 },
    { id: "p6", name: "Debanandapur", lat: 22.90, lng: 88.37 }
  ]
}

export const getPanchayatsForBlock = (block) => mockPanchayats[block] || []

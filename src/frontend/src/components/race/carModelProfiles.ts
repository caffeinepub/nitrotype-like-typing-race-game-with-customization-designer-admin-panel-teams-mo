// Model-specific visual profiles for distinct car silhouettes
export interface CarModelProfile {
  // Body dimensions
  bodyWidth: number;
  bodyLength: number;
  bodyHeight: number;
  
  // Cabin/roof dimensions
  cabinWidth: number;
  cabinHeight: number;
  cabinLength: number;
  cabinOffset: number; // Z-axis offset from center
  
  // Front features
  frontSpoilerWidth: number;
  frontSpoilerHeight: number;
  frontNoseLength: number;
  
  // Rear features
  rearSpoilerWidth: number;
  rearSpoilerHeight: number;
  rearSpoilerThickness: number;
  rearDeckHeight: number;
  
  // Side features
  sideIntakes: boolean;
  sideIntakeSize: number;
  
  // Wheelbase
  wheelRadius: number;
  wheelWidth: number;
  wheelbaseLength: number;
  trackWidth: number;
  
  // Marker (2D top-down view)
  markerWidth: number;
  markerLength: number;
  markerCabinRatio: number; // Cabin width as ratio of body width
  markerNoseLength: number; // Front nose extension
  markerHasSpoiler: boolean;
}

const LAMBORGHINI_URUS: CarModelProfile = {
  // SUV proportions - taller, wider, more upright
  bodyWidth: 2.4,
  bodyLength: 5.2,
  bodyHeight: 1.8,
  
  cabinWidth: 2.2,
  cabinHeight: 1.2,
  cabinLength: 3.0,
  cabinOffset: 0,
  
  frontSpoilerWidth: 2.3,
  frontSpoilerHeight: 0.25,
  frontNoseLength: 0.3,
  
  rearSpoilerWidth: 2.0,
  rearSpoilerHeight: 0.2,
  rearSpoilerThickness: 0.4,
  rearDeckHeight: 0.4,
  
  sideIntakes: true,
  sideIntakeSize: 0.6,
  
  wheelRadius: 0.55,
  wheelWidth: 0.5,
  wheelbaseLength: 3.8,
  trackWidth: 2.6,
  
  markerWidth: 22,
  markerLength: 36,
  markerCabinRatio: 0.85,
  markerNoseLength: 4,
  markerHasSpoiler: false,
};

const LAMBORGHINI_REVUELTO: CarModelProfile = {
  // Flagship hybrid supercar - aggressive, wide, low
  bodyWidth: 2.1,
  bodyLength: 5.0,
  bodyHeight: 1.1,
  
  cabinWidth: 1.6,
  cabinHeight: 0.65,
  cabinLength: 2.2,
  cabinOffset: -0.2,
  
  frontSpoilerWidth: 2.0,
  frontSpoilerHeight: 0.18,
  frontNoseLength: 0.4,
  
  rearSpoilerWidth: 1.8,
  rearSpoilerHeight: 0.25,
  rearSpoilerThickness: 0.7,
  rearDeckHeight: 0.5,
  
  sideIntakes: true,
  sideIntakeSize: 0.8,
  
  wheelRadius: 0.52,
  wheelWidth: 0.45,
  wheelbaseLength: 3.6,
  trackWidth: 2.3,
  
  markerWidth: 18,
  markerLength: 32,
  markerCabinRatio: 0.7,
  markerNoseLength: 6,
  markerHasSpoiler: true,
};

const LAMBORGHINI_TEMERARIO: CarModelProfile = {
  // Mid-engine sports car - compact, sharp, angular
  bodyWidth: 2.0,
  bodyLength: 4.7,
  bodyHeight: 1.15,
  
  cabinWidth: 1.55,
  cabinHeight: 0.7,
  cabinLength: 2.0,
  cabinOffset: 0.1,
  
  frontSpoilerWidth: 1.9,
  frontSpoilerHeight: 0.16,
  frontNoseLength: 0.35,
  
  rearSpoilerWidth: 1.7,
  rearSpoilerHeight: 0.22,
  rearSpoilerThickness: 0.6,
  rearDeckHeight: 0.45,
  
  sideIntakes: true,
  sideIntakeSize: 0.7,
  
  wheelRadius: 0.5,
  wheelWidth: 0.42,
  wheelbaseLength: 3.4,
  trackWidth: 2.2,
  
  markerWidth: 17,
  markerLength: 30,
  markerCabinRatio: 0.72,
  markerNoseLength: 5,
  markerHasSpoiler: true,
};

const LAMBORGHINI_HURACAN: CarModelProfile = {
  // Classic V10 supercar - balanced, sleek
  bodyWidth: 2.0,
  bodyLength: 4.8,
  bodyHeight: 1.2,
  
  cabinWidth: 1.6,
  cabinHeight: 0.72,
  cabinLength: 2.1,
  cabinOffset: -0.1,
  
  frontSpoilerWidth: 1.85,
  frontSpoilerHeight: 0.17,
  frontNoseLength: 0.3,
  
  rearSpoilerWidth: 1.65,
  rearSpoilerHeight: 0.2,
  rearSpoilerThickness: 0.55,
  rearDeckHeight: 0.42,
  
  sideIntakes: true,
  sideIntakeSize: 0.65,
  
  wheelRadius: 0.5,
  wheelWidth: 0.4,
  wheelbaseLength: 3.5,
  trackWidth: 2.2,
  
  markerWidth: 17,
  markerLength: 30,
  markerCabinRatio: 0.75,
  markerNoseLength: 5,
  markerHasSpoiler: true,
};

const BUGATTI_VEYRON: CarModelProfile = {
  // Iconic hypercar - wide, powerful, distinctive C-line
  bodyWidth: 2.2,
  bodyLength: 5.0,
  bodyHeight: 1.25,
  
  cabinWidth: 1.7,
  cabinHeight: 0.75,
  cabinLength: 2.3,
  cabinOffset: -0.3,
  
  frontSpoilerWidth: 2.1,
  frontSpoilerHeight: 0.2,
  frontNoseLength: 0.45,
  
  rearSpoilerWidth: 1.9,
  rearSpoilerHeight: 0.3,
  rearSpoilerThickness: 0.8,
  rearDeckHeight: 0.55,
  
  sideIntakes: true,
  sideIntakeSize: 0.9,
  
  wheelRadius: 0.53,
  wheelWidth: 0.48,
  wheelbaseLength: 3.7,
  trackWidth: 2.4,
  
  markerWidth: 19,
  markerLength: 32,
  markerCabinRatio: 0.73,
  markerNoseLength: 7,
  markerHasSpoiler: true,
};

const BUGATTI_CHIRON: CarModelProfile = {
  // Ultimate hypercar - massive, imposing, refined C-line
  bodyWidth: 2.3,
  bodyLength: 5.1,
  bodyHeight: 1.3,
  
  cabinWidth: 1.75,
  cabinHeight: 0.8,
  cabinLength: 2.4,
  cabinOffset: -0.35,
  
  frontSpoilerWidth: 2.2,
  frontSpoilerHeight: 0.22,
  frontNoseLength: 0.5,
  
  rearSpoilerWidth: 2.0,
  rearSpoilerHeight: 0.35,
  rearSpoilerThickness: 0.85,
  rearDeckHeight: 0.6,
  
  sideIntakes: true,
  sideIntakeSize: 1.0,
  
  wheelRadius: 0.55,
  wheelWidth: 0.5,
  wheelbaseLength: 3.8,
  trackWidth: 2.5,
  
  markerWidth: 20,
  markerLength: 34,
  markerCabinRatio: 0.72,
  markerNoseLength: 8,
  markerHasSpoiler: true,
};

const DEFAULT_PROFILE: CarModelProfile = {
  bodyWidth: 2.0,
  bodyLength: 4.8,
  bodyHeight: 1.2,
  
  cabinWidth: 1.6,
  cabinHeight: 0.7,
  cabinLength: 2.2,
  cabinOffset: -0.2,
  
  frontSpoilerWidth: 1.9,
  frontSpoilerHeight: 0.18,
  frontNoseLength: 0.3,
  
  rearSpoilerWidth: 1.7,
  rearSpoilerHeight: 0.2,
  rearSpoilerThickness: 0.6,
  rearDeckHeight: 0.4,
  
  sideIntakes: true,
  sideIntakeSize: 0.7,
  
  wheelRadius: 0.5,
  wheelWidth: 0.4,
  wheelbaseLength: 3.5,
  trackWidth: 2.2,
  
  markerWidth: 17,
  markerLength: 30,
  markerCabinRatio: 0.75,
  markerNoseLength: 5,
  markerHasSpoiler: true,
};

export function getCarModelProfile(modelName: string): CarModelProfile {
  const name = modelName.toLowerCase();
  
  if (name.includes('urus')) return LAMBORGHINI_URUS;
  if (name.includes('revuelto')) return LAMBORGHINI_REVUELTO;
  if (name.includes('temerario')) return LAMBORGHINI_TEMERARIO;
  if (name.includes('huracan')) return LAMBORGHINI_HURACAN;
  if (name.includes('veyron')) return BUGATTI_VEYRON;
  if (name.includes('chiron')) return BUGATTI_CHIRON;
  
  return DEFAULT_PROFILE;
}

import { CarColor } from '../../backend';
import { getCarModelProfile } from './carModelProfiles';

interface TrackCarMarkerProps {
  modelName: string;
  color: CarColor;
  className?: string;
}

const COLOR_MAP: Record<CarColor, string> = {
  [CarColor.blue]: '#3b82f6',
  [CarColor.black]: '#000000',
  [CarColor.red]: '#ef4444',
  [CarColor.yellow]: '#eab308',
  [CarColor.white]: '#ffffff',
};

export default function TrackCarMarker({ modelName, color, className = '' }: TrackCarMarkerProps) {
  const hexColor = COLOR_MAP[color] || COLOR_MAP[CarColor.blue];
  const profile = getCarModelProfile(modelName);
  
  const carWidth = `${profile.markerWidth}px`;
  const carHeight = `${profile.markerLength}px`;
  const cabinWidth = `${profile.markerWidth * profile.markerCabinRatio}px`;
  const noseHeight = `${profile.markerNoseLength}px`;
  
  return (
    <div className={`relative ${className}`} style={{ width: carWidth, height: carHeight }}>
      {/* Main body */}
      <div
        className="absolute inset-0 rounded-sm shadow-lg"
        style={{
          backgroundColor: hexColor,
          border: color === CarColor.white ? '2px solid #d1d5db' : 'none',
        }}
      />
      
      {/* Cabin/cockpit (narrower section) */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 bg-black/20 rounded-sm"
        style={{
          top: '25%',
          width: cabinWidth,
          height: '35%',
        }}
      />
      
      {/* Front nose extension */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 rounded-t-sm"
        style={{
          top: 0,
          width: `${profile.markerWidth * 0.7}px`,
          height: noseHeight,
          backgroundColor: hexColor,
          border: color === CarColor.white ? '2px solid #d1d5db' : 'none',
          borderBottom: 'none',
        }}
      />
      
      {/* Headlights */}
      <div 
        className="absolute bg-yellow-200 rounded-full" 
        style={{ 
          top: '3%', 
          left: '20%', 
          width: `${profile.markerWidth * 0.2}px`, 
          height: `${profile.markerWidth * 0.15}px` 
        }} 
      />
      <div 
        className="absolute bg-yellow-200 rounded-full" 
        style={{ 
          top: '3%', 
          right: '20%', 
          width: `${profile.markerWidth * 0.2}px`, 
          height: `${profile.markerWidth * 0.15}px` 
        }} 
      />
      
      {/* Rear spoiler (for sports cars) */}
      {profile.markerHasSpoiler && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 rounded-sm"
          style={{
            bottom: '3%',
            width: `${profile.markerWidth * 0.75}px`,
            height: `${profile.markerWidth * 0.25}px`,
            backgroundColor: hexColor,
            border: color === CarColor.white ? '1px solid #d1d5db' : 'none',
          }}
        />
      )}
      
      {/* Side mirrors/intakes indicators */}
      <div 
        className="absolute bg-black/40 rounded-full" 
        style={{ 
          top: '30%', 
          left: '-2px', 
          width: '4px', 
          height: `${profile.markerWidth * 0.3}px` 
        }} 
      />
      <div 
        className="absolute bg-black/40 rounded-full" 
        style={{ 
          top: '30%', 
          right: '-2px', 
          width: '4px', 
          height: `${profile.markerWidth * 0.3}px` 
        }} 
      />
    </div>
  );
}

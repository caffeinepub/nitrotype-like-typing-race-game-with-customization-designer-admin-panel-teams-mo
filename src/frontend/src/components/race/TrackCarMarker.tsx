import { CarColor } from '../../backend';

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
  const isBugatti = modelName.includes('Bugatti');
  const isUrus = modelName.includes('Urus');
  
  // Determine car shape based on model
  const carWidth = isUrus ? '20px' : '16px';
  const carHeight = isUrus ? '32px' : '28px';
  
  return (
    <div className={`relative ${className}`} style={{ width: carWidth, height: carHeight }}>
      {/* Main body */}
      <div
        className="absolute inset-0 rounded-sm shadow-lg"
        style={{
          backgroundColor: hexColor,
          border: color === CarColor.white ? '1px solid #d1d5db' : 'none',
        }}
      />
      
      {/* Windshield */}
      <div
        className="absolute top-[20%] left-[15%] right-[15%] h-[25%] bg-black/30 rounded-t-sm"
      />
      
      {/* Headlights */}
      <div className="absolute top-[5%] left-[15%] w-[25%] h-[8%] bg-yellow-200 rounded-full" />
      <div className="absolute top-[5%] right-[15%] w-[25%] h-[8%] bg-yellow-200 rounded-full" />
      
      {/* Spoiler for sports cars */}
      {!isUrus && (
        <div
          className="absolute bottom-[5%] left-[10%] right-[10%] h-[6%] rounded-sm"
          style={{ backgroundColor: hexColor }}
        />
      )}
    </div>
  );
}

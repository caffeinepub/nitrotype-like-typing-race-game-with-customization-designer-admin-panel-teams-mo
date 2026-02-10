import TrackCarMarker from './TrackCarMarker';
import { CarColor } from '../../backend';

interface TrackVisualizationProps {
  playerProgress: number;
  opponentProgress?: number[];
  opponentNames?: string[];
  mode: 'solo' | 'ghost';
  playerCarModel?: string;
  playerCarColor?: CarColor;
}

export default function TrackVisualization({
  playerProgress,
  opponentProgress = [],
  opponentNames = [],
  mode,
  playerCarModel = 'Default Racer',
  playerCarColor = CarColor.blue,
}: TrackVisualizationProps) {
  const lanes = mode === 'solo' ? 1 : Math.max(1, opponentProgress.length + 1);

  return (
    <div className="w-full bg-muted/30 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <span>START</span>
        <span>FINISH</span>
      </div>

      {/* Player Lane */}
      <div className="relative">
        <div className="h-16 bg-background border-2 border-primary/30 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center px-2">
            <div
              className="transition-all duration-300 ease-out flex items-center justify-center"
              style={{ marginLeft: `calc(${Math.min(playerProgress, 100)}% - 10px)` }}
            >
              <TrackCarMarker 
                modelName={playerCarModel} 
                color={playerCarColor}
              />
            </div>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary">
            YOU
          </div>
        </div>
      </div>

      {/* Ghost Opponent Lanes */}
      {mode === 'ghost' && opponentProgress.map((progress, index) => (
        <div key={index} className="relative">
          <div className="h-16 bg-background border-2 border-muted rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center px-2">
              <div
                className="transition-all duration-300 ease-out flex items-center justify-center"
                style={{ marginLeft: `calc(${Math.min(progress, 100)}% - 10px)` }}
              >
                <TrackCarMarker 
                  modelName="Default Racer" 
                  color={CarColor.blue}
                  className="opacity-50"
                />
              </div>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
              {opponentNames[index] || `Ghost ${index + 1}`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

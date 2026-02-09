import { Car } from 'lucide-react';

interface TrackVisualizationProps {
  playerProgress: number;
  opponentProgress?: number[];
  opponentNames?: string[];
  mode: 'solo' | 'ghost';
}

export default function TrackVisualization({
  playerProgress,
  opponentProgress = [],
  opponentNames = [],
  mode,
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
        <div className="h-12 bg-background border-2 border-primary/30 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center px-2">
            <div className="text-xs font-semibold text-primary">YOU</div>
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
            style={{ left: `${Math.min(playerProgress, 100)}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
              <Car className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Opponent Lanes */}
      {mode === 'ghost' && opponentProgress.map((progress, index) => (
        <div key={index} className="relative">
          <div className="h-12 bg-background border-2 border-chart-2/30 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center px-2">
              <div className="text-xs font-semibold text-chart-2">
                {opponentNames[index] || `GHOST ${index + 1}`}
              </div>
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
              style={{ left: `${Math.min(progress, 100)}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="bg-chart-2 text-chart-2-foreground rounded-full p-2 shadow-lg opacity-70">
                <Car className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { computeRaceMetrics } from '../lib/raceMetrics';
import { generateRaceTextForUser, storeLastRaceWPM } from '../lib/raceTextGeneration';
import TrackVisualization from '../components/race/TrackVisualization';
import WordZoneIndicator from '../components/race/WordZoneIndicator';
import CarViewer3D from '../components/race/CarViewer3D';
import { useGetCallerUserProfile, useCarById } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActiveCar } from '../hooks/useActiveCar';
import { CarColor } from '../backend';

export default function RacePage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { mode?: string };
  const mode = search?.mode || 'solo';
  const isDemoMode = mode === 'practice';
  
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { activeCarId } = useActiveCar();
  const activeCar = useCarById(activeCarId);
  
  // Generate race text based on user's WPM
  const [raceData] = useState(() => {
    const userWPM = userProfile?.bestWPM;
    return generateRaceTextForUser(userWPM);
  });
  
  const [text] = useState(raceData.text);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [currentWPM, setCurrentWPM] = useState(0);
  const [currentAccuracy, setCurrentAccuracy] = useState(100);
  const [visualProgress, setVisualProgress] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Smooth visual progress animation
  useEffect(() => {
    const targetProgress = (input.length / text.length) * 100;
    const animationFrame = requestAnimationFrame(() => {
      setVisualProgress((prev) => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.5) return targetProgress;
        return prev + diff * 0.15;
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [input.length, text.length]);

  useEffect(() => {
    if (input.length === 1 && startTime === null) {
      setStartTime(Date.now());
    }

    if (input.length > 0 && startTime) {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const correctChars = [...input].filter((char, i) => char === text[i]).length;
      const metrics = computeRaceMetrics(correctChars, input.length, elapsedSeconds);
      setCurrentWPM(metrics.wpm);
      setCurrentAccuracy(metrics.accuracy);
    }

    if (input === text && !isFinished) {
      setIsFinished(true);
      const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
      const correctChars = text.length;
      const metrics = computeRaceMetrics(correctChars, text.length, elapsedSeconds);
      
      // Store the WPM for future races
      storeLastRaceWPM(metrics.wpm);
      
      // Handle race completion
      const handleRaceCompletion = async () => {
        const saveStatus = isDemoMode || !identity ? 'skipped' : 'skipped';
        
        // Store results in sessionStorage for results page
        sessionStorage.setItem('raceResults', JSON.stringify({
          ...metrics,
          isDemoMode,
          creditResult: null,
          saveStatus,
        }));
        
        // Wait for car to reach finish line
        setTimeout(() => {
          navigate({ to: '/race/results' });
        }, 800);
      };
      
      handleRaceCompletion();
    }
  }, [input, text, startTime, navigate, isDemoMode, isFinished, identity]);

  const progress = (input.length / text.length) * 100;

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = 'text-muted-foreground';
      
      if (index < input.length) {
        className = input[index] === char ? 'text-chart-1' : 'text-destructive';
      }
      
      if (index === input.length) {
        className += ' bg-primary/20 animate-pulse';
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  // Fallback car if none selected
  const displayCar = activeCar || { name: 'Default Racer', color: CarColor.blue };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-4">
        {isDemoMode && (
          <Badge variant="outline" className="text-chart-2 border-chart-2">
            Practice Mode - Stats won't be saved
          </Badge>
        )}
        
        <WordZoneIndicator
          zone={raceData.zone}
          targetWordCount={raceData.targetWordCount}
          effectiveWPM={raceData.effectiveWPM}
          compact
        />
      </div>

      {/* 3D Car Viewer - Takes majority of space */}
      <div className="w-full h-[50vh] min-h-[400px] rounded-lg overflow-hidden bg-gradient-to-b from-background to-muted/30 border">
        <CarViewer3D modelName={displayCar.name} color={displayCar.color} />
      </div>

      <TrackVisualization
        playerProgress={visualProgress}
        opponentProgress={[]}
        opponentNames={[]}
        mode="solo"
        playerCarModel={displayCar.name}
        playerCarColor={displayCar.color}
      />

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-chart-1">{currentWPM}</div>
              <div className="text-sm text-muted-foreground">WPM</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-chart-2">{currentAccuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-chart-3">
                {startTime ? Math.floor((Date.now() - startTime) / 1000) : 0}s
              </div>
              <div className="text-sm text-muted-foreground">Time</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <Progress value={progress} className="h-2" />
          
          {/* Non-copyable race text */}
          <div 
            className="p-6 bg-muted/30 rounded-lg font-mono text-lg leading-relaxed select-none"
            onCopy={(e) => e.preventDefault()}
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            {renderText()}
          </div>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isFinished}
            className="w-full p-4 bg-background border border-border rounded-lg font-mono text-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
            placeholder="Start typing here..."
          />
        </CardContent>
      </Card>
    </div>
  );
}

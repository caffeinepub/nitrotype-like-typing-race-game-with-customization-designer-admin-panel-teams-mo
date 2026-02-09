import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Target, Coins, RotateCcw, Home, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { RaceMetrics } from '../lib/raceMetrics';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface RaceResults extends RaceMetrics {
  isDemoMode?: boolean;
  creditResult?: any | null;
  saveStatus?: 'success' | 'failure' | 'skipped';
}

export default function RaceResultsPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [results, setResults] = useState<RaceResults | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('raceResults');
    if (stored) {
      setResults(JSON.parse(stored));
      sessionStorage.removeItem('raceResults');
    } else {
      navigate({ to: '/race' });
    }
  }, [navigate]);

  if (!results) {
    return null;
  }

  const saveStatus = results.saveStatus || 'skipped';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 mb-4">
          <Trophy className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Race Complete!</h1>
        {results.isDemoMode && (
          <Badge variant="outline" className="text-chart-2 border-chart-2">
            Practice Mode
          </Badge>
        )}
      </div>

      {saveStatus === 'skipped' && !results.isDemoMode && !identity && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must be logged in to save race results. This race will not be recorded.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-chart-1/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-chart-1" />
              Words Per Minute
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-chart-1">{results.wpm}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {results.wpm >= 60 ? 'Excellent!' : results.wpm >= 40 ? 'Good job!' : 'Keep practicing!'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-chart-2/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-chart-2" />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-chart-2">{results.accuracy}%</div>
            <p className="text-sm text-muted-foreground mt-2">
              {results.accuracy >= 95 ? 'Perfect!' : results.accuracy >= 85 ? 'Great!' : 'Focus on accuracy!'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-chart-3/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-chart-3" />
              Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-chart-3">{results.elapsedSeconds.toFixed(1)}s</div>
            <p className="text-sm text-muted-foreground mt-2">Total race time</p>
          </CardContent>
        </Card>

        <Card className="border-chart-4/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-chart-4" />
              Race Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-4">Great Job!</div>
            <p className="text-sm text-muted-foreground mt-2">
              {results.isDemoMode ? 'Practice mode completed' : 'Race finished'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 justify-center">
        <Button asChild size="lg" className="gap-2">
          <Link to="/race">
            <RotateCcw className="h-5 w-5" />
            Race Again
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link to="/">
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

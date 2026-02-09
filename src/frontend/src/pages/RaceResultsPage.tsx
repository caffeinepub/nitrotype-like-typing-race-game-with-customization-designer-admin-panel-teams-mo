import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Target, Coins, RotateCcw, Home, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { RaceMetrics } from '../lib/raceMetrics';
import type { CreditResult } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface RaceResults extends RaceMetrics {
  isDemoMode?: boolean;
  creditResult?: CreditResult | null;
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

  const showSaveStatus = !results.isDemoMode && identity;
  const earnedTrpCoins = results.isDemoMode ? 0 : (results.creditResult?.creditAmount ? Number(results.creditResult.creditAmount) : 0);
  const newBalance = results.creditResult?.finalBalance ? Number(results.creditResult.finalBalance) : null;

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

      {showSaveStatus && (
        <Alert className="border-chart-1/50 bg-chart-1/5">
          <CheckCircle2 className="h-4 w-4 text-chart-1" />
          <AlertDescription>
            Your race performance has been saved and your stats have been updated!
            {newBalance !== null && (
              <span className="block mt-1">
                New balance: <strong>{newBalance.toLocaleString()} TRP Coins</strong>
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {!results.isDemoMode && !identity && (
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
              TRP Coins Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-chart-4">
              {earnedTrpCoins.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {results.isDemoMode ? 'Practice mode' : 'TRP Coins earned'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button size="lg" asChild>
          <Link to="/race">
            <RotateCcw className="h-5 w-5 mr-2" />
            Race Again
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/">
            <Home className="h-5 w-5 mr-2" />
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

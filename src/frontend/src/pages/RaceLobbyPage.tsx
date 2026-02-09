import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, Clock, Target, Users } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { getEffectiveWPM } from '../lib/raceTextGeneration';
import { getWordZoneForWPM, selectTargetWordCount } from '../lib/wordZones';
import WordZoneIndicator from '../components/race/WordZoneIndicator';

export default function RaceLobbyPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);
  const { data: userProfile } = useGetCallerUserProfile();

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in to start racing.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleStartRace = (mode: 'solo' | 'ghost' | 'practice') => {
    setIsStarting(true);
    setTimeout(() => {
      navigate({ to: '/race/active', search: { mode } });
    }, 500);
  };

  // Calculate preview zone info
  const effectiveWPM = getEffectiveWPM(userProfile?.bestWPM);
  const previewZone = getWordZoneForWPM(effectiveWPM);
  const previewTargetWordCount = selectTargetWordCount(previewZone);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
          Race Lobby
        </h1>
        <p className="text-muted-foreground text-lg">
          Get ready to test your typing speed!
        </p>
      </div>

      <WordZoneIndicator
        zone={previewZone}
        targetWordCount={previewTargetWordCount}
        effectiveWPM={effectiveWPM}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" />
              Solo Race
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Race alone and focus on improving your personal best.
            </p>
            <Button
              onClick={() => handleStartRace('solo')}
              disabled={isStarting}
              className="w-full"
              size="lg"
            >
              {isStarting ? 'Starting...' : 'Start Solo Race'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-chart-1/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-chart-1" />
              vs Others (Ghosts)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Race against ghost opponents based on top leaderboard performances.
            </p>
            <Button
              onClick={() => handleStartRace('ghost')}
              disabled={isStarting}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {isStarting ? 'Starting...' : 'Race vs Ghosts'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-chart-2/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-chart-2" />
              Practice Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Practice without affecting your competitive stats.
            </p>
            <Button
              onClick={() => handleStartRace('practice')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Practice
            </Button>
          </CardContent>
        </Card>

        <Card className="border-chart-3/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-chart-3" />
              Custom Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Race with a specific text of your choice.
            </p>
            <Button variant="outline" className="w-full" size="lg" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Race</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-primary">
              1
            </div>
            <div>
              <h4 className="font-semibold">Choose Your Mode</h4>
              <p className="text-sm text-muted-foreground">
                Select Solo for focused practice, Ghost mode to race against top performers, or Practice mode for casual typing.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-primary">
              2
            </div>
            <div>
              <h4 className="font-semibold">Type Accurately</h4>
              <p className="text-sm text-muted-foreground">
                Type the displayed text as quickly and accurately as possible. Watch your car advance on the track!
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-primary">
              3
            </div>
            <div>
              <h4 className="font-semibold">Finish & Earn</h4>
              <p className="text-sm text-muted-foreground">
                Complete the race to see your WPM, accuracy, and earn currency based on your performance!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

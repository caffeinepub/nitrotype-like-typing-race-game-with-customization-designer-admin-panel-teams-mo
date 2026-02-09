import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, Zap, Target, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetRaceHistory } from '../hooks/useQueries';

export default function RaceHistoryPage() {
  const { identity } = useInternetIdentity();
  const userPrincipal = identity?.getPrincipal().toString() || null;
  const { data: raceHistory, isLoading } = useGetRaceHistory(userPrincipal);

  if (!identity) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please log in to view your race history.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Race History</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Races</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : !raceHistory || raceHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No race history yet. Complete some races to see your history here!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {raceHistory.map((race, index) => {
                const timestamp = Number(race.timestamp) / 1000000; // Convert from nanoseconds to milliseconds
                const date = new Date(timestamp);
                const raceTimeSeconds = Number(race.raceTime) / 1000; // Convert from milliseconds to seconds
                const combinedScore = race.wpm * race.accuracy / 100;

                return (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-muted/30 border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{date.toLocaleDateString()}</span>
                        <span className="text-muted-foreground/60">•</span>
                        <span>{date.toLocaleTimeString()}</span>
                      </div>
                      {race.raceTextId > 0n && (
                        <Badge variant="outline" className="text-xs">
                          Text #{race.raceTextId.toString()}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-chart-1" />
                        <div>
                          <div className="text-xl font-bold text-chart-1">{race.wpm.toFixed(0)}</div>
                          <div className="text-xs text-muted-foreground">WPM</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-chart-2" />
                        <div>
                          <div className="text-xl font-bold text-chart-2">{race.accuracy.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Accuracy</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-chart-3" />
                        <div>
                          <div className="text-xl font-bold text-chart-3">{raceTimeSeconds.toFixed(1)}s</div>
                          <div className="text-xs text-muted-foreground">Time</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-chart-4" />
                        <div>
                          <div className="text-xl font-bold text-chart-4">{combinedScore.toFixed(0)}</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { useLeaderboardWithProfiles } from '../hooks/useLeaderboards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trophy, Medal, Award, Zap, Target, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LeaderboardType } from '../backend';

export default function LeaderboardsPage() {
  const [selectedCategory, setSelectedCategory] = useState<LeaderboardType>(LeaderboardType.wpmLeaderboard);
  const { data: entries, isLoading } = useLeaderboardWithProfiles(selectedCategory);

  const getCategoryTitle = (category: LeaderboardType) => {
    switch (category) {
      case LeaderboardType.wpmLeaderboard:
        return 'Top Racers by Speed';
      case LeaderboardType.accuracyLeaderboard:
        return 'Top Racers by Accuracy';
      case LeaderboardType.combinedLeaderboard:
        return 'Top Racers by Combined Score';
      default:
        return 'Leaderboard';
    }
  };

  const getCategoryIcon = (category: LeaderboardType) => {
    switch (category) {
      case LeaderboardType.wpmLeaderboard:
        return <Zap className="h-5 w-5 text-chart-1" />;
      case LeaderboardType.accuracyLeaderboard:
        return <Target className="h-5 w-5 text-chart-2" />;
      case LeaderboardType.combinedLeaderboard:
        return <TrendingUp className="h-5 w-5 text-chart-3" />;
      default:
        return <Trophy className="h-5 w-5 text-primary" />;
    }
  };

  const getScoreDisplay = (entry: any, category: LeaderboardType) => {
    switch (category) {
      case LeaderboardType.wpmLeaderboard:
        return {
          value: entry.wpm.toFixed(0),
          label: 'WPM',
          color: 'text-chart-1',
        };
      case LeaderboardType.accuracyLeaderboard:
        return {
          value: entry.accuracy.toFixed(1) + '%',
          label: 'Accuracy',
          color: 'text-chart-2',
        };
      case LeaderboardType.combinedLeaderboard:
        return {
          value: entry.combinedScore.toFixed(0),
          label: 'Score',
          color: 'text-chart-3',
        };
      default:
        return {
          value: '0',
          label: '',
          color: 'text-primary',
        };
    }
  };

  const renderLeaderboardContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      );
    }

    if (!entries || entries.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No entries yet. Complete some races to appear here!</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {entries.map((entry, index) => {
          const Icon = index === 0 ? Trophy : index === 1 ? Medal : index === 2 ? Award : null;
          const iconColor =
            index === 0 ? 'text-chart-1' : index === 1 ? 'text-chart-2' : 'text-chart-3';
          const scoreDisplay = getScoreDisplay(entry, selectedCategory);

          return (
            <div
              key={entry.userPrincipal}
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 font-bold text-primary shrink-0">
                {Icon ? <Icon className={`h-5 w-5 ${iconColor}`} /> : index + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold">
                  {entry.displayName || `${entry.userPrincipal.slice(0, 8)}...${entry.userPrincipal.slice(-6)}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{entry.username || entry.userPrincipal.slice(0, 10)}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${scoreDisplay.color}`}>
                  {scoreDisplay.value}
                </div>
                <div className="text-xs text-muted-foreground">{scoreDisplay.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Leaderboards</h1>
      </div>

      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as LeaderboardType)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value={LeaderboardType.wpmLeaderboard} className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Speed
          </TabsTrigger>
          <TabsTrigger value={LeaderboardType.accuracyLeaderboard} className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Accuracy
          </TabsTrigger>
          <TabsTrigger value={LeaderboardType.combinedLeaderboard} className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Combined
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getCategoryIcon(selectedCategory)}
                {getCategoryTitle(selectedCategory)}
              </CardTitle>
            </CardHeader>
            <CardContent>{renderLeaderboardContent()}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

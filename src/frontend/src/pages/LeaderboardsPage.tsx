import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trophy, Zap, Target, TrendingUp } from 'lucide-react';
import { LeaderboardType } from '../hooks/useLeaderboards';
import { useState } from 'react';

export default function LeaderboardsPage() {
  const [selectedCategory, setSelectedCategory] = useState<LeaderboardType>(LeaderboardType.wpmLeaderboard);

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
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Leaderboards feature coming soon!</p>
                <p className="text-sm mt-2">Backend support is being added.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

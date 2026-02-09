import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Trophy, Zap, Target, Coins, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerUserProfile();

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-gradient-to-r from-chart-1/10 via-chart-2/10 to-chart-3/10 border-chart-1/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center shrink-0">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold">{profile.displayName}</h1>
                <p className="text-muted-foreground">@{profile.username}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Joined {new Date(Number(profile.createdAt) / 1000000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-chart-1" />
              Races Played
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{profile.racesPlayed.toString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-chart-2" />
              Best WPM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-chart-2">{profile.bestWPM.toFixed(0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-chart-3" />
              Average WPM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-chart-3">{profile.averageWPM.toFixed(0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-chart-4" />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-chart-4">{profile.accuracy.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Coins className="h-5 w-5 text-chart-1" />
              Balance (TRP Coins)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-chart-1">{Number(profile.balance).toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-2">Available for purchases and team creation</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Trophy, Users, ShoppingBag, Palette, Coins } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent">
            Welcome to TypeRacer Pro
          </h1>
          <p className="text-xl text-muted-foreground">
            Test your typing speed, compete with others, and improve your skills!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-chart-1" />
                Race
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Challenge yourself with typing races
              </p>
              <Button className="w-full" asChild>
                <Link to="/race">Start Racing</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-chart-2" />
                Leaderboards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                See how you rank against others
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/leaderboards">View Rankings</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-chart-3" />
                Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Join or create a racing team
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/teams">Explore Teams</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Card className="bg-gradient-to-r from-chart-1/10 via-chart-2/10 to-chart-3/10 border-chart-1/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {profile?.displayName}!</h1>
              <p className="text-muted-foreground mt-1">Ready to race?</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">TRP Coins</div>
              <div className="text-3xl font-bold text-chart-1">
                {profile ? Number(profile.balance).toLocaleString() : '0'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-chart-1" />
              Races
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile?.racesPlayed.toString() || '0'}</div>
            <p className="text-sm text-muted-foreground mt-1">Total races</p>
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
            <div className="text-3xl font-bold text-chart-2">
              {profile?.bestWPM.toFixed(0) || '0'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Personal best</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-chart-3" />
              Avg WPM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-3">
              {profile?.averageWPM.toFixed(0) || '0'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Average speed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Coins className="h-5 w-5 text-chart-4" />
              TRP Coins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-4">
              {profile ? Number(profile.balance).toLocaleString() : '0'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Available balance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-chart-1" />
              Start Racing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Jump into a race and earn TRP Coins!
            </p>
            <Button className="w-full" asChild>
              <Link to="/race">Race Now</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-chart-2" />
              Leaderboards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Check your ranking and compete for the top spot
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/leaderboards">View Rankings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-chart-3" />
              Teams
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Join or create a team for 50,000 TRP Coins
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/teams">Explore Teams</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-chart-4" />
              Shop
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Browse items and customize your experience
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/shop">Visit Shop</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-chart-1" />
              Customize
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Personalize your cars, banners, and more
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/customize">Customize</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Plus, Coins, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetTeams, useCreateTeam } from '../hooks/useTeams';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function TeamsPage() {
  const { data: teams, isLoading } = useGetTeams();
  const { data: profile } = useGetCallerUserProfile();
  const createTeam = useCreateTeam();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teamName, setTeamName] = useState('');

  const TEAM_COST = 50000;
  const canAffordTeam = profile && Number(profile.balance) >= TEAM_COST;

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    if (!canAffordTeam) {
      toast.error('Insufficient TRP Coins to create a team');
      return;
    }

    try {
      await createTeam.mutateAsync(teamName);
      toast.success(`Team "${teamName}" created successfully!`);
      setTeamName('');
      setIsDialogOpen(false);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create team';
      if (errorMessage.includes('Insufficient balance')) {
        toast.error('Insufficient TRP Coins to create a team');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Teams</h1>
            <p className="text-muted-foreground">Join or create a racing team</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Team</DialogTitle>
              <DialogDescription>
                Create your own racing team for 50,000 TRP Coins. Teams can have up to 100 members.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
              <Alert>
                <Coins className="h-4 w-4" />
                <AlertDescription>
                  <strong>Cost: 50,000 TRP Coins</strong>
                  <br />
                  Your balance: {profile ? Number(profile.balance).toLocaleString() : '0'} TRP Coins
                </AlertDescription>
              </Alert>
              {!canAffordTeam && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You need at least 50,000 TRP Coins to create a team. Keep racing to earn more!
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTeam} disabled={createTeam.isPending || !canAffordTeam}>
                {createTeam.isPending ? 'Creating...' : 'Create Team'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : teams && teams.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id.toString()} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {team.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Members:</span>
                    <span className="font-medium">{team.members.length} / {Number(team.memberLimit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Team Balance:</span>
                    <span className="font-medium">{Number(team.balance).toLocaleString()} TRP</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/teams/${team.id.toString()}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Users className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
              <div>
                <h3 className="text-lg font-semibold">No teams yet</h3>
                <p className="text-muted-foreground">Be the first to create a team!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

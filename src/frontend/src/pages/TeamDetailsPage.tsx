import { useParams, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ArrowLeft, Crown, Coins } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetTeamById } from '../hooks/useTeams';
import { useGetUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function TeamDetailsPage() {
  const { teamId } = useParams({ strict: false });
  const { data: team, isLoading } = useGetTeamById(teamId);
  const { identity } = useInternetIdentity();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="outline" asChild>
          <Link to="/teams">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Link>
        </Button>
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Users className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
              <div>
                <h3 className="text-lg font-semibold">Team not found</h3>
                <p className="text-muted-foreground">This team does not exist.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isFounder = identity && team.founder.toString() === identity.getPrincipal().toString();
  const isMember = identity && team.members.some(m => m.toString() === identity.getPrincipal().toString());
  const isFull = team.members.length >= Number(team.memberLimit);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="outline" asChild>
        <Link to="/teams">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Teams
        </Link>
      </Button>

      <Card className="bg-gradient-to-r from-chart-1/10 via-chart-2/10 to-chart-3/10 border-chart-1/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                {team.name}
              </CardTitle>
              {isFounder && (
                <Badge variant="outline" className="text-chart-1 border-chart-1">
                  <Crown className="h-3 w-3 mr-1" />
                  Founder
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Members</div>
              <div className="text-2xl font-bold">
                {team.members.length} / {Number(team.memberLimit)}
              </div>
              {isFull && (
                <Badge variant="secondary" className="text-xs">Team Full</Badge>
              )}
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Team Balance</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Coins className="h-5 w-5 text-chart-4" />
                {Number(team.balance).toLocaleString()}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="text-2xl font-bold">
                {isMember ? (
                  <Badge className="text-base">Member</Badge>
                ) : (
                  <Badge variant="outline" className="text-base">Not a member</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members ({team.members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {team.members.map((member, index) => (
              <MemberRow
                key={member.toString()}
                principal={member.toString()}
                isFounder={member.toString() === team.founder.toString()}
                index={index}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MemberRow({ principal, isFounder, index }: { principal: string; isFounder: boolean; index: number }) {
  const { data: profile } = useGetUserProfile(principal);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center text-white font-bold">
          {index + 1}
        </div>
        <div>
          <div className="font-medium flex items-center gap-2">
            {profile?.displayName || 'Loading...'}
            {isFounder && (
              <Crown className="h-4 w-4 text-chart-1" />
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            @{profile?.username || principal.slice(0, 8)}
          </div>
        </div>
      </div>
      {profile && (
        <div className="text-right text-sm">
          <div className="font-medium">{profile.bestWPM.toFixed(0)} WPM</div>
          <div className="text-muted-foreground">{profile.accuracy.toFixed(1)}% acc</div>
        </div>
      )}
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function RaceHistoryPage() {
  const { identity } = useInternetIdentity();

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
        <Calendar className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Race History</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Races</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Race history feature coming soon!</p>
            <p className="text-sm mt-2">Backend support is being added.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

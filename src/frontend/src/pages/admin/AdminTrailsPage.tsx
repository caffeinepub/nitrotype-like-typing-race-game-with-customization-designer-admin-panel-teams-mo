import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function AdminTrailsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Manage Trails</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trail Effects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Trail management interface coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

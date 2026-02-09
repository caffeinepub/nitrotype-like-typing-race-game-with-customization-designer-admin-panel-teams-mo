import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function AdminMotdPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Message of the Day</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure MOTD</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>MOTD configuration interface coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

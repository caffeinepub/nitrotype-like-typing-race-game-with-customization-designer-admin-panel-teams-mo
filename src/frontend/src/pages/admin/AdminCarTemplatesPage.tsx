import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';

export default function AdminCarTemplatesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Image className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Manage Car Templates</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Car Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Template management interface coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

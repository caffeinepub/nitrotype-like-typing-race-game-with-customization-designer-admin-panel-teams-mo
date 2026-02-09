import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface AuditEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  details: string;
}

export default function AdminAuditLog() {
  const [entries] = useState<AuditEntry[]>([
    {
      id: '1',
      timestamp: new Date(),
      user: 'Admin',
      action: 'create',
      details: 'Created title "Speed Demon"',
    },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No audit entries yet. Actions will appear here.
              </p>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <Badge variant="outline">{entry.action}</Badge>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{entry.details}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.user} • {entry.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

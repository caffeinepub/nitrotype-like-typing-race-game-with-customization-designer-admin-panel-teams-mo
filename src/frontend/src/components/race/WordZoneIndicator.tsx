import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Gauge } from 'lucide-react';
import type { WordZone } from '@/lib/wordZones';

interface WordZoneIndicatorProps {
  zone: WordZone;
  targetWordCount: number;
  effectiveWPM: number;
  compact?: boolean;
}

export default function WordZoneIndicator({
  zone,
  targetWordCount,
  effectiveWPM,
  compact = false,
}: WordZoneIndicatorProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Badge variant="outline" className="gap-1.5">
          <Gauge className="h-3 w-3" />
          {zone.zoneLabel} ({zone.wpmRange})
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <Target className="h-3 w-3" />
          {targetWordCount} words
        </Badge>
      </div>
    );
  }

  return (
    <Card className="border-primary/30">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Gauge className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Your Zone</div>
              <div className="text-lg font-bold">
                {zone.zoneLabel} <span className="text-sm font-normal text-muted-foreground">({zone.wpmRange})</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-chart-1/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Target</div>
              <div className="text-lg font-bold">{targetWordCount} words</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

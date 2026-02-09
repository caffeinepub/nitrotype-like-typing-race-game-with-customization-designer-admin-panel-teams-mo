import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function AccessDeniedScreen({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <ShieldAlert className="h-20 w-20 text-destructive mx-auto" />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            {message || 'You do not have permission to access this area.'}
          </p>
        </div>
        <Button asChild>
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

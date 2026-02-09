import { useIsAdmin } from '../../hooks/useAdmin';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import AccessDeniedScreen from './AccessDeniedScreen';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsAdmin();

  if (!identity) {
    return <AccessDeniedScreen message="Please log in to access admin features." />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}

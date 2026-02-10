import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import AccessDeniedScreen from './AccessDeniedScreen';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  if (!identity) {
    return <AccessDeniedScreen message="Please log in to access admin features." />;
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Allow access if user has a saved profile (joined player)
  if (!userProfile) {
    return <AccessDeniedScreen message="Please complete your profile setup to access admin features." />;
  }

  return <>{children}</>;
}

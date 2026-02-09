import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, UserPlus, UserMinus, Info } from 'lucide-react';
import { usePromoteToAdmin, useRevokeAdmin } from '../../hooks/useQueries';
import { Principal } from '@dfinity/principal';

export default function AdminManagementPage() {
  const [principalInput, setPrincipalInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const promoteToAdmin = usePromoteToAdmin();
  const revokeAdmin = useRevokeAdmin();

  const validatePrincipal = (input: string): boolean => {
    try {
      Principal.fromText(input);
      return true;
    } catch {
      return false;
    }
  };

  const handleGrantAdmin = async () => {
    setError(null);
    setSuccess(null);

    if (!principalInput.trim()) {
      setError('Please enter a Principal ID');
      return;
    }

    if (!validatePrincipal(principalInput)) {
      setError('Invalid Principal ID format');
      return;
    }

    try {
      const principal = Principal.fromText(principalInput);
      await promoteToAdmin.mutateAsync(principal);
      setSuccess(`Admin access granted to ${principalInput}. The user must refresh or re-login for changes to take effect.`);
      setPrincipalInput('');
    } catch (err: any) {
      setError(err.message || 'Failed to grant admin access');
    }
  };

  const handleRevokeAdmin = async () => {
    setError(null);
    setSuccess(null);

    if (!principalInput.trim()) {
      setError('Please enter a Principal ID');
      return;
    }

    if (!validatePrincipal(principalInput)) {
      setError('Invalid Principal ID format');
      return;
    }

    try {
      const principal = Principal.fromText(principalInput);
      await revokeAdmin.mutateAsync(principal);
      setSuccess(`Admin access revoked from ${principalInput}. The user must refresh or re-login for changes to take effect.`);
      setPrincipalInput('');
    } catch (err: any) {
      setError(err.message || 'Failed to revoke admin access');
    }
  };

  const isLoading = promoteToAdmin.isPending || revokeAdmin.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Management</h1>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          The first 5 users to create profiles automatically receive admin access. Use this interface to grant or revoke admin privileges for additional users.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Manage Administrator Access</CardTitle>
          <CardDescription>
            Grant or revoke admin privileges by entering a user's Principal ID
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="principal">User Principal ID</Label>
            <Input
              id="principal"
              placeholder="e.g., 2vxsx-fae..."
              value={principalInput}
              onChange={(e) => setPrincipalInput(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Enter the full Principal ID of the user you want to manage
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleGrantAdmin}
              disabled={isLoading || !principalInput.trim()}
              className="flex-1"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {promoteToAdmin.isPending ? 'Granting...' : 'Grant Admin'}
            </Button>

            <Button
              onClick={handleRevokeAdmin}
              disabled={isLoading || !principalInput.trim()}
              variant="destructive"
              className="flex-1"
            >
              <UserMinus className="h-4 w-4 mr-2" />
              {revokeAdmin.isPending ? 'Revoking...' : 'Revoke Admin'}
            </Button>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> After granting or revoking admin access, the affected user must refresh their browser or log out and log back in for the changes to take effect.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Find a User's Principal ID</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-primary">
              1
            </div>
            <div>
              <h4 className="font-semibold">Ask the User</h4>
              <p className="text-sm text-muted-foreground">
                Users can find their Principal ID in their profile page or by checking their Internet Identity.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-primary">
              2
            </div>
            <div>
              <h4 className="font-semibold">Check Leaderboards</h4>
              <p className="text-sm text-muted-foreground">
                Principal IDs are visible in the leaderboard entries (though truncated in the UI).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 font-bold text-primary">
              3
            </div>
            <div>
              <h4 className="font-semibold">Browser Console</h4>
              <p className="text-sm text-muted-foreground">
                Advanced users can retrieve their Principal ID from the browser console using the Internet Identity API.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

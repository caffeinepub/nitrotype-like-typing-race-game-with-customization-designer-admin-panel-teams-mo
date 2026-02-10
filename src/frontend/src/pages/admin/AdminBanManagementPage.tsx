import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useBanUser, useUnbanUser } from '../../hooks/useBans';
import { toast } from 'sonner';

export default function AdminBanManagementPage() {
  const [banPrincipal, setBanPrincipal] = useState('');
  const [unbanPrincipal, setUnbanPrincipal] = useState('');
  
  const banUser = useBanUser();
  const unbanUser = useUnbanUser();

  const handleBan = async () => {
    if (!banPrincipal.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    try {
      await banUser.mutateAsync(banPrincipal);
      toast.success('User has been banned successfully');
      setBanPrincipal('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to ban user';
      toast.error(errorMessage);
    }
  };

  const handleUnban = async () => {
    if (!unbanPrincipal.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    try {
      await unbanUser.mutateAsync(unbanPrincipal);
      toast.success('User has been unbanned successfully');
      setUnbanPrincipal('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to unban user';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <ShieldOff className="h-8 w-8 text-accent" />
        <div>
          <h1 className="text-3xl font-bold">Ban Management</h1>
          <p className="text-muted-foreground">Manage user access and restrictions</p>
        </div>
      </div>

      <Alert className="border-accent/30 bg-accent/5">
        <AlertCircle className="h-4 w-4 text-accent" />
        <AlertDescription>
          Banned users cannot perform game actions like racing, buying cars, or updating their profile. Admin actions remain available to admins even when banned.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="ban" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ban">
            <ShieldOff className="h-4 w-4 mr-2" />
            Ban User
          </TabsTrigger>
          <TabsTrigger value="unban">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Unban User
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ban">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle>Ban User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-destructive/30 bg-destructive/5">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription>
                  Banning a user will prevent them from performing any game actions. Use this feature responsibly.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ban-principal">User Principal ID</Label>
                  <Input
                    id="ban-principal"
                    placeholder="Enter principal ID (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
                    value={banPrincipal}
                    onChange={(e) => setBanPrincipal(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The unique identifier of the user to ban
                  </p>
                </div>

                <Button
                  onClick={handleBan}
                  disabled={banUser.isPending}
                  variant="destructive"
                  className="w-full"
                >
                  {banUser.isPending ? 'Banning...' : 'Ban User'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unban">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle>Unban User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-accent/30 bg-accent/5">
                <AlertCircle className="h-4 w-4 text-accent" />
                <AlertDescription>
                  Unbanning a user will restore their access to all game features.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unban-principal">User Principal ID</Label>
                  <Input
                    id="unban-principal"
                    placeholder="Enter principal ID (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
                    value={unbanPrincipal}
                    onChange={(e) => setUnbanPrincipal(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The unique identifier of the user to unban
                  </p>
                </div>

                <Button
                  onClick={handleUnban}
                  disabled={unbanUser.isPending}
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  {unbanUser.isPending ? 'Unbanning...' : 'Unban User'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

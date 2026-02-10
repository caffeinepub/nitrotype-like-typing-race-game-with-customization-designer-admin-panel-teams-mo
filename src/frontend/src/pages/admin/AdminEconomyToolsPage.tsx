import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, AlertCircle, DollarSign } from 'lucide-react';
import { useAdminGrantTrpCoins, useAdminSetBalance } from '../../hooks/useEconomy';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function AdminEconomyToolsPage() {
  const { identity } = useInternetIdentity();
  
  // Grant coins state
  const [grantPrincipal, setGrantPrincipal] = useState('');
  const [grantAmount, setGrantAmount] = useState('');
  const grantCoins = useAdminGrantTrpCoins();

  // Set balance state
  const [balancePrincipal, setBalancePrincipal] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const setBalance = useAdminSetBalance();

  const handleGrant = async () => {
    if (!grantPrincipal.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    if (!grantAmount.trim() || isNaN(Number(grantAmount)) || Number(grantAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const result = await grantCoins.mutateAsync({
        amount: BigInt(grantAmount),
        user: grantPrincipal,
      });
      
      toast.success(`Successfully granted ${grantAmount} TRP Coins! New balance: ${result.finalBalance.toString()}`);
      setGrantPrincipal('');
      setGrantAmount('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to grant TRP Coins';
      toast.error(errorMessage);
    }
  };

  const handleSetBalance = async () => {
    if (!balancePrincipal.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    if (!newBalance.trim() || isNaN(Number(newBalance)) || Number(newBalance) < 0) {
      toast.error('Please enter a valid balance');
      return;
    }

    try {
      await setBalance.mutateAsync({
        targetUser: balancePrincipal,
        newBalance: BigInt(newBalance),
      });
      
      toast.success(`Successfully set balance to ${newBalance} TRP Coins!`);
      setBalancePrincipal('');
      setNewBalance('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to set balance';
      toast.error(errorMessage);
    }
  };

  const fillCurrentUser = (setter: (value: string) => void) => {
    if (identity) {
      setter(identity.getPrincipal().toString());
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Coins className="h-8 w-8 text-accent" />
        <div>
          <h1 className="text-3xl font-bold">Economy Tools</h1>
          <p className="text-muted-foreground">Manage TRP Coins and economy settings</p>
        </div>
      </div>

      <Tabs defaultValue="grant" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grant">
            <Coins className="h-4 w-4 mr-2" />
            Grant Coins
          </TabsTrigger>
          <TabsTrigger value="set">
            <DollarSign className="h-4 w-4 mr-2" />
            Set Balance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grant">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle>Grant TRP Coins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-accent/30 bg-accent/5">
                <AlertCircle className="h-4 w-4 text-accent" />
                <AlertDescription>
                  Add TRP Coins to a user's existing balance. This action is logged and cannot be undone.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grant-principal">User Principal ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="grant-principal"
                      placeholder="Enter principal ID (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
                      value={grantPrincipal}
                      onChange={(e) => setGrantPrincipal(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fillCurrentUser(setGrantPrincipal)}
                      disabled={!identity}
                    >
                      Use Self
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The unique identifier of the user to receive TRP Coins
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grant-amount">Amount (TRP Coins)</Label>
                  <Input
                    id="grant-amount"
                    type="number"
                    placeholder="Enter amount (e.g., 10000)"
                    value={grantAmount}
                    onChange={(e) => setGrantAmount(e.target.value)}
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground">
                    The number of TRP Coins to add to the user's balance
                  </p>
                </div>

                <Button
                  onClick={handleGrant}
                  disabled={grantCoins.isPending}
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  {grantCoins.isPending ? 'Granting...' : 'Grant TRP Coins'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="set">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle>Set Exact Balance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-accent/30 bg-accent/5">
                <AlertCircle className="h-4 w-4 text-accent" />
                <AlertDescription>
                  Set a user's TRP Coins balance to an exact value. This will replace their current balance.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="balance-principal">User Principal ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="balance-principal"
                      placeholder="Enter principal ID (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
                      value={balancePrincipal}
                      onChange={(e) => setBalancePrincipal(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fillCurrentUser(setBalancePrincipal)}
                      disabled={!identity}
                    >
                      Use Self
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The unique identifier of the user whose balance will be set
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-balance">New Balance (TRP Coins)</Label>
                  <Input
                    id="new-balance"
                    type="number"
                    placeholder="Enter exact balance (e.g., 1000000)"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    The exact balance to set (replaces current balance)
                  </p>
                </div>

                <Button
                  onClick={handleSetBalance}
                  disabled={setBalance.isPending}
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  {setBalance.isPending ? 'Setting...' : 'Set Balance'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle>Economy Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <h4 className="font-semibold mb-2">Race Rewards</h4>
              <p className="text-sm text-muted-foreground">
                Non-practice races will award TRP Coins per completion (feature coming soon)
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <h4 className="font-semibold mb-2">Team Creation Cost</h4>
              <p className="text-sm text-muted-foreground">
                Creating a team will cost TRP Coins (feature coming soon)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

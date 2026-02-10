import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Coins, AlertCircle } from 'lucide-react';
import { useAdminGrantTrpCoins } from '../../hooks/useEconomy';
import { toast } from 'sonner';

export default function AdminEconomyToolsPage() {
  const [principal, setPrincipal] = useState('');
  const [amount, setAmount] = useState('');
  const grantCoins = useAdminGrantTrpCoins();

  const handleGrant = async () => {
    if (!principal.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const result = await grantCoins.mutateAsync({
        amount: BigInt(amount),
        user: principal,
      });
      
      toast.success(`Successfully granted ${amount} TRP Coins! New balance: ${result.finalBalance.toString()}`);
      setPrincipal('');
      setAmount('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to grant TRP Coins';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Coins className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Economy Tools</h1>
          <p className="text-muted-foreground">Manage TRP Coins and economy settings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grant TRP Coins</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              As an admin, you can grant TRP Coins to any user. This action is logged and cannot be undone.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principal">User Principal ID</Label>
              <Input
                id="principal"
                placeholder="Enter principal ID (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The unique identifier of the user to receive TRP Coins
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (TRP Coins)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount (e.g., 10000)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
              />
              <p className="text-xs text-muted-foreground">
                The number of TRP Coins to grant (supports large values)
              </p>
            </div>

            <Button
              onClick={handleGrant}
              disabled={grantCoins.isPending}
              className="w-full"
            >
              {grantCoins.isPending ? 'Granting...' : 'Grant TRP Coins'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Economy Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <h4 className="font-semibold mb-2">Race Rewards</h4>
              <p className="text-sm text-muted-foreground">
                Non-practice races will award TRP Coins per completion (feature coming soon)
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
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

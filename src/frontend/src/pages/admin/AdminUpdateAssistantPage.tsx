import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { parseAdminCommand } from '../../lib/adminCommandParser';
import AdminAuditLog from '../../components/admin/AdminAuditLog';
import { useAdminGrantTrpCoins } from '../../hooks/useEconomy';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function AdminUpdateAssistantPage() {
  const [command, setCommand] = useState('');
  const [parsedCommand, setParsedCommand] = useState<any>(null);
  const grantCoins = useAdminGrantTrpCoins();
  const { identity } = useInternetIdentity();

  const handleParse = () => {
    const result = parseAdminCommand(command);
    setParsedCommand(result);
  };

  const handleExecute = async () => {
    if (!parsedCommand?.isValid) return;
    
    try {
      if (parsedCommand.action === 'grantTrpCoins') {
        const targetUser = parsedCommand.params.user === 'current' && identity
          ? identity.getPrincipal().toString()
          : parsedCommand.params.user;
        
        const result = await grantCoins.mutateAsync({
          amount: BigInt(parsedCommand.params.amount),
          user: targetUser,
        });

        if (result.status === BigInt(200)) {
          toast.success(`Successfully granted ${Number(result.creditAmount).toLocaleString()} TRP Coins!`);
        } else {
          toast.error(result.message || 'Failed to grant TRP Coins');
        }
      } else {
        toast.success('Command executed successfully!');
      }
      
      setCommand('');
      setParsedCommand(null);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to execute command');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Update Assistant</h1>
          <p className="text-muted-foreground">Use natural language to make updates</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Command Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Try: Grant 1000 TRP coins to user"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            rows={4}
          />
          <Button onClick={handleParse} disabled={!command.trim()}>
            Parse Command
          </Button>
        </CardContent>
      </Card>

      {parsedCommand && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {parsedCommand.isValid ? (
                <CheckCircle className="h-5 w-5 text-chart-1" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              Command Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {parsedCommand.isValid ? (
              <>
                <Alert>
                  <AlertDescription>
                    <strong>Action:</strong> {parsedCommand.action}
                    {parsedCommand.itemType && (
                      <>
                        <br />
                        <strong>Type:</strong> {parsedCommand.itemType}
                      </>
                    )}
                    <br />
                    <strong>Parameters:</strong>
                    <pre className="mt-2 text-xs bg-muted p-2 rounded">
                      {JSON.stringify(parsedCommand.params, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
                <div className="flex gap-3">
                  <Button onClick={handleExecute} disabled={grantCoins.isPending}>
                    {grantCoins.isPending ? 'Executing...' : 'Confirm & Execute'}
                  </Button>
                  <Button variant="outline" onClick={() => setParsedCommand(null)}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <Alert variant="destructive">
                <AlertDescription>{parsedCommand.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <AdminAuditLog />

      <Card>
        <CardHeader>
          <CardTitle>Example Commands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="font-mono bg-muted p-2 rounded">
            Create a title called &apos;Speed Demon&apos; rarity epic price 500
          </p>
          <p className="font-mono bg-muted p-2 rounded">
            Set MOTD to &apos;Double rewards this weekend!&apos;
          </p>
          <p className="font-mono bg-muted p-2 rounded">
            Add text: &apos;The quick brown fox...&apos; category: beginner
          </p>
          <p className="font-mono bg-muted p-2 rounded">Grant 1000 TRP coins to user</p>
        </CardContent>
      </Card>
    </div>
  );
}

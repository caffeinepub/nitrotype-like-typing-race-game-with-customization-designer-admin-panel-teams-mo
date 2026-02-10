import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, CheckCircle, XCircle, Info } from 'lucide-react';
import { parseAdminCommand } from '../../lib/adminCommandParser';
import { useExecuteAssistantAction } from '../../hooks/useUpdateAssistant';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';
import { Season } from '../../backend';

export default function AdminUpdateAssistantPage() {
  const [command, setCommand] = useState('');
  const [parsedCommand, setParsedCommand] = useState<any>(null);
  const executeAction = useExecuteAssistantAction();
  const { identity } = useInternetIdentity();

  const handleParse = () => {
    const result = parseAdminCommand(command);
    setParsedCommand(result);
  };

  const handleExecute = async () => {
    if (!parsedCommand?.isValid || !identity) return;
    
    try {
      const adminPrincipal = identity.getPrincipal();

      // Map parsed command to backend action
      if (parsedCommand.action === 'setBalance') {
        const targetPrincipal = Principal.fromText(parsedCommand.params.user);
        const result = await executeAction.mutateAsync({
          __kind__: 'setUserBalance',
          setUserBalance: {
            targetUser: targetPrincipal,
            newBalance: BigInt(parsedCommand.params.amount),
            adminActor: adminPrincipal,
          },
        });

        if (result && result.__kind__ === 'success') {
          toast.success(result.success);
        }
      } else if (parsedCommand.action === 'banUser') {
        const targetPrincipal = Principal.fromText(parsedCommand.params.user);
        const result = await executeAction.mutateAsync({
          __kind__: 'banUser',
          banUser: {
            userId: targetPrincipal,
            adminActor: adminPrincipal,
          },
        });

        if (result && result.__kind__ === 'success') {
          toast.success(result.success);
        }
      } else if (parsedCommand.action === 'unbanUser') {
        const targetPrincipal = Principal.fromText(parsedCommand.params.user);
        const result = await executeAction.mutateAsync({
          __kind__: 'unbanUser',
          unbanUser: {
            targetUser: targetPrincipal,
            adminActor: adminPrincipal,
          },
        });

        if (result && result.__kind__ === 'success') {
          toast.success(result.success);
        }
      } else if (parsedCommand.action === 'setSeason') {
        const seasonMap: Record<string, Season> = {
          winter: Season.winter,
          spring: Season.spring,
          summer: Season.summer,
          autumn: Season.autumn,
          fall: Season.autumn,
        };

        const season = seasonMap[parsedCommand.params.season.toLowerCase()];
        if (!season) {
          toast.error('Invalid season. Use: winter, spring, summer, autumn/fall');
          return;
        }

        const result = await executeAction.mutateAsync({
          __kind__: 'changeSeason',
          changeSeason: {
            desiredSeason: season,
            adminActor: adminPrincipal,
          },
        });

        if (result && result.__kind__ === 'success') {
          toast.success(result.success);
        }
      } else {
        toast.info('Command parsed but execution not yet implemented');
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
        <Sparkles className="h-8 w-8 text-accent" />
        <div>
          <h1 className="text-3xl font-bold">Update Assistant</h1>
          <p className="text-muted-foreground">Use natural language to make updates</p>
        </div>
      </div>

      <Alert className="border-accent/30 bg-accent/5">
        <Info className="h-4 w-4 text-accent" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold">Supported commands:</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• "Set balance to 10000 for user [principal-id]"</li>
              <li>• "Ban user [principal-id]"</li>
              <li>• "Unban user [principal-id]"</li>
              <li>• "Set season to winter/spring/summer/autumn"</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle>Command Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Try: Set balance to 10000 for user xxxxx-xxxxx-xxxxx-xxxxx-xxx"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            rows={4}
            className="font-mono"
          />
          <Button onClick={handleParse} disabled={!command.trim()} className="bg-accent hover:bg-accent/90">
            Parse Command
          </Button>
        </CardContent>
      </Card>

      {parsedCommand && (
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {parsedCommand.isValid ? (
                <CheckCircle className="h-5 w-5 text-accent" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              {parsedCommand.isValid ? 'Command Parsed' : 'Parse Error'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {parsedCommand.isValid ? (
              <>
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <h4 className="font-semibold mb-2">Parsed Action</h4>
                  <pre className="text-sm text-muted-foreground overflow-x-auto">
                    {JSON.stringify(parsedCommand, null, 2)}
                  </pre>
                </div>
                <Button
                  onClick={handleExecute}
                  disabled={executeAction.isPending}
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  {executeAction.isPending ? 'Executing...' : 'Execute Command'}
                </Button>
              </>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{parsedCommand.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

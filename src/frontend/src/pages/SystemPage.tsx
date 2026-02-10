import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Snowflake, Sun, Flower, Leaf, Gift, Plus, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetHolidays, useAddHoliday, useRemoveHoliday } from '../hooks/useHolidays';
import { useGetSeason, useSetSeason } from '../hooks/useSeason';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Season } from '../backend';

export default function SystemPage() {
  const { data: holidays, isLoading } = useGetHolidays();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: currentSeason, isLoading: seasonLoading } = useGetSeason();
  const setSeason = useSetSeason();
  const addHoliday = useAddHoliday();
  const removeHoliday = useRemoveHoliday();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');

  // User is admin if they have a profile
  const isAdmin = !!userProfile;

  const handleAddHoliday = async () => {
    if (!holidayName.trim() || !holidayDate.trim()) {
      toast.error('Please enter both name and date');
      return;
    }

    try {
      await addHoliday.mutateAsync({ name: holidayName, date: holidayDate });
      toast.success(`Holiday "${holidayName}" added successfully!`);
      setHolidayName('');
      setHolidayDate('');
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to add holiday');
    }
  };

  const handleRemoveHoliday = async (holidayId: bigint, name: string) => {
    try {
      await removeHoliday.mutateAsync(holidayId);
      toast.success(`Holiday "${name}" removed successfully!`);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to remove holiday');
    }
  };

  const handleSeasonChange = async () => {
    if (!isAdmin) {
      toast.error('Only admins can change the season');
      return;
    }

    if (!selectedSeason) {
      toast.error('Please select a season');
      return;
    }

    try {
      const seasonMap: Record<string, Season> = {
        winter: Season.winter,
        spring: Season.spring,
        summer: Season.summer,
        autumn: Season.autumn,
      };

      await setSeason.mutateAsync(seasonMap[selectedSeason]);
      toast.success(`Season changed to ${selectedSeason}!`);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to change season');
    }
  };

  const getCurrentSeasonName = () => {
    if (!currentSeason) return 'Summer';
    switch (currentSeason) {
      case Season.winter: return 'Winter';
      case Season.spring: return 'Spring';
      case Season.summer: return 'Summer';
      case Season.autumn: return 'Autumn';
      default: return 'Summer';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-accent" />
        <div>
          <h1 className="text-3xl font-bold">System</h1>
          <p className="text-muted-foreground">Seasonal themes and special events</p>
        </div>
      </div>

      {/* Season Control */}
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-accent" />
            Active Season
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {seasonLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2 border-accent text-accent">
                  {getCurrentSeasonName()}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Current active season across the platform
                </p>
              </div>

              {isAdmin && (
                <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="season-select">Change Season</Label>
                    <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                      <SelectTrigger id="season-select">
                        <SelectValue placeholder="Select a season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="winter">
                          <div className="flex items-center gap-2">
                            <Snowflake className="h-4 w-4" />
                            Winter
                          </div>
                        </SelectItem>
                        <SelectItem value="spring">
                          <div className="flex items-center gap-2">
                            <Flower className="h-4 w-4" />
                            Spring
                          </div>
                        </SelectItem>
                        <SelectItem value="summer">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Summer
                          </div>
                        </SelectItem>
                        <SelectItem value="autumn">
                          <div className="flex items-center gap-2">
                            <Leaf className="h-4 w-4" />
                            Autumn
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleSeasonChange}
                    disabled={setSeason.isPending || !selectedSeason}
                    className="bg-accent hover:bg-accent/90"
                  >
                    {setSeason.isPending ? 'Changing...' : 'Change Season'}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="winter" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="winter">
            <Snowflake className="h-4 w-4 mr-2" />
            Winter
          </TabsTrigger>
          <TabsTrigger value="spring">
            <Flower className="h-4 w-4 mr-2" />
            Spring
          </TabsTrigger>
          <TabsTrigger value="summer">
            <Sun className="h-4 w-4 mr-2" />
            Summer
          </TabsTrigger>
          <TabsTrigger value="autumn">
            <Leaf className="h-4 w-4 mr-2" />
            Autumn
          </TabsTrigger>
          <TabsTrigger value="holidays">
            <Gift className="h-4 w-4 mr-2" />
            Holidays
          </TabsTrigger>
        </TabsList>

        <TabsContent value="winter">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Snowflake className="h-5 w-5 text-accent" />
                Winter Season
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Experience the winter season with snow-themed tracks and special winter events.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <h4 className="font-semibold mb-2">Winter Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Snow-covered race tracks</li>
                      <li>• Winter-themed cars and trails</li>
                      <li>• Special holiday events</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <h4 className="font-semibold mb-2">Active Period</h4>
                    <p className="text-sm text-muted-foreground">
                      December - February
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spring">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flower className="h-5 w-5 text-accent" />
                Spring Season
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Celebrate spring with blooming flowers and fresh racing challenges.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <h4 className="font-semibold mb-2">Spring Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Flower-themed decorations</li>
                      <li>• Spring racing events</li>
                      <li>• Seasonal rewards</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <h4 className="font-semibold mb-2">Active Period</h4>
                    <p className="text-sm text-muted-foreground">
                      March - May
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summer">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-accent" />
                Summer Season
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Race under the summer sun with beach-themed tracks and hot competitions.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <h4 className="font-semibold mb-2">Summer Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Beach and tropical themes</li>
                      <li>• Summer racing tournaments</li>
                      <li>• Exclusive summer items</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <h4 className="font-semibold mb-2">Active Period</h4>
                    <p className="text-sm text-muted-foreground">
                      June - August
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="autumn">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-accent" />
                Autumn Season
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Enjoy the autumn season with falling leaves and harvest-themed events.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <h4 className="font-semibold mb-2">Autumn Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Falling leaves decorations</li>
                      <li>• Harvest racing events</li>
                      <li>• Seasonal rewards</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <h4 className="font-semibold mb-2">Active Period</h4>
                    <p className="text-sm text-muted-foreground">
                      September - November
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holidays">
          <Card className="border-accent/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-accent" />
                  Secret Holidays
                </CardTitle>
                {isAdmin && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-accent hover:bg-accent/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Holiday
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Secret Holiday</DialogTitle>
                        <DialogDescription>
                          Create a new secret holiday event for the community.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="holidayName">Holiday Name</Label>
                          <Input
                            id="holidayName"
                            placeholder="e.g., Typing Day"
                            value={holidayName}
                            onChange={(e) => setHolidayName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="holidayDate">Date</Label>
                          <Input
                            id="holidayDate"
                            placeholder="e.g., March 15"
                            value={holidayDate}
                            onChange={(e) => setHolidayDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddHoliday} disabled={addHoliday.isPending} className="bg-accent hover:bg-accent/90">
                          {addHoliday.isPending ? 'Adding...' : 'Add Holiday'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : holidays && holidays.length > 0 ? (
                <div className="space-y-3">
                  {holidays.map((holiday) => (
                    <div
                      key={holiday.id.toString()}
                      className="flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent/20 hover:bg-accent/15 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Gift className="h-5 w-5 text-accent" />
                        <div>
                          <div className="font-medium">{holiday.name}</div>
                          <div className="text-sm text-muted-foreground">{holiday.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {holiday.enabled && (
                          <Badge variant="outline" className="text-accent border-accent">
                            Active
                          </Badge>
                        )}
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveHoliday(holiday.id, holiday.name)}
                            disabled={removeHoliday.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No secret holidays yet.</p>
                  {isAdmin && <p className="text-sm mt-2">Add your first holiday to get started!</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

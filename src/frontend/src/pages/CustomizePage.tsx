import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Car, Award, Sparkles, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetCarCatalog } from '../hooks/useQueries';
import { useCurrentUserInventory } from '../hooks/useInventory';
import { useActiveCar } from '../hooks/useActiveCar';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { CarColor } from '../backend';
import { Skeleton } from '@/components/ui/skeleton';

const COLOR_DISPLAY: Record<CarColor, { label: string; hex: string }> = {
  [CarColor.blue]: { label: 'Blue', hex: '#3b82f6' },
  [CarColor.black]: { label: 'Black', hex: '#000000' },
  [CarColor.red]: { label: 'Red', hex: '#ef4444' },
  [CarColor.yellow]: { label: 'Yellow', hex: '#eab308' },
  [CarColor.white]: { label: 'White', hex: '#ffffff' },
};

export default function CustomizePage() {
  const { identity } = useInternetIdentity();
  const { data: catalog, isLoading: catalogLoading } = useGetCarCatalog();
  const { data: inventory, isLoading: inventoryLoading } = useCurrentUserInventory();
  const { activeCarId, setActiveCar } = useActiveCar();

  const isLoading = catalogLoading || inventoryLoading;

  // Get owned cars with their catalog data
  const ownedCars = inventory?.cars
    .map(carId => catalog?.find(car => car.id === carId))
    .filter(Boolean) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Palette className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Customize</h1>
      </div>

      <Tabs defaultValue="cars" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cars">Cars</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="trails">Trails</TabsTrigger>
          <TabsTrigger value="titles">Titles</TabsTrigger>
        </TabsList>

        <TabsContent value="cars" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Your Cars
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!identity ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Please log in to view your cars.</p>
                </div>
              ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : ownedCars.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No cars owned yet. Visit the shop to purchase your first car!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ownedCars.map(car => {
                    if (!car) return null;
                    const colorInfo = COLOR_DISPLAY[car.color];
                    const isActive = activeCarId === car.id;

                    return (
                      <Card 
                        key={car.id.toString()} 
                        className={`relative overflow-hidden transition-all ${
                          isActive ? 'ring-2 ring-primary shadow-lg' : ''
                        }`}
                      >
                        <CardContent className="pt-6 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{car.name}</h3>
                              <p className="text-sm text-muted-foreground">{colorInfo.label}</p>
                            </div>
                            {isActive && (
                              <Badge variant="outline" className="text-chart-1 border-chart-1">
                                <Check className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>

                          <div 
                            className="h-20 rounded-lg border-2"
                            style={{ 
                              backgroundColor: colorInfo.hex,
                              borderColor: car.color === CarColor.white ? '#e5e7eb' : colorInfo.hex
                            }}
                          />

                          <Button
                            onClick={() => setActiveCar(car.id)}
                            disabled={isActive}
                            variant={isActive ? 'outline' : 'default'}
                            className="w-full"
                          >
                            {isActive ? 'Currently Active' : 'Set as Active'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Banners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No banners owned yet. Visit the shop to unlock banners!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Your Trails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No trails owned yet. Visit the shop to unlock trails!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="titles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Titles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No titles owned yet. Visit the shop to unlock titles!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

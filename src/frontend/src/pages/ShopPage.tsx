import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingBag, Coins, Check, AlertCircle } from 'lucide-react';
import { useGetCarCatalog, useBuyCar, useGetCallerUserProfile } from '../hooks/useQueries';
import { useCurrentUserInventory } from '../hooks/useInventory';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { CarColor } from '../backend';
import { Skeleton } from '@/components/ui/skeleton';
import CarViewer3D from '../components/race/CarViewer3D';

const COLOR_DISPLAY: Record<CarColor, { label: string; hex: string }> = {
  [CarColor.blue]: { label: 'Blue', hex: '#3b82f6' },
  [CarColor.black]: { label: 'Black', hex: '#000000' },
  [CarColor.red]: { label: 'Red', hex: '#ef4444' },
  [CarColor.yellow]: { label: 'Yellow', hex: '#eab308' },
  [CarColor.white]: { label: 'White', hex: '#ffffff' },
};

export default function ShopPage() {
  const { identity } = useInternetIdentity();
  const { data: catalog, isLoading: catalogLoading } = useGetCarCatalog();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: inventory, isLoading: inventoryLoading } = useCurrentUserInventory();
  const buyCar = useBuyCar();

  const [selectedColors, setSelectedColors] = useState<Record<string, CarColor>>({});
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  // Group cars by model name
  const carsByModel = catalog?.reduce((acc, car) => {
    if (!acc[car.name]) {
      acc[car.name] = [];
    }
    acc[car.name].push(car);
    return acc;
  }, {} as Record<string, typeof catalog>) || {};

  // Initialize default selected colors for each model (first available color)
  useEffect(() => {
    if (catalog && Object.keys(selectedColors).length === 0) {
      const defaultColors: Record<string, CarColor> = {};
      Object.entries(carsByModel).forEach(([modelName, variants]) => {
        if (variants.length > 0) {
          defaultColors[modelName] = variants[0].color;
        }
      });
      setSelectedColors(defaultColors);
    }
  }, [catalog, carsByModel]);

  if (!identity) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Shop</h1>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please log in to access the shop.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isLoading = catalogLoading || profileLoading || inventoryLoading;

  const handlePurchase = async (modelName: string) => {
    setPurchaseError(null);
    const selectedColor = selectedColors[modelName];
    if (!selectedColor) {
      setPurchaseError('Please select a color');
      return;
    }

    const variants = carsByModel[modelName];
    const selectedVariant = variants.find(v => v.color === selectedColor);
    if (!selectedVariant) return;

    try {
      await buyCar.mutateAsync(selectedVariant.id);
    } catch (error: any) {
      setPurchaseError(error.message || 'Purchase failed');
    }
  };

  const isOwned = (carId: bigint) => {
    return inventory?.cars.some(id => id === carId) || false;
  };

  const getSelectedVariant = (modelName: string) => {
    const selectedColor = selectedColors[modelName];
    if (!selectedColor) return null;
    return carsByModel[modelName].find(v => v.color === selectedColor);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Shop</h1>
        </div>
        
        {profile && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
            <Coins className="h-5 w-5 text-primary" />
            <span className="font-semibold">{Number(profile.balance).toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">TRP Coins</span>
          </div>
        )}
      </div>

      {purchaseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{purchaseError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Supercars</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : Object.keys(carsByModel).length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No cars available yet. Check back soon!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(carsByModel).map(([modelName, variants]) => {
                const basePrice = variants[0].price;
                const selectedVariant = getSelectedVariant(modelName);
                const variantOwned = selectedVariant ? isOwned(selectedVariant.id) : false;
                const canAfford = profile ? profile.balance >= basePrice : false;

                return (
                  <Card key={modelName} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{modelName}</span>
                        {variantOwned && (
                          <Badge variant="outline" className="text-chart-1 border-chart-1">
                            <Check className="h-3 w-3 mr-1" />
                            Owned
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Coins className="h-4 w-4" />
                        {Number(basePrice).toLocaleString()} TRP Coins
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 3D Car Preview */}
                      <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-b from-background to-muted/30 border">
                        {selectedColors[modelName] && (
                          <CarViewer3D 
                            modelName={modelName} 
                            color={selectedColors[modelName]} 
                          />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Select Color:</p>
                        <div className="flex gap-2 flex-wrap">
                          {variants.map(variant => {
                            const colorInfo = COLOR_DISPLAY[variant.color];
                            const isSelected = selectedColors[modelName] === variant.color;
                            const owned = isOwned(variant.id);
                            
                            return (
                              <button
                                key={variant.id.toString()}
                                onClick={() => setSelectedColors(prev => ({
                                  ...prev,
                                  [modelName]: variant.color
                                }))}
                                className={`relative w-12 h-12 rounded-lg border-2 transition-all ${
                                  isSelected 
                                    ? 'border-primary scale-110 shadow-lg' 
                                    : 'border-border hover:border-primary/50'
                                } cursor-pointer`}
                                style={{ backgroundColor: colorInfo.hex }}
                                title={`${colorInfo.label}${owned ? ' (Owned)' : ''}`}
                              >
                                {variant.color === CarColor.white && (
                                  <div className="absolute inset-0 border border-gray-300 rounded-lg" />
                                )}
                                {owned && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                                    <Check className="h-5 w-5 text-white" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <Button
                        onClick={() => handlePurchase(modelName)}
                        disabled={
                          !selectedColors[modelName] || 
                          variantOwned || 
                          !canAfford || 
                          buyCar.isPending
                        }
                        className="w-full"
                      >
                        {buyCar.isPending ? (
                          'Processing...'
                        ) : variantOwned ? (
                          'Already Owned'
                        ) : !canAfford ? (
                          'Insufficient Funds'
                        ) : !selectedColors[modelName] ? (
                          'Select a Color'
                        ) : (
                          'Purchase'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

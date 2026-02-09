import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

export default function ShopPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingBag className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Shop</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No items available yet. Check back soon for new cars, banners, trails, and more!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Car, Award, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CustomizePage() {
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
              <div className="text-center py-12 text-muted-foreground">
                <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No cars owned yet. Visit the shop to purchase your first car!</p>
              </div>
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

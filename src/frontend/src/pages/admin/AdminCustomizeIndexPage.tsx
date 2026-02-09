import { Link } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Car, Image, Sparkles, Zap, Award } from 'lucide-react';

export default function AdminCustomizeIndexPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Customization Management</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/customize/cars" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-chart-1" />
                Cars
              </CardTitle>
              <CardDescription>Manage car inventory</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/customize/templates" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-chart-2" />
                Templates
              </CardTitle>
              <CardDescription>Manage car templates</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/customize/banners" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-chart-3" />
                Banners
              </CardTitle>
              <CardDescription>Manage banner designs</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/customize/trails" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-chart-4" />
                Trails
              </CardTitle>
              <CardDescription>Manage trail effects</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/customize/nitros" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-chart-5" />
                Nitros
              </CardTitle>
              <CardDescription>Manage nitro effects</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/customize/titles" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Titles
              </CardTitle>
              <CardDescription>Manage player titles</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}

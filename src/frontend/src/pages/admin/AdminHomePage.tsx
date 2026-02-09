import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  FileText,
  Palette,
  DollarSign,
  MessageSquare,
  Users,
  Sparkles,
} from 'lucide-react';

export default function AdminHomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Manage all aspects of TypeRacer Pro</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/texts" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-chart-1" />
                Texts
              </CardTitle>
              <CardDescription>Manage race texts and categories</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/text-demo" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-chart-2" />
                Text Demo
              </CardTitle>
              <CardDescription>Test texts in practice mode</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/customize" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-chart-3" />
                Customization
              </CardTitle>
              <CardDescription>Manage cars, banners, trails, titles</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/economy" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-chart-4" />
                Economy Tools
              </CardTitle>
              <CardDescription>Manage prices and grant items</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/motd" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-chart-5" />
                MOTD
              </CardTitle>
              <CardDescription>Configure message of the day</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/management" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Admin Management
              </CardTitle>
              <CardDescription>Add or remove administrators</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/assistant" className="block col-span-full">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-chart-1" />
                Update Assistant
              </CardTitle>
              <CardDescription>
                Use natural language commands to make updates
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}

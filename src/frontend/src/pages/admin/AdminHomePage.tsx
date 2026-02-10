import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  FileText,
  Palette,
  DollarSign,
  MessageSquare,
  Users,
  Sparkles,
  ShieldOff,
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
          <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Texts
              </CardTitle>
              <CardDescription>Manage race texts and categories</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/text-demo" className="block">
          <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Text Demo
              </CardTitle>
              <CardDescription>Test texts in practice mode</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/customize" className="block">
          <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-accent" />
                Customization
              </CardTitle>
              <CardDescription>Manage cars, banners, trails, titles</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/economy" className="block">
          <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-accent" />
                Economy
              </CardTitle>
              <CardDescription>Manage TRP Coins and rewards</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/bans" className="block">
          <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldOff className="h-5 w-5 text-accent" />
                Ban Management
              </CardTitle>
              <CardDescription>Ban and unban users</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/motd" className="block">
          <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-accent" />
                MOTD
              </CardTitle>
              <CardDescription>Set message of the day</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/management" className="block">
          <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                Admin Management
              </CardTitle>
              <CardDescription>Manage admin roles</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/assistant" className="block">
          <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Update Assistant
              </CardTitle>
              <CardDescription>Natural language commands</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}

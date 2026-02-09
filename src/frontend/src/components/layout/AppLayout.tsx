import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from '../../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { generatedAssets } from '../../assets/generatedAssets';
import {
  Zap,
  Trophy,
  Users,
  ShoppingBag,
  Palette,
  User,
  Settings as SettingsIcon,
  LogOut,
  LogIn,
  Home,
  Calendar,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { SiCaffeine } from 'react-icons/si';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={generatedAssets.logo}
                alt="TypeRacer Pro"
                className="h-10 w-10 transition-transform group-hover:scale-110"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                TypeRacer Pro
              </span>
            </Link>

            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/race">
                    <Zap className="h-4 w-4 mr-2" />
                    Race
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/leaderboards">
                    <Trophy className="h-4 w-4 mr-2" />
                    Leaderboards
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/teams">
                    <Users className="h-4 w-4 mr-2" />
                    Teams
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/shop">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Shop
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/customize">
                    <Palette className="h-4 w-4 mr-2" />
                    Customize
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/system">
                    <Calendar className="h-4 w-4 mr-2" />
                    System
                  </Link>
                </Button>
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin">
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
              </nav>
            )}

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/race/history" className="cursor-pointer">
                        <Trophy className="h-4 w-4 mr-2" />
                        Race History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleAuth} className="cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={handleAuth} disabled={isLoggingIn} size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()}. Built with <SiCaffeine className="inline h-4 w-4 text-chart-1" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Type faster. Race smarter.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

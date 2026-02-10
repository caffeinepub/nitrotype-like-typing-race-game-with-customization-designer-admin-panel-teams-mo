import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useGetSeason } from '../../hooks/useSeason';
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
  Shield,
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
import { Season } from '../../backend';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: season } = useGetSeason();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  // Show admin link if user is authenticated and has a saved profile
  const showAdminLink = isAuthenticated && !profileLoading && !!userProfile;

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

  // Get seasonal background
  const getSeasonalBackground = () => {
    if (!season) return '';
    
    switch (season) {
      case Season.winter:
        return `url(${generatedAssets.seasonWinterBg})`;
      case Season.spring:
        return `url(${generatedAssets.seasonSpringBg})`;
      case Season.summer:
        return `url(${generatedAssets.seasonSummerBg})`;
      case Season.autumn:
        return `url(${generatedAssets.seasonFallBg})`;
      default:
        return '';
    }
  };

  const seasonalBg = getSeasonalBackground();

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Seasonal background overlay */}
      {seasonalBg && (
        <div 
          className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{
            backgroundImage: seasonalBg,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      <header className="border-b border-accent/30 bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-accent/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={generatedAssets.logo}
                alt="TypeRacer Pro"
                className="h-10 w-10 transition-transform group-hover:scale-110"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-accent via-accent to-accent/80 bg-clip-text text-transparent">
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
                {showAdminLink && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin">
                      <Shield className="h-4 w-4 mr-2" />
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

      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">{children}</main>

      <footer className="border-t border-accent/30 bg-card/80 backdrop-blur-md mt-auto relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()}. Built with <SiCaffeine className="inline h-4 w-4 text-accent" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
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

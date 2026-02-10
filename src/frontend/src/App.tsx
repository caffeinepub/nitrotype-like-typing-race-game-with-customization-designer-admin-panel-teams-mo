import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import RaceLobbyPage from './pages/RaceLobbyPage';
import RacePage from './pages/RacePage';
import RaceResultsPage from './pages/RaceResultsPage';
import RaceHistoryPage from './pages/RaceHistoryPage';
import ProfilePage from './pages/ProfilePage';
import CustomizePage from './pages/CustomizePage';
import ShopPage from './pages/ShopPage';
import TeamsPage from './pages/TeamsPage';
import TeamDetailsPage from './pages/TeamDetailsPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import SystemPage from './pages/SystemPage';
import AdminHomePage from './pages/admin/AdminHomePage';
import AdminTextsPage from './pages/admin/AdminTextsPage';
import TextDemoPage from './pages/admin/TextDemoPage';
import AdminCustomizeIndexPage from './pages/admin/AdminCustomizeIndexPage';
import AdminCarsPage from './pages/admin/AdminCarsPage';
import AdminCarTemplatesPage from './pages/admin/AdminCarTemplatesPage';
import AdminBannersPage from './pages/admin/AdminBannersPage';
import AdminTrailsPage from './pages/admin/AdminTrailsPage';
import AdminNitrosPage from './pages/admin/AdminNitrosPage';
import AdminTitlesPage from './pages/admin/AdminTitlesPage';
import AdminEconomyToolsPage from './pages/admin/AdminEconomyToolsPage';
import AdminMotdPage from './pages/admin/AdminMotdPage';
import AdminManagementPage from './pages/admin/AdminManagementPage';
import AdminUpdateAssistantPage from './pages/admin/AdminUpdateAssistantPage';
import AdminBanManagementPage from './pages/admin/AdminBanManagementPage';
import AdminGuard from './components/admin/AdminGuard';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const raceLobbyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/race',
  component: RaceLobbyPage,
});

const raceActiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/race/active',
  component: RacePage,
});

const raceResultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/race/results',
  component: RaceResultsPage,
});

const raceHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/race/history',
  component: RaceHistoryPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const customizeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customize',
  component: CustomizePage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: ShopPage,
});

const teamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teams',
  component: TeamsPage,
});

const teamDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teams/$teamId',
  component: TeamDetailsPage,
});

const leaderboardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboards',
  component: LeaderboardsPage,
});

const systemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/system',
  component: SystemPage,
});

const adminHomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminGuard>
      <AdminHomePage />
    </AdminGuard>
  ),
});

const adminTextsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/texts',
  component: () => (
    <AdminGuard>
      <AdminTextsPage />
    </AdminGuard>
  ),
});

const adminTextDemoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/text-demo',
  component: () => (
    <AdminGuard>
      <TextDemoPage />
    </AdminGuard>
  ),
});

const adminCustomizeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/customize',
  component: () => (
    <AdminGuard>
      <AdminCustomizeIndexPage />
    </AdminGuard>
  ),
});

const adminCarsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/customize/cars',
  component: () => (
    <AdminGuard>
      <AdminCarsPage />
    </AdminGuard>
  ),
});

const adminCarTemplatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/customize/templates',
  component: () => (
    <AdminGuard>
      <AdminCarTemplatesPage />
    </AdminGuard>
  ),
});

const adminBannersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/customize/banners',
  component: () => (
    <AdminGuard>
      <AdminBannersPage />
    </AdminGuard>
  ),
});

const adminTrailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/customize/trails',
  component: () => (
    <AdminGuard>
      <AdminTrailsPage />
    </AdminGuard>
  ),
});

const adminNitrosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/customize/nitros',
  component: () => (
    <AdminGuard>
      <AdminNitrosPage />
    </AdminGuard>
  ),
});

const adminTitlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/customize/titles',
  component: () => (
    <AdminGuard>
      <AdminTitlesPage />
    </AdminGuard>
  ),
});

const adminEconomyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/economy',
  component: () => (
    <AdminGuard>
      <AdminEconomyToolsPage />
    </AdminGuard>
  ),
});

const adminMotdRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/motd',
  component: () => (
    <AdminGuard>
      <AdminMotdPage />
    </AdminGuard>
  ),
});

const adminManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/management',
  component: () => (
    <AdminGuard>
      <AdminManagementPage />
    </AdminGuard>
  ),
});

const adminAssistantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/assistant',
  component: () => (
    <AdminGuard>
      <AdminUpdateAssistantPage />
    </AdminGuard>
  ),
});

const adminBanManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/bans',
  component: () => (
    <AdminGuard>
      <AdminBanManagementPage />
    </AdminGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  raceLobbyRoute,
  raceActiveRoute,
  raceResultsRoute,
  raceHistoryRoute,
  profileRoute,
  customizeRoute,
  shopRoute,
  teamsRoute,
  teamDetailsRoute,
  leaderboardsRoute,
  systemRoute,
  adminHomeRoute,
  adminTextsRoute,
  adminTextDemoRoute,
  adminCustomizeRoute,
  adminCarsRoute,
  adminCarTemplatesRoute,
  adminBannersRoute,
  adminTrailsRoute,
  adminNitrosRoute,
  adminTitlesRoute,
  adminEconomyRoute,
  adminMotdRoute,
  adminManagementRoute,
  adminAssistantRoute,
  adminBanManagementRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      {isAuthenticated && <ProfileSetupDialog />}
      <Toaster />
    </ThemeProvider>
  );
}

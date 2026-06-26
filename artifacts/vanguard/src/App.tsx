import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/AppLayout";
import NotFound from "@/pages/not-found";

import HomePage from "@/pages/HomePage";
import FeedPage from "@/pages/FeedPage";
import ProfilePage from "@/pages/ProfilePage";

import MarketplacePage from "@/pages/MarketplacePage";
import ProductPage from "@/pages/ProductPage";
import CreateListingPage from "@/pages/CreateListingPage";

import ServicesPage from "@/pages/ServicesPage";
import ServicePage from "@/pages/ServicePage";

import JobsPage from "@/pages/JobsPage";
import JobPage from "@/pages/JobPage";

import CoursesPage from "@/pages/CoursesPage";
import CoursePage from "@/pages/CoursePage";

import WalletPage from "@/pages/WalletPage";
import EscrowPage from "@/pages/EscrowPage";

import ChatPage from "@/pages/ChatPage";
import NotificationsPage from "@/pages/NotificationsPage";

import CompanyPage from "@/pages/CompanyPage";
import VerificationPage from "@/pages/VerificationPage";

import SettingsPage from "@/pages/SettingsPage";
import AdminPage from "@/pages/AdminPage";
import AIPage from "@/pages/AIPage";
import SearchPage from "@/pages/SearchPage";

import CommunitiesPage from "@/pages/CommunitiesPage";
import DeliveryPage from "@/pages/DeliveryPage";
import GuardianPage from "@/pages/GuardianPage";
import InvestmentPage from "@/pages/InvestmentPage";
import RecommendationsPage from "@/pages/RecommendationsPage";
import OpportunitiesPage from "@/pages/opportunitiesPage";
import { AuthProvider } from "@/context/AuthContext";

import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});

function AuthRoutes() {
  return (
    <Switch>
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register" component={RegisterPage} />
      <Route component={LoginPage} />
    </Switch>
  );
}

function Router() {
  return (
    <Switch>
      {/* Auth — no AppLayout wrapper */}
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register" component={RegisterPage} />

      {/* Main app — wrapped in AppLayout */}
      <Route>
        {() => (
          <AppLayout>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/feed" component={FeedPage} />

              <Route path="/profile" component={ProfilePage} />
              <Route path="/profile/:id" component={ProfilePage} />

              <Route path="/create-listing" component={CreateListingPage} />
              <Route path="/marketplace" component={MarketplacePage} />
              <Route path="/marketplace/:id" component={ProductPage} />

              <Route path="/services" component={ServicesPage} />
              <Route path="/services/:id" component={ServicePage} />

              <Route path="/jobs" component={JobsPage} />
              <Route path="/jobs/:id" component={JobPage} />

              <Route path="/courses" component={CoursesPage} />
              <Route path="/courses/:id" component={CoursePage} />

              <Route path="/wallet" component={WalletPage} />
              <Route path="/escrow" component={EscrowPage} />

              <Route path="/chat" component={ChatPage} />
              <Route path="/chat/:id" component={ChatPage} />

              <Route path="/notifications" component={NotificationsPage} />

              <Route path="/company" component={CompanyPage} />
              <Route path="/company/:id" component={CompanyPage} />

              <Route path="/verification" component={VerificationPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route path="/admin" component={AdminPage} />
              <Route path="/ai" component={AIPage} />
              <Route path="/search" component={SearchPage} />

              <Route path="/communities" component={CommunitiesPage} />
              <Route path="/delivery" component={DeliveryPage} />
              <Route path="/guardian" component={GuardianPage} />
              <Route path="/invest" component={InvestmentPage} />
              <Route path="/opportunities" component={OpportunitiesPage} />
              <Route path="/recommendations" component={RecommendationsPage} />

              <Route component={NotFound} />
            </Switch>
          </AppLayout>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

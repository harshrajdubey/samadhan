import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { StoreProvider } from '@/lib/store';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

// Import Pages
import Landing from '@/pages/Landing';
import StudentLayout from '@/pages/student/StudentLayout';
import StudentDashboard from '@/pages/student/StudentDashboard';
import NewComplaint from '@/pages/student/NewComplaint';
import ComplaintsList from '@/pages/student/ComplaintsList';
import ComplaintDetail from '@/pages/student/ComplaintDetail';
import TrackComplaint from '@/pages/student/TrackComplaint';
import Notifications from '@/pages/student/Notifications';

import AuthorityLayout from '@/pages/authority/AuthorityLayout';
import AuthorityDashboard from '@/pages/authority/AuthorityDashboard';
import AuthorityComplaints from '@/pages/authority/AuthorityComplaints';
import AuthorityComplaintDetail from '@/pages/authority/AuthorityComplaintDetail';
import Analytics from '@/pages/authority/Analytics';
import Officers from '@/pages/authority/Officers';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />

      {/* Student Routes */}
      <Route path="/student/new">
        <StudentLayout><NewComplaint /></StudentLayout>
      </Route>
      <Route path="/student/complaints/:id">
        <StudentLayout><ComplaintDetail /></StudentLayout>
      </Route>
      <Route path="/student/complaints">
        <StudentLayout><ComplaintsList /></StudentLayout>
      </Route>
      <Route path="/student/track">
        <StudentLayout><TrackComplaint /></StudentLayout>
      </Route>
      <Route path="/student/notifications">
        <StudentLayout><Notifications /></StudentLayout>
      </Route>
      <Route path="/student">
        <StudentLayout><StudentDashboard /></StudentLayout>
      </Route>

      {/* Authority Routes */}
      <Route path="/authority/complaints/:id">
        <AuthorityLayout><AuthorityComplaintDetail /></AuthorityLayout>
      </Route>
      <Route path="/authority/complaints">
        <AuthorityLayout><AuthorityComplaints /></AuthorityLayout>
      </Route>
      <Route path="/authority/analytics">
        <AuthorityLayout><Analytics /></AuthorityLayout>
      </Route>
      <Route path="/authority/officers">
        <AuthorityLayout><Officers /></AuthorityLayout>
      </Route>
      <Route path="/authority">
        <AuthorityLayout><AuthorityDashboard /></AuthorityLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <TooltipProvider>
          <WouterRouter base={baseUrl}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;


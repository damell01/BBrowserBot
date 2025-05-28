import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LeadsProvider } from './context/LeadsContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CustomersPage from './pages/CustomersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminBillingPage from './pages/AdminBillingPage';
import UsersManagementPage from './pages/UsersManagementPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import PixelSetupPage from './pages/PixelSetupPage';
import LegalBestPracticesPage from './pages/LegalBestPracticesPage';
import CrmIntegrationPage from './pages/CrmIntegrationPage';
import SupportPage from './pages/SupportPage';
import BillingPage from './pages/BillingPage';
import PaywallPage from './pages/PaywallPage';
import RoiCalculatorPage from './pages/RoiCalculatorPage';
import WebsiteHitsPage from './pages/WebsiteHitsPage';
import AdminLeadsPage from './pages/AdminLeadsPage';
import NotFoundPage from './pages/NotFoundPage';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const handleRouteChange = () => {
      sessionStorage.setItem('lastPath', window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <AuthProvider>
      <LeadsProvider>
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid #3B82F6',
              },
              duration: 3000,
            }}
          />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/paywall" element={<PaywallPage />} />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/customers" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <CustomersPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/leads" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLeadsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AnalyticsPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin/billing" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminBillingPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <UsersManagementPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin/hits" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <WebsiteHitsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Customer Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerDashboardPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/pixel-setup" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <PixelSetupPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/legal-best-practices" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <LegalBestPracticesPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/crm-integration" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <CrmIntegrationPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/support" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <SupportPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/billing" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <BillingPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/hits" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <WebsiteHitsPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/roi-calculator" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <RoiCalculatorPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/" element={<Navigate to="/login\" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </LeadsProvider>
    </AuthProvider>
  );
}

export default App;
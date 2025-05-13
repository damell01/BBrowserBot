import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LeadsProvider } from './context/LeadsContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import PixelSetupPage from './pages/PixelSetupPage';
import LegalBestPracticesPage from './pages/LegalBestPracticesPage';
import CrmIntegrationPage from './pages/CrmIntegrationPage';
import TrainingPage from './pages/TrainingPage';
import SupportPage from './pages/SupportPage';
import BillingPage from './pages/BillingPage';
import RoiCalculatorPage from './pages/RoiCalculatorPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
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
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboardPage />
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
              path="/training" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <TrainingPage />
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
              path="/roi-calculator" 
              element={
                <ProtectedRoute requiredRole="customer">
                  <RoiCalculatorPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </LeadsProvider>
    </AuthProvider>
  );
}

export default App;
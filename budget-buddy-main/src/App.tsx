import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { AppLayout } from './components/layout/AppLayout'
import { Toaster } from './components/ui/sonner'

// Import page components - we'll create these from routes
import HomePage from './pages/Index'
import LoginPage from './pages/Login'
import OnboardingPage from './pages/Onboarding'
import ExpensesPage from './pages/Expenses'
import IncomePage from './pages/Income'
import BudgetsPage from './pages/Budgets'
import SavingsPage from './pages/Savings'
import ReportsPage from './pages/Reports'
import PredictionsPage from './pages/Predictions'
import SettingsPage from './pages/Settings'
import PremiumPage from './pages/Premium'
import PricingPage from './pages/Pricing'
import ResetPasswordPage from './pages/ResetPassword'
import HealthPage from './pages/Health'
import AdminSubscriptionsPage from './pages/AdminSubscriptions'

const queryClient = new QueryClient()

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Public Only Route wrapper (redirects to home if logged in)
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }
  
  if (user) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <SubscriptionProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                } />
                
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/health" element={<HealthPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                
                {/* Protected routes with AppLayout */}
                <Route element={<AppLayout />}>
                  <Route path="/" element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/onboarding" element={
                    <ProtectedRoute>
                      <OnboardingPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/expenses" element={
                    <ProtectedRoute>
                      <ExpensesPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/income" element={
                    <ProtectedRoute>
                      <IncomePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/budgets" element={
                    <ProtectedRoute>
                      <BudgetsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/savings" element={
                    <ProtectedRoute>
                      <SavingsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <ReportsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/predictions" element={
                    <ProtectedRoute>
                      <PredictionsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/premium" element={
                    <ProtectedRoute>
                      <PremiumPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin-subscriptions" element={
                    <ProtectedRoute>
                      <AdminSubscriptionsPage />
                    </ProtectedRoute>
                  } />
                </Route>
                
                {/* 404 route */}
                <Route path="*" element={
                  <div className="flex min-h-screen items-center justify-center bg-background px-4">
                    <div className="max-w-md text-center">
                      <h1 className="text-7xl font-bold text-foreground">404</h1>
                      <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        The page you're looking for doesn't exist or has been moved.
                      </p>
                      <div className="mt-6">
                        <a
                          href="/"
                          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          Go home
                        </a>
                      </div>
                    </div>
                  </div>
                } />
              </Routes>
              <Toaster />
            </SubscriptionProvider>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

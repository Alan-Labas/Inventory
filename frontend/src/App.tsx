import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext.tsx'
import { ProtectedRoute } from './auth/ProtectedRoute.tsx'
import { ThemeProvider } from './theme/ThemeContext.tsx'
import { AppLayout } from './components/AppLayout.tsx'
import { DashboardPage } from './pages/DashboardPage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { PlaceholderPage } from './pages/PlaceholderPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'

// Logged-in users who open /login or /register go straight to the app.
function PublicOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/" replace /> : children
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
            <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/family" element={<PlaceholderPage title="Family" />} />
                <Route path="/calendar" element={<PlaceholderPage title="Calendar" />} />
                <Route path="/tasks" element={<PlaceholderPage title="Tasks" />} />
                <Route path="/notes" element={<PlaceholderPage title="Notes" />} />
                <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

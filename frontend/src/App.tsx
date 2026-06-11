import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext.tsx'
import { ProtectedRoute } from './auth/ProtectedRoute.tsx'
import { ThemeProvider } from './theme/ThemeContext.tsx'
import { AppLayout } from './components/AppLayout.tsx'
import { DashboardPage } from './pages/DashboardPage.tsx'
import { FamilyPage } from './pages/Family.tsx'
import { ItemsPage } from './pages/Items.tsx'
import { PetsPage} from "./pages/PetsPage.tsx";
import { LoginPage } from './pages/LoginPage.tsx'
import { PlaceholderPage } from './pages/PlaceholderPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import {SettingsPage} from "./pages/SettingsPage.tsx";

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
                <Route path="/items" element={<ItemsPage />} />
                <Route path="/family" element={<FamilyPage />} />
                <Route path="/calendar" element={<PlaceholderPage title="Calendar" />} />
                <Route path="/tasks" element={<PlaceholderPage title="Tasks" />} />
                <Route path="/notes" element={<PlaceholderPage title="Notes" />} />
                <Route path="/pets" element={<PetsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

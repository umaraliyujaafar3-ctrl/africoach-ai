import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import Home from '@/pages/Home'
import Signup from '@/pages/auth/Signup'
import Login from '@/pages/auth/Login'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import Onboarding from '@/pages/onboarding/Onboarding'
import NotFound from '@/pages/NotFound'
import AppLayout from '@/layouts/AppLayout'
import Dashboard from '@/pages/dashboard/Dashboard'
import InterviewSetup from '@/pages/interview/Setup'
import InterviewSession from '@/pages/interview/Session'
import InterviewFeedback from '@/pages/interview/Feedback'
import CareerAssistant from '@/pages/career/CareerAssistant'
import History from '@/pages/history/History'
import Settings from '@/pages/settings/Settings'
import { useAuthStore } from '@/store/auth'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/onboarding" element={<Onboarding />} />

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interview/setup" element={<InterviewSetup />} />
        <Route path="/interview/session" element={<InterviewSession />} />
        <Route path="/interview/feedback/:sessionId" element={<InterviewFeedback />} />
        <Route path="/career-assistant" element={<CareerAssistant />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

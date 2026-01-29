import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { GMDashboard } from './pages/GMDashboard'
import { SurveyCreation } from './pages/SurveyCreation'
import { ProtectedRoute } from './components/common/ProtectedRoute'

// Placeholder components for routes not yet implemented
const SurveyCompletion = () => <div className="min-h-screen bg-dark-bg text-white p-8"><h1 className="text-3xl font-bold">Survey Completion - Coming Soon</h1></div>
const ResultsDashboard = () => <div className="min-h-screen bg-dark-bg text-white p-8"><h1 className="text-3xl font-bold">Results - Coming Soon</h1></div>

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/surveys/:shareToken" element={<SurveyCompletion />} />

        {/* Protected Routes (GM only) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <GMDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <SurveyCreation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results/:surveyId"
          element={
            <ProtectedRoute>
              <ResultsDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App

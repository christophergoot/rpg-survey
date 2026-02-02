import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { GMDashboard } from './pages/GMDashboard'
import { SurveyCreation } from './pages/SurveyCreation'
import { SurveyCompletion } from './pages/SurveyCompletion'
import { PlayerResults } from './pages/PlayerResults'
import { ResultsDashboard } from './pages/ResultsDashboard'
import { ProtectedRoute } from './components/common/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/surveys/:shareToken" element={<SurveyCompletion />} />
        <Route path="/surveys/:shareToken/results" element={<PlayerResults />} />

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

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentHome from './pages/StudentHome';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ToastProvider from './components/ToastProvider';
import './App.css';

// Protected Route Component for Students
const ProtectedStudentRoute = ({ children }) => {
  const token = localStorage.getItem('student_token');
  return token ? children : <Navigate to="/" replace />;
};

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children }) => {
  const token = sessionStorage.getItem('admin_auth');
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/home" 
            element={
              <ProtectedStudentRoute>
                <StudentHome />
              </ProtectedStudentRoute>
            } 
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } 
          />
        </Routes>
      </ToastProvider>
    </Router>
  );
}

export default App;

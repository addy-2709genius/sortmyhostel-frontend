import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentHome from './pages/StudentHome';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ToastProvider from './components/ToastProvider';
import './App.css';

function App() {
  return (
    <Router>
      <ToastProvider>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Routes>
          <Route path="/" element={<StudentHome />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </ToastProvider>
    </Router>
  );
}

export default App;

import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DayWiseMenu from '../components/DayWiseMenu';
import YesterdayImpact from '../components/YesterdayImpact';
import StudentIssues from '../components/StudentIssues';
import '../styles/studentHome.css';

const StudentHome = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [studentName, setStudentName] = useState('');
  const navigate = useNavigate();
  const hostelName = 'Lohegaon Kitchen';

  useEffect(() => {
    // Get student name from localStorage
    const name = localStorage.getItem('student_name');
    if (name) {
      setStudentName(name);
    } else {
      // If no token, redirect to login
      const token = localStorage.getItem('student_token');
      if (!token) {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_name');
    localStorage.removeItem('student_email');
    navigate('/');
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    // Listen for menu updates from admin dashboard
    const handleMenuUpdate = () => {
      setRefreshKey(prev => prev + 1);
    };
    
    window.addEventListener('menuUpdated', handleMenuUpdate);
    window.addEventListener('storage', handleMenuUpdate);
    
    return () => {
      window.removeEventListener('menuUpdated', handleMenuUpdate);
      window.removeEventListener('storage', handleMenuUpdate);
    };
  }, []);

  return (
    <div className="student-home">
      {/* Header */}
      <header className="student-header">
        <div className="header-background-pattern"></div>
        <div className="container">
          <div className="student-header-content">
            <div className="header-brand">
              <div className="header-logo">
                <img src="/logo.png" alt="SortMyHostel Logo" className="logo-image" />
              </div>
              <div className="header-title-group">
                <h1 className="student-header-title">SortMyHostel</h1>
                <p className="student-header-subtitle">{hostelName}</p>
              </div>
            </div>
            <div className="header-actions">
              <div className="header-date-group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="header-icon">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <p className="student-header-date">{today}</p>
              </div>
              {studentName && (
                <div className="student-name-display">
                  <span>Welcome, {studentName}</span>
                </div>
              )}
              <button onClick={handleLogout} className="student-header-link logout-button">
                <span>Logout</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="student-main container">
        {/* Yesterday's Impact Card */}
        <YesterdayImpact />

        <div className="menu-container">
          <div className="menu-header-enhanced">
            <h2 className="menu-title-enhanced">Weekly Menu</h2>
            <p className="menu-subtitle">Select a day to view meals</p>
          </div>

          <DayWiseMenu />

          {/* Info Banner */}
          <div className="info-banner-enhanced">
            <div className="info-icon">💡</div>
            <div className="info-content">
              <p className="info-banner-text">
                <strong>Your feedback matters!</strong> Help us improve by sharing your thoughts. All feedback is anonymous.
              </p>
            </div>
          </div>
        </div>

        {/* Student Issues Section */}
        <StudentIssues />
      </main>
    </div>
  );
};

export default StudentHome;

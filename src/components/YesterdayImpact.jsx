import { useState, useEffect } from 'react';
import { getYesterdayWastage } from '../services/api';
import '../styles/yesterdayImpact.css';

const YesterdayImpact = () => {
  const [wastageData, setWastageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check cache first (5 minute cache)
    const cacheKey = 'yesterdayWastageCache';
    const cacheTime = 'yesterdayWastageCacheTime';
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTimestamp = localStorage.getItem(cacheTime);
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_DURATION) {
      try {
        setWastageData(JSON.parse(cachedData));
        setLoading(false);
      } catch (e) {
        // If cache is invalid, fetch fresh data
        fetchYesterdayWastage();
      }
    } else {
      fetchYesterdayWastage();
    }
    
    // Listen for wastage updates from admin dashboard
    const handleWastageUpdate = () => {
      fetchYesterdayWastage();
    };
    
    window.addEventListener('wastageUpdated', handleWastageUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'wastageLastUpdated') {
        handleWastageUpdate();
      }
    });
    
    // Poll for updates every 5 minutes (reduced from 30 seconds for better performance)
    const pollInterval = setInterval(() => {
      fetchYesterdayWastage();
    }, 5 * 60 * 1000);
    
    return () => {
      window.removeEventListener('wastageUpdated', handleWastageUpdate);
      clearInterval(pollInterval);
    };
  }, []);

  const fetchYesterdayWastage = async () => {
    setLoading(true);
    try {
      const response = await getYesterdayWastage();
      setWastageData(response.data);
      
      // Cache the data
      const cacheKey = 'yesterdayWastageCache';
      const cacheTime = 'yesterdayWastageCacheTime';
      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      localStorage.setItem(cacheTime, Date.now().toString());
    } catch (error) {
      console.error('Error fetching wastage data:', error);
      setWastageData(null);
    } finally {
      setLoading(false);
    }
  };

  // Calculate how many students could be fed (assuming ~0.7kg per student per meal)
  const calculateStudentsFed = (wastedKg) => {
    if (!wastedKg || wastedKg === 0) return 0;
    return Math.round(wastedKg / 0.7);
  };

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (!wastageData || !wastageData.wasted || wastageData.wasted === 0) {
    return null; // Don't show if no wastage data
  }

  const studentsFed = calculateStudentsFed(wastageData.wasted);

  return (
    <>
      <div className="yesterday-impact-card">
        <div className="impact-header">
          <h3 className="impact-title">Yesterday's Food Wastage Impact</h3>
        </div>
        <div className="impact-content">
          <div className="impact-stat">
            <div className="impact-value-group">
              <span className="impact-value">{wastageData.wasted} kg</span>
              <span className="impact-subtext">Food Wasted</span>
            </div>
          </div>
          <div className="impact-stat">
            <div className="impact-value-group">
              <span className="impact-value">≈ {studentsFed} children</span>
              <span className="impact-subtext">could be fed</span>
            </div>
          </div>
        </div>
        <div className="impact-message">
          <p className="impact-text">Let's make a difference today</p>
        </div>
      </div>
      <p className="impact-feedback-message">
        Your feedback yesterday helped reduce waste today. Every action counts.
      </p>
    </>
  );
};

export default YesterdayImpact;


import { useState, useEffect } from 'react';
import { getAllDaysMenu } from '../services/api';
import FoodCard from './FoodCard';
import { MenuSkeleton } from './SkeletonLoader';
import '../styles/dayWiseMenu.css';

const DayWiseMenu = ({ onUpdate }) => {
  const [daysMenu, setDaysMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentDay, setCurrentDay] = useState(null);

  const days = [
    { key: 'monday', label: 'Monday', date: 'Dec 15' },
    { key: 'tuesday', label: 'Tuesday', date: 'Dec 16' },
    { key: 'wednesday', label: 'Wednesday', date: 'Dec 17' },
    { key: 'thursday', label: 'Thursday', date: 'Dec 18' },
    { key: 'friday', label: 'Friday', date: 'Dec 19' },
    { key: 'saturday', label: 'Saturday', date: 'Dec 20' },
    { key: 'sunday', label: 'Sunday', date: 'Dec 21' },
  ];

  const mealIcons = {
    breakfast: '🌅',
    lunch: '🍛',
    snacks: '☕',
    dinner: '🌙',
  };

  useEffect(() => {
    fetchAllDaysMenu();
    
    // Listen for menu updates from admin dashboard
    const handleMenuUpdate = () => {
      fetchAllDaysMenu();
    };
    
    window.addEventListener('menuUpdated', handleMenuUpdate);
    window.addEventListener('storage', handleMenuUpdate);
    
    return () => {
      window.removeEventListener('menuUpdated', handleMenuUpdate);
      window.removeEventListener('storage', handleMenuUpdate);
    };
  }, []);

  const fetchAllDaysMenu = async () => {
    setLoading(true);
    try {
      const response = await getAllDaysMenu();
      setDaysMenu(response.data || {});
      // Set current day as default
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      setCurrentDay(today);
      setSelectedDay(today);
    } catch (error) {
      console.error('Error fetching day-wise menu:', error);
      setDaysMenu({});
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackUpdate = async () => {
    await fetchAllDaysMenu();
    if (onUpdate) onUpdate();
  };

  if (loading) {
    return <MenuSkeleton />;
  }

  return (
    <div className="day-wise-menu">
      <div className="day-tabs-container">
        <div className="day-tabs">
          {days.map((day) => {
            const isCurrentDay = day.key === currentDay;
            const isSelected = selectedDay === day.key;
            return (
              <button
                key={day.key}
                onClick={() => setSelectedDay(day.key)}
                className={`day-tab ${isSelected ? 'active' : ''} ${isCurrentDay ? 'current-day' : ''}`}
              >
                <div className="day-info">
                  <span className="day-label">
                    {day.label}
                    {isCurrentDay && <span className="current-day-badge">Today</span>}
                  </span>
                  <span className="day-date">{day.date}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay && daysMenu[selectedDay] ? (
        <div className="day-menu-content">
          {selectedDay !== currentDay && (
            <div className="view-only-notice">
              <p>
                <strong>Viewing {days.find(d => d.key === selectedDay)?.label}'s menu</strong> — 
                Feedback is only available for today's menu. Switch to today to like, dislike, or comment.
              </p>
            </div>
          )}
          
          {/* Check if day has any menu items */}
          {(!daysMenu[selectedDay].breakfast?.length && 
            !daysMenu[selectedDay].lunch?.length && 
            !daysMenu[selectedDay].snacks?.length && 
            !daysMenu[selectedDay].dinner?.length) ? (
            <div className="empty-day-menu">
              <div className="empty-state-icon">📅</div>
              <h3>No menu available</h3>
              <p>Menu for {days.find(d => d.key === selectedDay)?.label} hasn't been added yet.</p>
            </div>
          ) : (
            <>
              {/* Breakfast */}
              {daysMenu[selectedDay].breakfast?.length > 0 && (
            <div className="meal-section meal-section-breakfast">
              <div className="meal-header">
                <span className="meal-icon">{mealIcons.breakfast}</span>
                <div className="meal-title-group">
                  <h3 className="meal-section-title">Breakfast</h3>
                  <span className="meal-time">7:30 AM - 9:00 AM</span>
                </div>
              </div>
              <div className="food-grid">
                {daysMenu[selectedDay].breakfast.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    onUpdate={handleFeedbackUpdate}
                    isCurrentDay={selectedDay === currentDay}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Lunch */}
          {daysMenu[selectedDay].lunch?.length > 0 && (
            <div className="meal-section meal-section-lunch">
              <div className="meal-header">
                <span className="meal-icon">{mealIcons.lunch}</span>
                <div className="meal-title-group">
                  <h3 className="meal-section-title">Lunch</h3>
                  <span className="meal-time">1:30 PM - 3:00 PM</span>
                </div>
              </div>
              <div className="food-grid">
                {daysMenu[selectedDay].lunch.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    onUpdate={handleFeedbackUpdate}
                    isCurrentDay={selectedDay === currentDay}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Snacks */}
          {daysMenu[selectedDay].snacks?.length > 0 && (
            <div className="meal-section meal-section-snacks">
              <div className="meal-header">
                <span className="meal-icon">{mealIcons.snacks}</span>
                <div className="meal-title-group">
                  <h3 className="meal-section-title">Snacks</h3>
                  <span className="meal-time">5:30 PM - 6:30 PM</span>
                </div>
              </div>
              <div className="food-grid">
                {daysMenu[selectedDay].snacks.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    onUpdate={handleFeedbackUpdate}
                    isCurrentDay={selectedDay === currentDay}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Dinner */}
          {daysMenu[selectedDay].dinner?.length > 0 && (
            <div className="meal-section meal-section-dinner">
              <div className="meal-header">
                <span className="meal-icon">{mealIcons.dinner}</span>
                <div className="meal-title-group">
                  <h3 className="meal-section-title">Dinner</h3>
                  <span className="meal-time">8:00 PM - 10:00 PM</span>
                </div>
              </div>
              <div className="food-grid">
                {daysMenu[selectedDay].dinner.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    onUpdate={handleFeedbackUpdate}
                    isCurrentDay={selectedDay === currentDay}
                  />
                ))}
              </div>
            </div>
          )}
            </>
          )}
        </div>
      ) : selectedDay ? (
        <div className="empty-day-menu">
          <div className="empty-state-icon">📅</div>
          <h3>No menu available</h3>
          <p>Menu for {days.find(d => d.key === selectedDay)?.label} hasn't been added yet.</p>
        </div>
      ) : null}
    </div>
  );
};

export default DayWiseMenu;

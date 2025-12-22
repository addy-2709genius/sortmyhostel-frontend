import { getMealTimes, getCurrentMeal } from '../utils/mealTime';
import '../styles/mealTabs.css';

const MealTabs = ({ activeMeal, onMealChange }) => {
  const mealTimes = getMealTimes();
  const currentMeal = getCurrentMeal();

  return (
    <div className="meal-tabs">
      {Object.entries(mealTimes).map(([key, meal]) => (
        <button
          key={key}
          onClick={() => onMealChange(key)}
          className={`meal-tab ${activeMeal === key ? 'active' : ''} ${
            currentMeal === key ? 'current-meal' : ''
          }`}
        >
          <div className="meal-tab-content">
            <span>{meal.label}</span>
            <span className="meal-tab-label">
              {meal.start} - {meal.end}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default MealTabs;

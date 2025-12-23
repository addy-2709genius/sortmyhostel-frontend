// Utility functions for meal time detection
export const getCurrentMeal = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes; // Convert to minutes since midnight

  // Breakfast: 7:30 - 9:00 (450 - 540 minutes)
  // Lunch: 1:30 - 3:00 (810 - 900 minutes)
  // Snacks: 5:30 - 6:30 (1050 - 1110 minutes)
  // Dinner: 8:00 - 10:00 (1200 - 1320 minutes)

  if (currentTime >= 450 && currentTime < 540) return 'breakfast';
  if (currentTime >= 810 && currentTime < 900) return 'lunch';
  if (currentTime >= 1050 && currentTime < 1110) return 'snacks';
  if (currentTime >= 1200 && currentTime < 1320) return 'dinner';
  
  // Default to breakfast if no meal time
  return 'breakfast';
};

export const getMealTimes = () => {
  return {
    breakfast: { start: '7:30', end: '9:00', label: 'Breakfast' },
    lunch: { start: '1:30', end: '3:00', label: 'Lunch' },
    snacks: { start: '5:30', end: '6:30', label: 'Snacks' },
    dinner: { start: '8:00', end: '10:00', label: 'Dinner' },
  };
};








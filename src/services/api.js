import axios from 'axios';
import { getAnonymousUserId } from '../utils/storage.js';

// Base URL for API - Will be updated after Render deployment
// For now, using Render URL (update after backend is deployed on Render)
const API_BASE_URL = process.env.VITE_API_URL || 'https://sortmyhostel-backend.onrender.com/api';

// Menu data based on Lohegaon Kitchen weekly menu (Dec 15-21, 2025)
const dummyFoodData = {
  breakfast: [
    // Hot Food (varies by day)
    { id: 1, name: 'Poha', likes: 58, dislikes: 7, comments: [] },
    { id: 2, name: 'Veg Upma', likes: 45, dislikes: 12, comments: [] },
    { id: 3, name: 'Aloo Pyaz Paratha', likes: 72, dislikes: 4, comments: [] },
    { id: 4, name: 'Sprouts Usal', likes: 38, dislikes: 15, comments: [] },
    { id: 5, name: 'Medu Wada', likes: 62, dislikes: 5, comments: [] },
    // Chutney/Sides (varies by day)
    { id: 6, name: 'Matki Tari Rassa', likes: 42, dislikes: 10, comments: [] },
    { id: 7, name: 'Chutney', likes: 55, dislikes: 6, comments: [] },
    { id: 8, name: 'Curd', likes: 48, dislikes: 8, comments: [] },
    { id: 9, name: 'Farsan', likes: 52, dislikes: 9, comments: [] },
    { id: 10, name: 'Sambhar / Chutney', likes: 65, dislikes: 3, comments: [] },
    // Beverages (available daily)
    { id: 12, name: 'Tea / Coffee', likes: 85, dislikes: 2, comments: [] },
    // Fruits (available daily)
    { id: 13, name: 'Mix Fruits', likes: 70, dislikes: 1, comments: [] },
    // Cereals (available daily)
    { id: 14, name: 'Chocos', likes: 35, dislikes: 20, comments: [] },
    // BBJ (available daily)
    { id: 15, name: 'BBJ', likes: 50, dislikes: 8, comments: [] },
    // Milk (available daily)
    { id: 16, name: 'Hot Milk', likes: 60, dislikes: 10, comments: [] },
  ],
  lunch: [
    // Dal items (varies by day)
    { id: 17, name: 'Chawli Curry', likes: 48, dislikes: 10, comments: [] },
    { id: 18, name: 'Dal Tadka', likes: 68, dislikes: 4, comments: [] },
    { id: 19, name: 'Dal Makhani', likes: 75, dislikes: 2, comments: [] },
    { id: 20, name: 'Punjabi Kadhi', likes: 62, dislikes: 6, comments: [] },
    // Veg items (varies by day)
    { id: 21, name: 'Tomato Lasoon Chutney', likes: 42, dislikes: 15, comments: [] },
    { id: 22, name: 'Paneer Tikka Masala', likes: 82, dislikes: 1, comments: [] },
    { id: 23, name: 'Aloo Mutter', likes: 65, dislikes: 5, comments: [] },
    { id: 24, name: 'Chana Desi Peshawari', likes: 58, dislikes: 8, comments: [] },
    { id: 25, name: 'Aloo Jeera Dry', likes: 50, dislikes: 12, comments: [] },
    // Rice items (varies by day)
    { id: 26, name: 'Jeera Rice', likes: 70, dislikes: 3, comments: [] },
    { id: 27, name: 'Steam Rice', likes: 65, dislikes: 4, comments: [] },
    { id: 28, name: 'Lemon Rice', likes: 58, dislikes: 7, comments: [] },
    { id: 29, name: 'Plain Rice', likes: 55, dislikes: 8, comments: [] },
  ],
  snacks: [
    { id: 30, name: 'Samosa', likes: 72, dislikes: 4, comments: [] },
    { id: 31, name: 'Tea & Biscuits', likes: 60, dislikes: 6, comments: [] },
    { id: 32, name: 'Pakora', likes: 55, dislikes: 8, comments: [] },
    { id: 33, name: 'Vada Pav', likes: 68, dislikes: 5, comments: [] },
    { id: 34, name: 'Bread Pakora', likes: 50, dislikes: 10, comments: [] },
  ],
  dinner: [
    { id: 35, name: 'Fried Rice', likes: 58, dislikes: 7, comments: [] },
    { id: 36, name: 'Paneer Curry', likes: 65, dislikes: 5, comments: [] },
    { id: 37, name: 'Noodles', likes: 62, dislikes: 6, comments: [] },
    { id: 38, name: 'Dal Tadka', likes: 60, dislikes: 8, comments: [] },
    { id: 39, name: 'Roti', likes: 70, dislikes: 3, comments: [] },
    { id: 40, name: 'Mix Veg', likes: 52, dislikes: 10, comments: [] },
  ],
};

// Day-wise menu data based on Lohegaon Kitchen weekly menu (Dec 15-21, 2025)
const dayWiseMenuData = {
  monday: {
    date: '2025-12-15',
    breakfast: [
      { id: 1, name: 'Poha', likes: 58, dislikes: 7, comments: [] },
      { id: 6, name: 'Matki Tari Rassa', likes: 42, dislikes: 10, comments: [] },
      { id: 12, name: 'Tea / Coffee', likes: 85, dislikes: 2, comments: [] },
      { id: 13, name: 'Mix Fruits', likes: 70, dislikes: 1, comments: [] },
      { id: 14, name: 'Chocos', likes: 35, dislikes: 20, comments: [] },
      { id: 15, name: 'BBJ', likes: 50, dislikes: 8, comments: [] },
      { id: 16, name: 'Hot Milk', likes: 60, dislikes: 10, comments: [] },
    ],
    lunch: [
      { id: 17, name: 'Chawli Curry', likes: 48, dislikes: 10, comments: [] },
      { id: 21, name: 'Tomato Lasoon Chutney', likes: 42, dislikes: 15, comments: [] },
      { id: 26, name: 'Jeera Rice', likes: 70, dislikes: 3, comments: [] },
    ],
    snacks: [
      { id: 30, name: 'Samosa', likes: 72, dislikes: 4, comments: [] },
      { id: 31, name: 'Tea & Biscuits', likes: 60, dislikes: 6, comments: [] },
    ],
    dinner: [
      { id: 35, name: 'Fried Rice', likes: 58, dislikes: 7, comments: [] },
      { id: 36, name: 'Paneer Curry', likes: 65, dislikes: 5, comments: [] },
      { id: 39, name: 'Roti', likes: 70, dislikes: 3, comments: [] },
    ],
  },
  tuesday: {
    date: '2025-12-16',
    breakfast: [
      { id: 2, name: 'Veg Upma', likes: 45, dislikes: 12, comments: [] },
      { id: 7, name: 'Chutney', likes: 55, dislikes: 6, comments: [] },
      { id: 12, name: 'Tea / Coffee', likes: 85, dislikes: 2, comments: [] },
      { id: 13, name: 'Mix Fruits', likes: 70, dislikes: 1, comments: [] },
      { id: 14, name: 'Chocos', likes: 35, dislikes: 20, comments: [] },
      { id: 15, name: 'BBJ', likes: 50, dislikes: 8, comments: [] },
      { id: 16, name: 'Hot Milk', likes: 60, dislikes: 10, comments: [] },
    ],
    lunch: [
      { id: 18, name: 'Dal Tadka', likes: 68, dislikes: 4, comments: [] },
      { id: 22, name: 'Paneer Tikka Masala', likes: 82, dislikes: 1, comments: [] },
      { id: 27, name: 'Steam Rice', likes: 65, dislikes: 4, comments: [] },
    ],
    snacks: [
      { id: 32, name: 'Pakora', likes: 55, dislikes: 8, comments: [] },
      { id: 31, name: 'Tea & Biscuits', likes: 60, dislikes: 6, comments: [] },
    ],
    dinner: [
      { id: 37, name: 'Noodles', likes: 62, dislikes: 6, comments: [] },
      { id: 38, name: 'Dal Tadka', likes: 60, dislikes: 8, comments: [] },
      { id: 40, name: 'Mix Veg', likes: 52, dislikes: 10, comments: [] },
    ],
  },
  wednesday: {
    date: '2025-12-17',
    breakfast: [
      { id: 3, name: 'Aloo Pyaz Paratha', likes: 72, dislikes: 4, comments: [] },
      { id: 8, name: 'Curd', likes: 48, dislikes: 8, comments: [] },
      { id: 12, name: 'Tea / Coffee', likes: 85, dislikes: 2, comments: [] },
      { id: 13, name: 'Mix Fruits', likes: 70, dislikes: 1, comments: [] },
      { id: 14, name: 'Chocos', likes: 35, dislikes: 20, comments: [] },
      { id: 15, name: 'BBJ', likes: 50, dislikes: 8, comments: [] },
      { id: 16, name: 'Hot Milk', likes: 60, dislikes: 10, comments: [] },
    ],
    lunch: [
      { id: 19, name: 'Dal Makhani', likes: 75, dislikes: 2, comments: [] },
      { id: 23, name: 'Aloo Mutter', likes: 65, dislikes: 5, comments: [] },
      { id: 26, name: 'Jeera Rice', likes: 70, dislikes: 3, comments: [] },
    ],
    snacks: [
      { id: 33, name: 'Vada Pav', likes: 68, dislikes: 5, comments: [] },
      { id: 31, name: 'Tea & Biscuits', likes: 60, dislikes: 6, comments: [] },
    ],
    dinner: [
      { id: 35, name: 'Fried Rice', likes: 58, dislikes: 7, comments: [] },
      { id: 36, name: 'Paneer Curry', likes: 65, dislikes: 5, comments: [] },
      { id: 39, name: 'Roti', likes: 70, dislikes: 3, comments: [] },
    ],
  },
  thursday: {
    date: '2025-12-18',
    breakfast: [
      { id: 4, name: 'Sprouts Usal', likes: 38, dislikes: 15, comments: [] },
      { id: 9, name: 'Farsan', likes: 52, dislikes: 9, comments: [] },
      { id: 12, name: 'Tea / Coffee', likes: 85, dislikes: 2, comments: [] },
      { id: 13, name: 'Mix Fruits', likes: 70, dislikes: 1, comments: [] },
      { id: 14, name: 'Chocos', likes: 35, dislikes: 20, comments: [] },
      { id: 15, name: 'BBJ', likes: 50, dislikes: 8, comments: [] },
      { id: 16, name: 'Hot Milk', likes: 60, dislikes: 10, comments: [] },
    ],
    lunch: [
      { id: 18, name: 'Dal Tadka', likes: 68, dislikes: 4, comments: [] },
      { id: 24, name: 'Chana Desi Peshawari', likes: 58, dislikes: 8, comments: [] },
      { id: 28, name: 'Lemon Rice', likes: 58, dislikes: 7, comments: [] },
    ],
    snacks: [
      { id: 34, name: 'Bread Pakora', likes: 50, dislikes: 10, comments: [] },
      { id: 31, name: 'Tea & Biscuits', likes: 60, dislikes: 6, comments: [] },
    ],
    dinner: [
      { id: 37, name: 'Noodles', likes: 62, dislikes: 6, comments: [] },
      { id: 38, name: 'Dal Tadka', likes: 60, dislikes: 8, comments: [] },
      { id: 40, name: 'Mix Veg', likes: 52, dislikes: 10, comments: [] },
    ],
  },
  friday: {
    date: '2025-12-19',
    breakfast: [
      { id: 1, name: 'Poha', likes: 58, dislikes: 7, comments: [] },
      { id: 50, name: 'Jalebi', likes: 70, dislikes: 5, comments: [] },
      { id: 12, name: 'Tea', likes: 85, dislikes: 2, comments: [] },
      { id: 51, name: 'Banana', likes: 65, dislikes: 3, comments: [] },
      { id: 16, name: 'Milk', likes: 60, dislikes: 10, comments: [] },
    ],
    lunch: [
      { id: 18, name: 'Dal Tadka', likes: 68, dislikes: 4, comments: [] },
      { id: 23, name: 'Aloo Mutter', likes: 65, dislikes: 5, comments: [] },
      { id: 27, name: 'Steamed Rice', likes: 65, dislikes: 4, comments: [] },
      { id: 52, name: 'Chapati', likes: 72, dislikes: 3, comments: [] },
      { id: 53, name: 'Koshimbir', likes: 55, dislikes: 8, comments: [] },
      { id: 48, name: 'Curd', likes: 65, dislikes: 5, comments: [] },
      { id: 16, name: 'Milk', likes: 60, dislikes: 10, comments: [] },
    ],
    snacks: [
      { id: 54, name: 'Veg Cutlet', likes: 68, dislikes: 6, comments: [] },
      { id: 7, name: 'Chutney', likes: 55, dislikes: 6, comments: [] },
      { id: 12, name: 'Tea', likes: 85, dislikes: 2, comments: [] },
    ],
    dinner: [
      { id: 40, name: 'Mix Veg', likes: 52, dislikes: 10, comments: [] },
      { id: 55, name: 'Dal Fry', likes: 62, dislikes: 7, comments: [] },
      { id: 26, name: 'Jeera Rice', likes: 70, dislikes: 3, comments: [] },
      { id: 52, name: 'Chapati', likes: 72, dislikes: 3, comments: [] },
      { id: 56, name: 'Gulab Jamun', likes: 75, dislikes: 2, comments: [] },
      { id: 57, name: 'Salad', likes: 58, dislikes: 8, comments: [] },
    ],
  },
  saturday: {
    date: '2025-12-20',
    breakfast: [
      { id: 5, name: 'Medu Wada', likes: 62, dislikes: 5, comments: [] },
      { id: 10, name: 'Sambhar / Chutney', likes: 65, dislikes: 3, comments: [] },
      { id: 12, name: 'Tea / Coffee', likes: 85, dislikes: 2, comments: [] },
      { id: 13, name: 'Mix Fruits', likes: 70, dislikes: 1, comments: [] },
      { id: 14, name: 'Chocos', likes: 35, dislikes: 20, comments: [] },
      { id: 15, name: 'BBJ', likes: 50, dislikes: 8, comments: [] },
      { id: 16, name: 'Hot Milk', likes: 60, dislikes: 10, comments: [] },
    ],
    lunch: [
      { id: 20, name: 'Punjabi Kadhi', likes: 62, dislikes: 6, comments: [] },
      { id: 25, name: 'Aloo Jeera Dry', likes: 50, dislikes: 12, comments: [] },
      { id: 29, name: 'Plain Rice', likes: 55, dislikes: 8, comments: [] },
    ],
    snacks: [
      { id: 30, name: 'Samosa', likes: 72, dislikes: 4, comments: [] },
      { id: 31, name: 'Tea & Biscuits', likes: 60, dislikes: 6, comments: [] },
    ],
    dinner: [
      { id: 35, name: 'Fried Rice', likes: 58, dislikes: 7, comments: [] },
      { id: 36, name: 'Paneer Curry', likes: 65, dislikes: 5, comments: [] },
      { id: 39, name: 'Roti', likes: 70, dislikes: 3, comments: [] },
    ],
  },
  sunday: {
    date: '2025-12-21',
    breakfast: [
      { id: 41, name: 'Aloo Bhaji', likes: 65, dislikes: 6, comments: [] },
      { id: 42, name: 'Puri', likes: 75, dislikes: 3, comments: [] },
      { id: 12, name: 'Tea', likes: 85, dislikes: 2, comments: [] },
      { id: 43, name: 'Ruhabzza Sharbat', likes: 55, dislikes: 8, comments: [] },
      { id: 16, name: 'Milk', likes: 60, dislikes: 10, comments: [] },
    ],
    lunch: [
      { id: 49, name: 'Dal Lasooni', likes: 68, dislikes: 4, comments: [] },
      { id: 44, name: 'Paneer Butter Masala', likes: 80, dislikes: 2, comments: [] },
      { id: 45, name: 'Veg Pulao', likes: 70, dislikes: 4, comments: [] },
      { id: 46, name: 'Ghee Roti', likes: 72, dislikes: 3, comments: [] },
      { id: 47, name: 'Tandoori Laccha Onion', likes: 58, dislikes: 7, comments: [] },
      { id: 48, name: 'Curd', likes: 65, dislikes: 5, comments: [] },
      { id: 16, name: 'Milk', likes: 60, dislikes: 10, comments: [] },
    ],
    snacks: [
      { id: 30, name: 'Samosa', likes: 72, dislikes: 4, comments: [] },
      { id: 31, name: 'Tea & Biscuits', likes: 60, dislikes: 6, comments: [] },
    ],
    dinner: [
      { id: 35, name: 'Fried Rice', likes: 58, dislikes: 7, comments: [] },
      { id: 36, name: 'Paneer Curry', likes: 65, dislikes: 5, comments: [] },
      { id: 39, name: 'Roti', likes: 70, dislikes: 3, comments: [] },
    ],
  },
};

// Store feedback in localStorage for persistence
const getStoredFeedback = () => {
  const stored = localStorage.getItem('sortmenu_feedback');
  return stored ? JSON.parse(stored) : dummyFoodData;
};

const getStoredDayWiseMenu = () => {
  const stored = localStorage.getItem('sortmenu_daywise_menu');
  return stored ? JSON.parse(stored) : dayWiseMenuData;
};

const saveFeedback = (data) => {
  localStorage.setItem('sortmenu_feedback', JSON.stringify(data));
};

const saveDayWiseMenu = (data) => {
  localStorage.setItem('sortmenu_daywise_menu', JSON.stringify(data));
};

// API functions
export const getFoodItems = async (mealType) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const data = getStoredFeedback();
  return { data: data[mealType] || [] };
};

export const submitFeedback = async (foodId, feedbackType) => {
  try {
    const userId = getAnonymousUserId();
    const response = await axios.post(`${API_BASE_URL}/feedback/submit`, {
      foodId,
      feedbackType,
      userId,
    }, {
      headers: {
        'x-user-id': userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    // Fallback to localStorage if API fails
    const data = getStoredFeedback();
    for (const meal in data) {
      const item = data[meal].find(f => f.id === foodId);
      if (item) {
        if (feedbackType === 'like') {
          item.likes += 1;
        } else if (feedbackType === 'dislike') {
          item.dislikes += 1;
        }
        break;
      }
    }
    saveFeedback(data);
    return { success: true };
  }
};

export const submitComment = async (foodId, comment) => {
  try {
    const userId = getAnonymousUserId();
    const response = await axios.post(`${API_BASE_URL}/feedback/comment`, {
      foodId,
      comment,
      userId,
    }, {
      headers: {
        'x-user-id': userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting comment:', error);
    // Fallback to localStorage if API fails
    const data = getStoredFeedback();
    const commentObj = {
      id: Date.now(),
      text: comment,
      timestamp: new Date().toISOString(),
    };
    for (const meal in data) {
      const item = data[meal].find(f => f.id === foodId);
      if (item) {
        if (!item.comments) item.comments = [];
        item.comments.push(commentObj);
        break;
      }
    }
    saveFeedback(data);
    return { success: true };
  }
};

// Admin API functions
export const getAnalytics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    // Fallback to localStorage if API fails
    const data = getStoredFeedback();
    const allFoods = Object.values(data).flat();
    const mostLiked = allFoods.reduce((max, item) => 
      item.likes > max.likes ? item : max, allFoods[0] || { name: 'N/A', likes: 0 }
    );
    const mostDisliked = allFoods.reduce((max, item) => 
      item.dislikes > max.dislikes ? item : max, allFoods[0] || { name: 'N/A', dislikes: 0 }
    );
    const totalFeedback = allFoods.reduce((sum, item) => sum + item.likes + item.dislikes, 0);
    return {
      data: {
        mostLiked,
        mostDisliked,
        totalFeedback,
        foodItems: allFoods,
      }
    };
  }
};

export const getWastageData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wastage`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wastage data:', error);
    // Fallback to dummy data if API fails
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const wastageData = days.map((day, index) => ({
      day,
      cooked: Math.floor(Math.random() * 100) + 50,
      wasted: Math.floor(Math.random() * 20) + 5,
    }));
    return { data: wastageData };
  }
};

// Get yesterday's wastage data
export const getYesterdayWastage = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wastage/yesterday`);
    return response.data;
  } catch (error) {
    console.error('Error fetching yesterday wastage:', error);
    // Fallback to localStorage if API fails
    const stored = localStorage.getItem('sortmenu_yesterday_wastage');
    if (stored) {
      return { data: JSON.parse(stored) };
    }
    const yesterdayData = {
      wasted: 32,
      cooked: 120,
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    };
    return { data: yesterdayData };
  }
};

export const submitWastage = async (cooked, wasted) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/wastage/submit`, {
      cooked,
      wasted,
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting wastage:', error);
    // Fallback to localStorage if API fails
    const yesterdayData = {
      wasted: parseFloat(wasted),
      cooked: parseFloat(cooked),
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    };
    localStorage.setItem('sortmenu_yesterday_wastage', JSON.stringify(yesterdayData));
    return { success: true };
  }
};

// Get day-wise menu
export const getDayWiseMenu = async (day) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/menu/day/${day}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching day menu:', error);
    // Fallback to stored data if API fails
    const data = getStoredDayWiseMenu();
    const dayKey = day.toLowerCase();
    return { data: data[dayKey] || null };
  }
};

// Get all days menu
export const getAllDaysMenu = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/menu/all-days`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all days menu:', error);
    // Fallback to stored data if API fails
    const data = getStoredDayWiseMenu();
    return { data };
  }
};

// Update feedback in day-wise menu
export const updateDayWiseFeedback = async (foodId, feedbackType) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const data = getStoredDayWiseMenu();
  
  // Find and update the food item in day-wise menu
  for (const day in data) {
    for (const meal in data[day]) {
      if (meal !== 'date' && Array.isArray(data[day][meal])) {
        const item = data[day][meal].find(f => f.id === foodId);
        if (item) {
          if (feedbackType === 'like') {
            item.likes += 1;
          } else if (feedbackType === 'dislike') {
            item.dislikes += 1;
          }
          saveDayWiseMenu(data);
          // Also update in meal-wise data
          const mealData = getStoredFeedback();
          for (const mealType in mealData) {
            const mealItem = mealData[mealType].find(f => f.id === foodId);
            if (mealItem) {
              if (feedbackType === 'like') {
                mealItem.likes += 1;
              } else if (feedbackType === 'dislike') {
                mealItem.dislikes += 1;
              }
              break;
            }
          }
          saveFeedback(mealData);
          break;
        }
      }
    }
  }
  
  return { success: true };
};

// Update menu from Excel file
export const updateMenuFromExcel = async (menuData) => {
  try {
    // Convert menuData to FormData for file upload
    // Note: This function is called after Excel is parsed, so we need to send the parsed data
    // For now, we'll keep the localStorage fallback since Excel upload needs file handling
    const existingMenu = getStoredDayWiseMenu();
    
    // Merge new menu with existing feedback (preserve likes, dislikes, comments)
    Object.keys(menuData).forEach((dayKey) => {
      if (existingMenu[dayKey]) {
        ['breakfast', 'lunch', 'snacks', 'dinner'].forEach((mealType) => {
          if (menuData[dayKey][mealType] && existingMenu[dayKey][mealType]) {
            menuData[dayKey][mealType] = menuData[dayKey][mealType].map((newItem) => {
              const existingItem = existingMenu[dayKey][mealType].find(
                (item) => item.name.toLowerCase() === newItem.name.toLowerCase()
              );
              
              if (existingItem) {
                return {
                  ...newItem,
                  id: existingItem.id,
                  likes: existingItem.likes || 0,
                  dislikes: existingItem.dislikes || 0,
                  comments: existingItem.comments || [],
                };
              }
              return {
                ...newItem,
                likes: 0,
                dislikes: 0,
                comments: [],
              };
            });
          }
        });
      }
    });
    
    saveDayWiseMenu(menuData);
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'sortmenu_daywise_menu',
      newValue: JSON.stringify(menuData)
    }));
    
    return { success: true, message: 'Menu updated successfully' };
  } catch (error) {
    console.error('Error updating menu:', error);
    return { success: false, message: error.message };
  }
};

// Get all disliked food issues with comments
export const getDislikedFoodIssues = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/feedback/disliked-issues`);
    return response.data;
  } catch (error) {
    console.error('Error fetching disliked issues:', error);
    // Fallback to localStorage if API fails
    const dayWiseData = getStoredDayWiseMenu();
    const issues = [];
    Object.keys(dayWiseData).forEach((day) => {
      ['breakfast', 'lunch', 'snacks', 'dinner'].forEach((mealType) => {
        if (dayWiseData[day][mealType] && Array.isArray(dayWiseData[day][mealType])) {
          dayWiseData[day][mealType].forEach((item) => {
            if (item.dislikes > 0) {
              issues.push({
                foodId: item.id,
                foodName: item.name,
                day: day,
                meal: mealType,
                dislikes: item.dislikes,
                likes: item.likes,
                comments: item.comments || [],
                date: dayWiseData[day].date,
              });
            }
          });
        }
      });
    });
    issues.sort((a, b) => b.dislikes - a.dislikes);
    return { data: issues };
  }
};

// Delete a comment
export const deleteComment = async (foodId, commentId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/feedback/comment/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    // Fallback to localStorage if API fails
    const data = getStoredFeedback();
    const dayWiseData = getStoredDayWiseMenu();
    for (const meal in data) {
      const item = data[meal].find(f => f.id === foodId);
      if (item && item.comments) {
        item.comments = item.comments.filter(c => c.id !== commentId);
        break;
      }
    }
    saveFeedback(data);
    for (const day in dayWiseData) {
      for (const meal in dayWiseData[day]) {
        if (meal !== 'date' && Array.isArray(dayWiseData[day][meal])) {
          const item = dayWiseData[day][meal].find(f => f.id === foodId);
          if (item && item.comments) {
            item.comments = item.comments.filter(c => c.id !== commentId);
            saveDayWiseMenu(dayWiseData);
            break;
          }
        }
      }
    }
    return { success: true };
  }
};

// Add manual menu item
export const addManualMenuItem = async (day, meal, foodName) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/menu/add-item`, {
      day,
      meal,
      foodName,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding menu item:', error);
    // Fallback to localStorage if API fails
    const dayWiseData = getStoredDayWiseMenu();
    let maxId = 0;
    Object.values(dayWiseData).forEach((dayMenu) => {
      ['breakfast', 'lunch', 'snacks', 'dinner'].forEach((mealType) => {
        if (dayMenu[mealType] && Array.isArray(dayMenu[mealType])) {
          dayMenu[mealType].forEach((item) => {
            if (item.id > maxId) maxId = item.id;
          });
        }
      });
    });
    const newItem = {
      id: maxId + 1,
      name: foodName,
      likes: 0,
      dislikes: 0,
      comments: [],
    };
    if (!dayWiseData[day]) {
      dayWiseData[day] = { date: '', breakfast: [], lunch: [], snacks: [], dinner: [] };
    }
    if (!dayWiseData[day][meal]) {
      dayWiseData[day][meal] = [];
    }
    dayWiseData[day][meal].push(newItem);
    saveDayWiseMenu(dayWiseData);
    return { success: true, data: newItem };
  }
};

// Get all comments from all food items (for students)
export const getAllComments = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const dayWiseData = getStoredDayWiseMenu();
  const allComments = [];
  
  // Collect all comments from all foods
  Object.keys(dayWiseData).forEach((day) => {
    ['breakfast', 'lunch', 'snacks', 'dinner'].forEach((mealType) => {
      if (dayWiseData[day][mealType] && Array.isArray(dayWiseData[day][mealType])) {
        dayWiseData[day][mealType].forEach((item) => {
          if (item.comments && item.comments.length > 0) {
            item.comments.forEach((comment) => {
              allComments.push({
                ...comment,
                foodName: item.name,
                foodId: item.id,
                day: day,
                meal: mealType,
                date: dayWiseData[day].date,
                likes: item.likes,
                dislikes: item.dislikes,
              });
            });
          }
        });
      }
    });
  });
  
  // Sort by timestamp (newest first)
  allComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return { data: allComments };
};


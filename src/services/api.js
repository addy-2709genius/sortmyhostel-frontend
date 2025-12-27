import axios from 'axios';
import { getAnonymousUserId } from '../utils/storage.js';

// Base URL for API - Use localhost for local development, Render URL for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'development' || window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://sortmyhostel-backend.onrender.com/api');

// Production-ready API service - no dummy data fallbacks

// Student Authentication
export const studentSignup = async (email, password, name) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/student/signup`, {
      email,
      password,
      name,
    });
    return response.data;
  } catch (error) {
    console.error('Error signing up:', error);
    console.error('API URL:', API_BASE_URL);
    console.error('Error details:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Signup failed. Please try again.',
    };
  }
};

export const studentLogin = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/student/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Login failed. Please try again.',
    };
  }
};

export const adminLogin = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/admin/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Login failed. Please try again.',
    };
  }
};

// Menu API functions
export const getAllDaysMenu = async () => {
  try {
    const studentToken = localStorage.getItem('student_token');
    const headers = {};
    if (studentToken) {
      headers['Authorization'] = `Bearer ${studentToken}`;
    }
    
    const response = await axios.get(`${API_BASE_URL}/menu/all-days`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all days menu:', error);
    throw error;
  }
};

export const getDayWiseMenu = async (day) => {
  try {
    const studentToken = localStorage.getItem('student_token');
    const headers = {};
    if (studentToken) {
      headers['Authorization'] = `Bearer ${studentToken}`;
    }
    
    const response = await axios.get(`${API_BASE_URL}/menu/day/${day}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching day menu:', error);
    throw error;
  }
};

export const updateMenuFromExcel = async (file) => {
  try {
    const adminToken = sessionStorage.getItem('admin_auth');
    if (!adminToken) {
      throw new Error('Admin authentication required');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/menu/upload-excel`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating menu:', error);
    throw error;
  }
};

export const addManualMenuItem = async (day, meal, foodName) => {
  try {
    const adminToken = sessionStorage.getItem('admin_auth');
    if (!adminToken) {
      throw new Error('Admin authentication required');
    }
    
    const response = await axios.post(`${API_BASE_URL}/menu/add-item`, {
      day,
      meal,
      foodName,
    }, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

export const removeMenuItem = async (day, meal, foodName) => {
  try {
    const adminToken = sessionStorage.getItem('admin_auth');
    if (!adminToken) {
      throw new Error('Admin authentication required');
    }
    
    const response = await axios.delete(`${API_BASE_URL}/menu/remove-item`, {
      data: {
        day,
        meal,
        foodName,
      },
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing menu item:', error);
    throw error;
  }
};

export const removeAllMenuItems = async () => {
  try {
    const adminToken = sessionStorage.getItem('admin_auth');
    if (!adminToken) {
      throw new Error('Admin authentication required');
    }
    
    const response = await axios.delete(`${API_BASE_URL}/menu/remove-all`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing all menu items:', error);
    throw error;
  }
};

// Feedback API functions
export const submitFeedback = async (foodId, feedbackType) => {
  try {
    const studentToken = localStorage.getItem('student_token');
    const userId = getAnonymousUserId(); // Fallback for anonymous users
    
    const headers = {};
    if (studentToken) {
      headers['Authorization'] = `Bearer ${studentToken}`;
    } else {
      headers['x-user-id'] = userId;
    }
    
    const response = await axios.post(`${API_BASE_URL}/feedback/submit`, {
      foodId,
      feedbackType,
      userId: studentToken ? undefined : userId, // Only send userId if not authenticated
    }, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

export const submitComment = async (foodId, comment) => {
  try {
    const studentToken = localStorage.getItem('student_token');
    const userId = getAnonymousUserId(); // Fallback for anonymous users
    
    const headers = {};
    if (studentToken) {
      headers['Authorization'] = `Bearer ${studentToken}`;
    } else {
      headers['x-user-id'] = userId;
    }
    
    const response = await axios.post(`${API_BASE_URL}/feedback/comment`, {
      foodId,
      comment,
      userId: studentToken ? undefined : userId, // Only send userId if not authenticated
    }, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting comment:', error);
    throw error;
  }
};

export const deleteComment = async (foodId, commentId) => {
  try {
    const adminToken = sessionStorage.getItem('admin_auth');
    if (!adminToken) {
      throw new Error('Admin authentication required');
    }
    
    const response = await axios.delete(`${API_BASE_URL}/feedback/comment/${commentId}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const getDislikedFoodIssues = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/feedback/disliked-issues`);
    return response.data;
  } catch (error) {
    console.error('Error fetching disliked issues:', error);
    throw error;
  }
};

export const getAllComments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/feedback/all-comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all comments:', error);
    throw error;
  }
};

// Analytics API functions
export const getAnalytics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

// Wastage API functions
export const getWastageData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wastage`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wastage data:', error);
    throw error;
  }
};

export const getYesterdayWastage = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wastage/yesterday`);
    return response.data;
  } catch (error) {
    console.error('Error fetching yesterday wastage:', error);
    throw error;
  }
};

export const submitWastage = async (cooked, wasted) => {
  try {
    const adminToken = sessionStorage.getItem('admin_auth');
    if (!adminToken) {
      throw new Error('Admin authentication required');
    }
    
    const response = await axios.post(`${API_BASE_URL}/wastage/submit`, {
      cooked,
      wasted,
    }, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting wastage:', error);
    throw error;
  }
};

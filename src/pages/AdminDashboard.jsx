import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getAnalytics, getWastageData, submitWastage, getDislikedFoodIssues, deleteComment, addManualMenuItem, updateMenuFromExcel, getAllDaysMenu } from '../services/api';
import jsPDF from 'jspdf';
import '../styles/adminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [wastageData, setWastageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wastageForm, setWastageForm] = useState({ cooked: '', wasted: '' });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ type: '', text: '' });
  const [dislikedIssues, setDislikedIssues] = useState([]);
  const [manualMenuForm, setManualMenuForm] = useState({ day: 'monday', meal: 'breakfast', foodName: '' });
  const commonItems = ['Pickle', 'Curd', 'Papad', 'Salad', 'Rice', 'Roti', 'BBJ', 'Milk'];
  const [addingMenuItem, setAddingMenuItem] = useState(false);
  const [menuMessage, setMenuMessage] = useState({ type: '', text: '' });
  const [formErrors, setFormErrors] = useState({});
  const [menuData, setMenuData] = useState(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check authentication
    const authToken = sessionStorage.getItem('admin_auth');
    if (!authToken) {
      navigate('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('admin_email');
    navigate('/admin/login');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, wastageRes, issuesRes, menuRes] = await Promise.all([
        getAnalytics(),
        getWastageData(),
        getDislikedFoodIssues(),
        getAllDaysMenu(),
      ]);
      setAnalytics(analyticsRes.data);
      setWastageData(wastageRes.data);
      setDislikedIssues(issuesRes.data);
      setMenuData(menuRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWastageSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const cooked = parseFloat(wastageForm.cooked);
    const wasted = parseFloat(wastageForm.wasted);
    
    if (isNaN(cooked) || cooked < 0) {
      setFormErrors({ cooked: 'Please enter a valid cooked amount' });
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Please enter a valid cooked amount.', type: 'error', duration: 3000, id: Date.now() }
      }));
      return;
    }
    
    if (isNaN(wasted) || wasted < 0) {
      setFormErrors({ wasted: 'Please enter a valid wasted amount' });
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Please enter a valid wasted amount.', type: 'error', duration: 3000, id: Date.now() }
      }));
      return;
    }
    
    if (wasted > cooked) {
      setFormErrors({ wasted: 'Wasted amount cannot exceed cooked amount' });
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Wasted amount cannot exceed cooked amount.', type: 'error', duration: 3000, id: Date.now() }
      }));
      return;
    }
    
    setFormErrors({});
    
    setSubmitting(true);
    try {
      await submitWastage(cooked, wasted);
      setWastageForm({ cooked: '', wasted: '' });
      
      // Show success toast
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Food wastage recorded successfully!', type: 'success', duration: 2000, id: Date.now() }
      }));
      
      // Refresh wastage data
      const wastageRes = await getWastageData();
      setWastageData(wastageRes.data);
      
      // Trigger wastage update event for all students
      window.dispatchEvent(new Event('wastageUpdated'));
      
      // Also dispatch to localStorage for cross-tab communication
      localStorage.setItem('wastageLastUpdated', Date.now().toString());
    } catch (error) {
      console.error('Error submitting wastage:', error);
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Failed to record wastage. Please try again.', type: 'error', duration: 3000, id: Date.now() }
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setUploadMessage({
        type: 'error',
        text: 'Invalid file type. Please upload an Excel file (.xlsx, .xls) or CSV file.',
      });
      return;
    }

    setUploading(true);
    setUploadMessage({ type: '', text: '' });

    try {
      // Use API service which handles authentication
      const result = await updateMenuFromExcel(file);
      
      if (result.success) {
        // Build message with warnings if any
        let message = result.message || 'Menu uploaded successfully! The menu has been updated. Student view will refresh automatically.';
        
        if (result.warnings && result.warnings.length > 0) {
          message += `\n\n⚠️ Warnings:\n${result.warnings.map(w => `• ${w}`).join('\n')}`;
        }
        
        if (result.stats) {
          message += `\n\n📊 Upload Summary:\n• Days found: ${result.stats.daysFound}/7\n• Total items: ${result.stats.totalItems}`;
          if (result.stats.daysMissing > 0) {
            message += `\n• Missing days: ${result.stats.daysMissing}`;
          }
        }
        
        setUploadMessage({
          type: result.warnings && result.warnings.length > 0 ? 'warning' : 'success',
          text: message,
        });
        
        // Show toast notification
        const toastType = result.warnings && result.warnings.length > 0 ? 'warning' : 'success';
        window.dispatchEvent(new CustomEvent('showToast', {
          detail: { 
            message: result.warnings && result.warnings.length > 0 
              ? `Menu uploaded with ${result.warnings.length} warning(s). Check details below.`
              : 'Menu uploaded successfully!', 
            type: toastType, 
            duration: result.warnings && result.warnings.length > 0 ? 5000 : 3000, 
            id: Date.now() 
          }
        }));
      } else {
        throw new Error(result.error || 'Failed to upload menu');
      }
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh analytics after a short delay
      setTimeout(() => {
        fetchData();
      }, 1000);
      
      // Trigger menu update event for all students
      window.dispatchEvent(new Event('menuUpdated'));
      
      // Also dispatch to localStorage for cross-tab communication
      localStorage.setItem('menuLastUpdated', Date.now().toString());
    } catch (error) {
      console.error('Error uploading menu:', error);
      
      // Extract detailed error message
      let errorMessage = error.message || 'Failed to upload menu';
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.error) {
          errorMessage = errorData.error;
        }
        if (errorData.warnings && errorData.warnings.length > 0) {
          errorMessage += `\n\n⚠️ Warnings:\n${errorData.warnings.map(w => `• ${w}`).join('\n')}`;
        }
        if (errorData.stats) {
          errorMessage += `\n\n📊 Stats:\n• Days found: ${errorData.stats.daysFound || 0}/7\n• Total items: ${errorData.stats.totalItems || 0}`;
        }
      }
      
      setUploadMessage({
        type: 'error',
        text: `Failed to upload menu: ${errorMessage}`,
      });
      
      // Show error toast
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { 
          message: error.response?.data?.error || error.message || 'Failed to upload menu. Please check the file format.', 
          type: 'error', 
          duration: 6000, 
          id: Date.now() 
        }
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleManualMenuSubmit = async (e) => {
    e.preventDefault();
    if (!manualMenuForm.foodName.trim()) {
      setMenuMessage({ type: 'error', text: 'Please enter a food name' });
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Please enter a food name', type: 'error', duration: 2000, id: Date.now() }
      }));
      return;
    }
    
    if (manualMenuForm.foodName.trim().length < 2) {
      setFormErrors({ foodName: 'Food name must be at least 2 characters' });
      setMenuMessage({ type: 'error', text: 'Food name must be at least 2 characters' });
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Food name must be at least 2 characters', type: 'error', duration: 2000, id: Date.now() }
      }));
      return;
    }
    
    setFormErrors({});

    setAddingMenuItem(true);
    setMenuMessage({ type: '', text: '' });
    try {
      await addManualMenuItem(manualMenuForm.day, manualMenuForm.meal, manualMenuForm.foodName.trim());
      setMenuMessage({ type: 'success', text: 'Menu item added successfully!' });
      setManualMenuForm({ ...manualMenuForm, foodName: '' });
      
      // Show success toast
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Menu item added successfully!', type: 'success', duration: 2000, id: Date.now() }
      }));
      
      // Refresh data
      setTimeout(() => {
        fetchData();
      }, 500);
      
      // Trigger menu update event for all students
      window.dispatchEvent(new Event('menuUpdated'));
      
      // Also dispatch to localStorage for cross-tab communication
      localStorage.setItem('menuLastUpdated', Date.now().toString());
    } catch (error) {
      console.error('Error adding menu item:', error);
      setMenuMessage({ type: 'error', text: 'Failed to add menu item' });
      
      // Show error toast
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Failed to add menu item. Please try again.', type: 'error', duration: 3000, id: Date.now() }
      }));
    } finally {
      setAddingMenuItem(false);
      setTimeout(() => setMenuMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDeleteComment = async (foodId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteComment(foodId, commentId);
      // Refresh disliked issues
      const issuesRes = await getDislikedFoodIssues();
      setDislikedIssues(issuesRes.data);
      // Refresh analytics
      const analyticsRes = await getAnalytics();
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatMealName = (meal) => {
    return meal.charAt(0).toUpperCase() + meal.slice(1);
  };

  const formatDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  // Generate PDF from menu data
  const generateMenuPDF = async () => {
    if (!menuData) {
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'No menu data available. Please upload or add menu items first.', type: 'error', duration: 3000, id: Date.now() }
      }));
      return;
    }

    setDownloadingPDF(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;
      const margin = 15;
      const lineHeight = 7;
      const sectionSpacing = 10;

      // Header
      pdf.setFontSize(20);
      pdf.setFont(undefined, 'bold');
      pdf.text('Weekly Menu', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      const currentDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      pdf.text(`Generated on: ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += sectionSpacing;

      // Day order
      const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const mealOrder = ['breakfast', 'lunch', 'snacks', 'dinner'];
      const mealLabels = {
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        snacks: 'Snacks',
        dinner: 'Dinner'
      };

      // Iterate through each day
      dayOrder.forEach((day, dayIndex) => {
        const dayData = menuData[day];
        if (!dayData) return;

        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }

        // Day Header
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(30, 58, 138); // Navy color
        pdf.text(formatDayName(day), margin, yPosition);
        yPosition += lineHeight + 2;

        // Date if available
        if (dayData.date) {
          pdf.setFontSize(10);
          pdf.setFont(undefined, 'italic');
          pdf.setTextColor(100, 100, 100);
          const dateStr = new Date(dayData.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
          pdf.text(`Date: ${dateStr}`, margin, yPosition);
          yPosition += lineHeight;
        }

        // Iterate through each meal
        mealOrder.forEach((meal) => {
          const mealItems = dayData[meal];
          if (!mealItems || !Array.isArray(mealItems) || mealItems.length === 0) return;

          // Check if we need a new page
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 20;
          }

          // Meal Header
          pdf.setFontSize(12);
          pdf.setFont(undefined, 'bold');
          pdf.setTextColor(0, 0, 0);
          pdf.text(`  ${mealLabels[meal]}:`, margin + 5, yPosition);
          yPosition += lineHeight;

          // Food items
          pdf.setFontSize(10);
          pdf.setFont(undefined, 'normal');
          mealItems.forEach((item) => {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(`    • ${item.name}`, margin + 10, yPosition);
            yPosition += lineHeight;
          });

          yPosition += 2; // Small spacing between meals
        });

        yPosition += sectionSpacing; // Spacing between days
      });

      // Footer
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Page ${i} of ${totalPages} - SortMyHostel Menu`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Generate filename with current date
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const filename = `Weekly_Menu_${dateStr}.pdf`;

      // Save PDF
      pdf.save(filename);

      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Menu PDF downloaded successfully!', type: 'success', duration: 3000, id: Date.now() }
      }));
    } catch (error) {
      console.error('Error generating PDF:', error);
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Failed to generate PDF. Please try again.', type: 'error', duration: 3000, id: Date.now() }
      }));
    } finally {
      setDownloadingPDF(false);
    }
  };

  // Get all comments from all disliked items
  const getAllComments = () => {
    const allComments = [];
    dislikedIssues.forEach((issue) => {
      if (issue.comments && issue.comments.length > 0) {
        issue.comments.forEach((comment) => {
          allComments.push({
            ...comment,
            foodName: issue.foodName,
            foodId: issue.foodId,
            day: issue.day,
            meal: issue.meal,
            date: issue.date,
            dislikes: issue.dislikes,
            likes: issue.likes,
          });
        });
      }
    });
    // Sort by timestamp (newest first)
    return allComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Group comments hierarchically: Day → Meal → Food → Comments
  const getGroupedCommentsByDayMeal = () => {
    const grouped = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    dislikedIssues.forEach((issue) => {
      if (issue.comments && issue.comments.length > 0) {
        const day = issue.day;
        const meal = issue.meal;
        const foodKey = `${issue.foodId}-${day}-${meal}`;
        
        // Initialize day if not exists
        if (!grouped[day]) {
          grouped[day] = {};
        }
        
        // Initialize meal if not exists
        if (!grouped[day][meal]) {
          grouped[day][meal] = [];
        }
        
        // Check if food already exists in this meal
        let foodItem = grouped[day][meal].find(f => f.foodId === issue.foodId);
        
        if (!foodItem) {
          foodItem = {
            foodName: issue.foodName,
            foodId: issue.foodId,
            day: issue.day,
            meal: issue.meal,
            date: issue.date,
            likes: issue.likes,
            dislikes: issue.dislikes,
            comments: [],
            commentIds: [],
            commentTimestamps: [],
            newestCommentDate: null,
          };
          grouped[day][meal].push(foodItem);
        }
        
        // Add comments to food item with timestamps
        issue.comments.forEach((comment) => {
          const commentDate = new Date(comment.timestamp);
          foodItem.comments.push(comment.text);
          foodItem.commentIds.push(comment.id);
          foodItem.commentTimestamps.push(comment.timestamp);
          
          // Track newest comment date
          if (!foodItem.newestCommentDate || commentDate > new Date(foodItem.newestCommentDate)) {
            foodItem.newestCommentDate = comment.timestamp;
          }
        });
      }
    });
    
    // Sort comments within each food item by newest first
    Object.keys(grouped).forEach(day => {
      Object.keys(grouped[day]).forEach(meal => {
        grouped[day][meal].forEach(foodItem => {
          // Create array of indices sorted by timestamp (newest first)
          const sortedIndices = foodItem.commentTimestamps
            .map((ts, idx) => ({ ts, idx }))
            .sort((a, b) => new Date(b.ts) - new Date(a.ts))
            .map(item => item.idx);
          
          // Reorder comments, commentIds, and timestamps
          foodItem.comments = sortedIndices.map(idx => foodItem.comments[idx]);
          foodItem.commentIds = sortedIndices.map(idx => foodItem.commentIds[idx]);
          foodItem.commentTimestamps = sortedIndices.map(idx => foodItem.commentTimestamps[idx]);
        });
      });
    });
    
    // Get today's day name
    const todayDayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const mealOrder = ['breakfast', 'lunch', 'snacks', 'dinner'];
    
    // Separate today's items and other items
    const todayItems = [];
    const otherItems = [];
    
    dayOrder.forEach(day => {
      if (grouped[day]) {
        mealOrder.forEach(meal => {
          if (grouped[day][meal] && grouped[day][meal].length > 0) {
            // Sort foods by newest comment date (newest first), then by dislikes
            const sortedFoods = grouped[day][meal].sort((a, b) => {
              const aDate = a.newestCommentDate ? new Date(a.newestCommentDate) : new Date(0);
              const bDate = b.newestCommentDate ? new Date(b.newestCommentDate) : new Date(0);
              
              // First sort by newest comment date (newest first)
              if (bDate.getTime() !== aDate.getTime()) {
                return bDate.getTime() - aDate.getTime();
              }
              
              // Then by dislikes (highest first)
              return b.dislikes - a.dislikes;
            });
            
            const item = {
              day,
              meal,
              foods: sortedFoods,
              newestCommentDate: sortedFoods[0]?.newestCommentDate || null,
            };
            
            if (day === todayDayName) {
              todayItems.push(item);
            } else {
              otherItems.push(item);
            }
          }
        });
      }
    });
    
    // Sort today's items by newest comment first
    todayItems.sort((a, b) => {
      if (!a.newestCommentDate && !b.newestCommentDate) return 0;
      if (!a.newestCommentDate) return 1;
      if (!b.newestCommentDate) return -1;
      return new Date(b.newestCommentDate) - new Date(a.newestCommentDate);
    });
    
    // Sort other items by newest comment first
    otherItems.sort((a, b) => {
      if (!a.newestCommentDate && !b.newestCommentDate) return 0;
      if (!a.newestCommentDate) return 1;
      if (!b.newestCommentDate) return -1;
      return new Date(b.newestCommentDate) - new Date(a.newestCommentDate);
    });
    
    // Return today's items first, then others
    return [...todayItems, ...otherItems];
  };

  // Prepare chart data for likes vs dislikes
  const chartData = analytics?.foodItems
    ?.map(item => ({
      name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
      fullName: item.name,
      likes: item.likes,
      dislikes: item.dislikes,
    }))
    .sort((a, b) => (b.likes + b.dislikes) - (a.likes + a.dislikes))
    .slice(0, 10) || [];

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E5E7EB' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-background-pattern"></div>
        <div className="container">
          <div className="admin-header-content">
            <div className="header-brand">
              <div className="header-logo">
                <img src="/logo.png" alt="SortMyHostel Logo" className="logo-image" />
              </div>
              <div className="header-title-group">
                <h1 className="admin-header-title">SortMyHostel Admin</h1>
                <p className="admin-header-subtitle">Dashboard & Analytics</p>
              </div>
            </div>
            <div className="admin-header-actions">
              <Link to="/" className="admin-header-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Student View</span>
              </Link>
              <button onClick={handleLogout} className="admin-header-link admin-logout-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="admin-main container">
        {/* Analytics Cards */}
        <div className="analytics-grid">
          <div className="analytics-card analytics-card-green">
            <h3 className="analytics-card-label">Most Liked Food</h3>
            <p className="analytics-card-value">{analytics?.mostLiked?.name || 'N/A'}</p>
            <p className="analytics-card-subtext">
              {analytics?.mostLiked?.likes || 0} likes
            </p>
          </div>

          <div className="analytics-card analytics-card-red">
            <h3 className="analytics-card-label">Most Disliked Food</h3>
            <p className="analytics-card-value">{analytics?.mostDisliked?.name || 'N/A'}</p>
            <p className="analytics-card-subtext">
              {analytics?.mostDisliked?.dislikes || 0} dislikes
            </p>
          </div>

          <div className="analytics-card analytics-card-blue">
            <h3 className="analytics-card-label">Total Feedback</h3>
            <p className="analytics-card-value">{analytics?.totalFeedback || 0}</p>
            <p className="analytics-card-subtext">Total responses</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Likes vs Dislikes Chart */}
          <div className="chart-container">
            <h2 className="chart-title">Likes vs Dislikes (Top 10)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="likes" fill="#10b981" name="Likes" />
                <Bar dataKey="dislikes" fill="#ef4444" name="Dislikes" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Food Wastage Chart */}
          <div className="chart-container">
            <h2 className="chart-title">Food Wastage (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={wastageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cooked" stroke="#3b82f6" name="Cooked (kg)" />
                <Line type="monotone" dataKey="wasted" stroke="#ef4444" name="Wasted (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disliked Food Issues Section */}
        <div className="disliked-issues-section">
          <div className="issues-section-header">
            <h2 className="chart-title">Disliked Food Issues & Comments</h2>
            <p className="issues-section-subtitle">
              All comments from disliked food items ({getAllComments().length} total comments)
            </p>
          </div>

          {getGroupedCommentsByDayMeal().length === 0 ? (
            <div className="no-issues-message">
              <p>No comments found for disliked items.</p>
            </div>
          ) : (
            <div className="all-comments-list">
              {getGroupedCommentsByDayMeal().map((dayMealGroup, dayMealIndex) => (
                <div key={`${dayMealGroup.day}-${dayMealGroup.meal}-${dayMealIndex}`} className="day-meal-group">
                  <div className="day-meal-header">
                    <h3 className="day-meal-title">
                      <span className="day-title">{formatDayName(dayMealGroup.day)}</span>
                      <span className="meal-title">{formatMealName(dayMealGroup.meal)}</span>
                    </h3>
                  </div>
                  <div className="foods-list">
                    {dayMealGroup.foods.map((food, foodIndex) => (
                      <div key={`${food.foodId}-${foodIndex}`} className="comment-item comment-item-grouped">
                        <div className="comment-header">
                          <div className="comment-food-info">
                            <h4 className="comment-food-name">{food.foodName}</h4>
                            {food.date && (
                              <span className="comment-date">{formatDate(food.date)}</span>
                            )}
                          </div>
                          <div className="comment-stats">
                            <span className="comment-stat comment-stat-like">
                              <span className="comment-icon-like">👍</span> {food.likes}
                            </span>
                            <span className="comment-stat comment-stat-dislike">
                              <span className="comment-icon-dislike">👎</span> {food.dislikes}
                            </span>
                            <span className="comment-count-badge">
                              {food.comments.length} {food.comments.length === 1 ? 'comment' : 'comments'}
                            </span>
                          </div>
                        </div>
                        <div className="comment-text-grouped">
                          {food.comments.map((commentText, commentIndex) => (
                            <span key={commentIndex} className="comment-text-inline">
                              "{commentText}"
                              {commentIndex < food.comments.length - 1 && <span className="comment-separator">, </span>}
                            </span>
                          ))}
                        </div>
                        <div className="comment-footer">
                          <span className="comment-time">
                            {food.comments.length} {food.comments.length === 1 ? 'comment' : 'comments'} total
                          </span>
                          <div className="comment-delete-group">
                            {food.commentIds.map((commentId, idx) => (
                              <button
                                key={commentId}
                                onClick={() => handleDeleteComment(food.foodId, commentId)}
                                className="delete-comment-button delete-comment-inline"
                                title={`Delete comment: ${food.comments[idx]}`}
                              >
                                Delete {idx + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu Upload Section */}
        <div className="upload-section">
          <h2 className="chart-title">Upload Weekly Menu (Excel)</h2>
          <div 
            className="upload-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <svg
              className="upload-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="upload-text">
              Click to upload or drag and drop your weekly menu Excel file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="menu-file-input"
              disabled={uploading}
            />
            <label 
              htmlFor="menu-file-input" 
              className={`upload-button ${uploading ? 'disabled' : ''}`}
              style={{ pointerEvents: uploading ? 'none' : 'auto' }}
            >
              {uploading ? 'Uploading...' : 'Choose Excel File'}
            </label>
            <p className="upload-hint">Excel files (.xlsx, .xls) or CSV files accepted</p>
            
            {uploadMessage.text && (
              <div className={`upload-message ${uploadMessage.type}`}>
                {uploadMessage.text}
              </div>
            )}
          </div>
        </div>

        {/* Manual Menu Entry Section */}
        <div className="manual-menu-section">
          <div className="manual-menu-header">
            <h2 className="chart-title">Add Menu Item Manually</h2>
            <button
              onClick={generateMenuPDF}
              disabled={downloadingPDF || !menuData}
              className="download-pdf-button"
              title="Download menu as PDF"
            >
              {downloadingPDF ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="spinning">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.416" strokeDashoffset="31.416">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download Menu PDF
                </>
              )}
            </button>
          </div>
          <form onSubmit={handleManualMenuSubmit} className="manual-menu-form">
            <div className="manual-menu-form-row">
              <div className="manual-menu-form-group">
                <label className="manual-menu-label">Day</label>
                <select
                  value={manualMenuForm.day}
                  onChange={(e) => setManualMenuForm({ ...manualMenuForm, day: e.target.value })}
                  className="manual-menu-select"
                  required
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>
              <div className="manual-menu-form-group">
                <label className="manual-menu-label">Meal</label>
                <select
                  value={manualMenuForm.meal}
                  onChange={(e) => setManualMenuForm({ ...manualMenuForm, meal: e.target.value })}
                  className="manual-menu-select"
                  required
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="snacks">Snacks</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
              <div className="manual-menu-form-group manual-menu-form-group-flex">
                <label className="manual-menu-label">Food Name</label>
                <div className="food-name-input-group">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        setManualMenuForm({ ...manualMenuForm, foodName: e.target.value });
                        if (formErrors.foodName) {
                          setFormErrors({ ...formErrors, foodName: '' });
                        }
                        e.target.value = ''; // Reset dropdown after selection
                      }
                    }}
                    className="common-items-dropdown"
                    aria-label="Select common item"
                  >
                    <option value="">Quick Add (Common Items)</option>
                    {commonItems.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <span className="input-divider">or</span>
                  <input
                    type="text"
                    value={manualMenuForm.foodName}
                    onChange={(e) => {
                      setManualMenuForm({ ...manualMenuForm, foodName: e.target.value });
                      if (formErrors.foodName) {
                        setFormErrors({ ...formErrors, foodName: '' });
                      }
                    }}
                    className={`manual-menu-input ${formErrors.foodName ? 'input-error' : ''}`}
                    placeholder="Type custom food name"
                    required
                    aria-invalid={!!formErrors.foodName}
                    aria-describedby={formErrors.foodName ? 'foodName-error' : undefined}
                  />
                </div>
                {formErrors.foodName && (
                  <span id="foodName-error" className="error-message">
                    {formErrors.foodName}
                  </span>
                )}
              </div>
              <div className="manual-menu-form-submit">
                <button
                  type="submit"
                  disabled={addingMenuItem}
                  className="manual-menu-button"
                >
                  {addingMenuItem ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </div>
            {menuMessage.text && (
              <div className={`manual-menu-message ${menuMessage.type}`}>
                {menuMessage.text}
              </div>
            )}
          </form>
        </div>

        {/* Wastage Input Form */}
        <div className="wastage-form-section">
          <h2 className="chart-title">Record Food Wastage</h2>
          <form onSubmit={handleWastageSubmit} className="wastage-form">
            <div className="wastage-form-group">
              <label className="wastage-form-label">
                Cooked Food (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={wastageForm.cooked}
                onChange={(e) => {
                  setWastageForm({ ...wastageForm, cooked: e.target.value });
                  if (formErrors.cooked) {
                    setFormErrors({ ...formErrors, cooked: '' });
                  }
                }}
                className={`wastage-form-input ${formErrors.cooked ? 'input-error' : ''}`}
                placeholder="Enter amount"
                required
                aria-invalid={!!formErrors.cooked}
                aria-describedby={formErrors.cooked ? 'cooked-error' : undefined}
              />
              {formErrors.cooked && (
                <span id="cooked-error" className="error-message">
                  {formErrors.cooked}
                </span>
              )}
            </div>
            <div className="wastage-form-group">
              <label className="wastage-form-label">
                Wasted Food (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={wastageForm.wasted}
                onChange={(e) => {
                  setWastageForm({ ...wastageForm, wasted: e.target.value });
                  if (formErrors.wasted) {
                    setFormErrors({ ...formErrors, wasted: '' });
                  }
                }}
                className={`wastage-form-input ${formErrors.wasted ? 'input-error' : ''}`}
                placeholder="Enter amount"
                required
                aria-invalid={!!formErrors.wasted}
                aria-describedby={formErrors.wasted ? 'wasted-error' : undefined}
              />
              {formErrors.wasted && (
                <span id="wasted-error" className="error-message">
                  {formErrors.wasted}
                </span>
              )}
            </div>
            <div className="wastage-form-submit">
              <button
                type="submit"
                disabled={submitting}
                className="wastage-submit-button"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
    );
};

export default AdminDashboard;

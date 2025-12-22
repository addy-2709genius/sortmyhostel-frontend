import { useState, useEffect, useMemo } from 'react';
import { getAllComments } from '../services/api';
import { CommentCardSkeleton } from './SkeletonLoader';
import '../styles/studentIssues.css';

const StudentIssues = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mealFilter, setMealFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');

  useEffect(() => {
    fetchComments();
  }, []);

  const getSentiment = (likes, dislikes) => {
    const total = likes + dislikes;
    if (total === 0) return 'mixed';
    const likeRatio = likes / total;
    
    if (likeRatio >= 0.6) return 'liked';
    if (likeRatio <= 0.4) return 'disliked';
    return 'mixed';
  };

  // Memoize filtered comments for performance
  const filteredComments = useMemo(() => {
    let filtered = [...comments];

    // Apply meal filter
    if (mealFilter !== 'all') {
      filtered = filtered.filter(comment => comment.meal === mealFilter);
    }

    // Apply sentiment filter
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(comment => {
        const sentiment = getSentiment(comment.likes, comment.dislikes);
        return sentiment === sentimentFilter;
      });
    }

    return filtered;
  }, [comments, mealFilter, sentimentFilter]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await getAllComments();
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };


  const getSentimentBadge = (likes, dislikes) => {
    const sentiment = getSentiment(likes, dislikes);
    const badgeClass = `sentiment-badge sentiment-${sentiment}`;
    const badgeText = sentiment === 'liked' ? 'Liked' : sentiment === 'disliked' ? 'Disliked' : 'Mixed';
    
    return <span className={badgeClass}>{badgeText}</span>;
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

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="student-issues-section">
        <div className="student-issues-header">
          <div className="header-content">
            <h2 className="student-issues-title">Community Feedback</h2>
            <p className="student-issues-subtitle">Loading...</p>
          </div>
        </div>
        <div className="comments-feed">
          <CommentCardSkeleton />
          <CommentCardSkeleton />
          <CommentCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="student-issues-section">
      <div className="student-issues-header">
        <div className="header-content">
          <h2 className="student-issues-title">Community Feedback</h2>
          <p className="student-issues-subtitle">
            {filteredComments.length} {filteredComments.length === 1 ? 'comment' : 'comments'}
          </p>
        </div>
        
        {/* Filters */}
        <div className="feedback-filters">
          <div className="filter-group">
            <label className="filter-label">Meal:</label>
            <select 
              value={mealFilter} 
              onChange={(e) => setMealFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Meals</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="snacks">Snacks</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Sentiment:</label>
            <select 
              value={sentimentFilter} 
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="liked">Liked</option>
              <option value="disliked">Disliked</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>
      </div>

      {filteredComments.length === 0 ? (
        <div className="empty-state-enhanced">
          <div className="empty-state-icon">💬</div>
          <h3>No comments found</h3>
          <p>
            {comments.length === 0
              ? "Be the first to share your feedback about today's menu!"
              : `No comments match your current filters. Try adjusting the filters above.`}
          </p>
          {comments.length === 0 && (
            <button
              onClick={() => {
                const menuSection = document.querySelector('.menu-container');
                if (menuSection) {
                  menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="empty-state-button"
            >
              View Today's Menu
            </button>
          )}
        </div>
      ) : (
        <div className="comments-feed">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div className="comment-card-header">
                <div className="comment-food-info">
                  <h3 className="comment-food-name">{comment.foodName}</h3>
                  <div className="comment-meta">
                    <span className="comment-day-meal">
                      {formatDayName(comment.day)} • {formatMealName(comment.meal)}
                    </span>
                    {comment.date && (
                      <span className="comment-date">{formatDate(comment.date)}</span>
                    )}
                  </div>
                </div>
                {getSentimentBadge(comment.likes, comment.dislikes)}
              </div>
              
              <div className="comment-content">
                <p className="comment-text">"{comment.text}"</p>
              </div>
              
              <div className="comment-card-footer">
                <div className="comment-stats">
                  <span className="comment-stat comment-stat-like">
                    <span className="comment-icon-like">👍</span> {comment.likes}
                  </span>
                  <span className="comment-stat comment-stat-dislike">
                    <span className="comment-icon-dislike">👎</span> {comment.dislikes}
                  </span>
                </div>
                <span className="comment-timestamp">{formatTimestamp(comment.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentIssues;


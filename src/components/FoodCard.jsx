import { useState, useEffect } from 'react';
import { submitFeedback, submitComment } from '../services/api';
import { hasUserVoted, getUserVote, saveUserVote } from '../utils/storage';
import '../styles/foodCard.css';

const FoodCard = ({ food, onUpdate, isCurrentDay = false }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localLikes, setLocalLikes] = useState(food.likes);
  const [localDislikes, setLocalDislikes] = useState(food.dislikes);
  const userVote = getUserVote(food.id);
  const hasVoted = hasUserVoted(food.id);
  
  // Disable interactions if not current day
  const canInteract = isCurrentDay;

  // Close comment box when switching to non-current day
  useEffect(() => {
    if (!isCurrentDay) {
      setShowCommentBox(false);
      setComment('');
    }
  }, [isCurrentDay]);

  const handleLike = async () => {
    if (!canInteract || hasVoted) return; // Can't interact if not current day or already voted
    
    setIsSubmitting(true);
    try {
      // If user previously disliked, remove that dislike
      if (userVote === 'dislike') {
        setLocalDislikes(prev => Math.max(0, prev - 1));
      }
      
      // Add like
      setLocalLikes(prev => prev + 1);
      await submitFeedback(food.id, 'like');
      saveUserVote(food.id, 'like');
      
      // Show success toast
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: `You liked ${food.name}!`, type: 'success', duration: 2000, id: Date.now() }
      }));
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error submitting like:', error);
      // Show error toast
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Failed to submit feedback. Please try again.', type: 'error', duration: 3000, id: Date.now() }
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDislike = async () => {
    if (!canInteract || hasVoted) return; // Can't interact if not current day or already voted
    
    setIsSubmitting(true);
    try {
      // If user previously liked, remove that like
      if (userVote === 'like') {
        setLocalLikes(prev => Math.max(0, prev - 1));
      }
      
      // Add dislike
      setLocalDislikes(prev => prev + 1);
      await submitFeedback(food.id, 'dislike');
      saveUserVote(food.id, 'dislike');
      
      // Auto-open comment box when disliked
      setShowCommentBox(true);
      
      // Show info toast
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Please share what went wrong to help us improve.', type: 'info', duration: 3000, id: Date.now() }
      }));
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error submitting dislike:', error);
      // Show error toast
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Failed to submit feedback. Please try again.', type: 'error', duration: 3000, id: Date.now() }
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const trimmedComment = comment.trim();
    
    // Minimum comment length validation (5 characters)
    if (!canInteract || !trimmedComment || trimmedComment.length < 5) {
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Comment must be at least 5 characters long.', type: 'error', duration: 2000, id: Date.now() }
      }));
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitComment(food.id, trimmedComment);
      setComment('');
      setShowCommentBox(false);
      
      // Show success toast
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Thank you for your feedback!', type: 'success', duration: 2000, id: Date.now() }
      }));
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Show error toast
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Failed to submit comment. Please try again.', type: 'error', duration: 3000, id: Date.now() }
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`food-card ${!canInteract ? 'food-card-disabled' : ''}`}>
      <h3 className="food-card-title">
        {food.name}
        {!canInteract && <span className="view-only-badge">View Only</span>}
      </h3>
      
      {!canInteract && (
        <div className="feedback-disabled-message">
          <p>Feedback is only available for today's menu</p>
        </div>
      )}
      
      <div className="food-card-actions">
        <button
          onClick={handleLike}
          disabled={!canInteract || isSubmitting || hasVoted}
          className={`food-card-button like-button ${userVote === 'like' ? 'active' : ''} ${!canInteract ? 'disabled' : ''}`}
          aria-label={`Like ${food.name}`}
          aria-pressed={userVote === 'like'}
          aria-disabled={!canInteract || isSubmitting || hasVoted}
        >
          {userVote === 'like' ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a1 1 0 001.581.814l3.69-2.276a1 1 0 00.484-.814v-3.5a1 1 0 00-.484-.814L7.581 7.519A1 1 0 006 8.333v2zM14 9.5a1.5 1.5 0 00-3 0v6a1.5 1.5 0 003 0v-6z" />
            </svg>
          )}
          <span>
            {userVote === 'like' ? 'You liked this' : 'Like'}
          </span>
          <span className="count-badge">
            {localLikes}
          </span>
        </button>

        <button
          onClick={handleDislike}
          disabled={!canInteract || isSubmitting || hasVoted}
          className={`food-card-button dislike-button ${userVote === 'dislike' ? 'active' : ''} ${!canInteract ? 'disabled' : ''}`}
          aria-label={`Dislike ${food.name}`}
          aria-pressed={userVote === 'dislike'}
          aria-disabled={!canInteract || isSubmitting || hasVoted}
        >
          {userVote === 'dislike' ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 9.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 9.333v5.834a1 1 0 001.581.814l3.69-2.276a1 1 0 00.484-.814v-3.5a1 1 0 00-.484-.814L7.581 6.519A1 1 0 006 7.333v2zM14 8.5a1.5 1.5 0 00-3 0v6a1.5 1.5 0 003 0v-6z" />
            </svg>
          )}
          <span>
            {userVote === 'dislike' ? 'You disliked this' : 'Dislike'}
          </span>
          <span className="count-badge">
            {localDislikes}
          </span>
        </button>
      </div>

      <button
        onClick={() => canInteract && setShowCommentBox(!showCommentBox)}
        disabled={!canInteract}
        className={`comment-button ${!canInteract ? 'disabled' : ''}`}
        aria-label={showCommentBox ? 'Close comment form' : 'Add comment'}
        aria-expanded={showCommentBox}
      >
        {showCommentBox 
          ? 'Close' 
          : userVote === 'like' 
            ? 'What should we improve?' 
            : userVote === 'dislike'
              ? 'Tell us what went wrong'
              : 'Add Comment'
        }
      </button>

      {showCommentBox && canInteract && (
        <form onSubmit={handleCommentSubmit} className="comment-form" aria-label="Comment form">
          <label htmlFor={`comment-${food.id}`} className="sr-only">
            Add your comment about {food.name}
          </label>
          <textarea
            id={`comment-${food.id}`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              userVote === 'like' 
                ? 'Example: "The taste was good, but could use more spices. Maybe add some green chilies next time?"' 
                : userVote === 'dislike'
                  ? 'Example: "The food was too salty and the texture was off. Please check the seasoning."'
                  : 'Example: "The portion size was good, but the temperature could be better. Overall decent meal."'
            }
            className={`comment-textarea ${comment.trim().length > 0 && comment.trim().length < 5 ? 'input-error' : ''}`}
            rows="4"
            disabled={!canInteract || isSubmitting}
            minLength={5}
            aria-invalid={comment.trim().length > 0 && comment.trim().length < 5}
            aria-describedby={comment.trim().length > 0 && comment.trim().length < 5 ? `comment-error-${food.id}` : undefined}
          />
          {comment.trim().length > 0 && comment.trim().length < 5 && (
            <span id={`comment-error-${food.id}`} className="error-message">
              Comment must be at least 5 characters (currently {comment.trim().length})
            </span>
          )}
          <div className="comment-form-footer">
            <span className="comment-length-hint">
              {comment.trim().length < 5 
                ? `Minimum 5 characters (${comment.trim().length}/5)`
                : `${comment.trim().length} characters`
              }
            </span>
            <button
              type="submit"
              disabled={!canInteract || isSubmitting || comment.trim().length < 5}
              className="comment-submit-button"
              aria-label="Submit feedback"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      )}

      {/* Display existing comments */}
      {food.comments && food.comments.length > 0 && (
        <div className="comments-section">
          <h4 className="comments-title">Comments ({food.comments.length})</h4>
          <div className="comments-list">
            {food.comments.map((comment) => (
              <div key={comment.id || comment.timestamp} className="comment-item">
                <p className="comment-text">{comment.text}</p>
                <span className="comment-timestamp">
                  {comment.timestamp 
                    ? new Date(comment.timestamp).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Recently'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodCard;

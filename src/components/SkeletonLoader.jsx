import '../styles/skeleton.css';

export const FoodCardSkeleton = () => (
  <div className="food-card-skeleton">
    <div className="skeleton skeleton-title"></div>
    <div className="skeleton skeleton-button"></div>
    <div className="skeleton skeleton-button"></div>
  </div>
);

export const CommentCardSkeleton = () => (
  <div className="comment-card-skeleton">
    <div className="skeleton skeleton-header"></div>
    <div className="skeleton skeleton-text"></div>
    <div className="skeleton skeleton-text short"></div>
    <div className="skeleton skeleton-footer"></div>
  </div>
);

export const MenuSkeleton = () => (
  <div className="menu-skeleton">
    <div className="skeleton skeleton-day-tabs"></div>
    <div className="skeleton-grid">
      <FoodCardSkeleton />
      <FoodCardSkeleton />
      <FoodCardSkeleton />
    </div>
  </div>
);





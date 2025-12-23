// Utility functions for localStorage
export const getAnonymousUserId = () => {
  let userId = localStorage.getItem('sortmenu_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sortmenu_user_id', userId);
  }
  return userId;
};

export const getUserVotes = () => {
  const votes = localStorage.getItem('sortmenu_votes');
  return votes ? JSON.parse(votes) : {};
};

export const saveUserVote = (foodId, voteType) => {
  const votes = getUserVotes();
  votes[foodId] = voteType;
  localStorage.setItem('sortmenu_votes', JSON.stringify(votes));
};

export const hasUserVoted = (foodId) => {
  const votes = getUserVotes();
  return votes.hasOwnProperty(foodId);
};

export const getUserVote = (foodId) => {
  const votes = getUserVotes();
  return votes[foodId] || null;
};








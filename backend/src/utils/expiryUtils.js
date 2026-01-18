// backend/src/utils/expiryUtils.js

const getFoodStatus = (freshUntil) => {
  const now = new Date();
  const expiryDate = new Date(freshUntil);

  const diffInHours = (expiryDate - now) / (1000 * 60 * 60);

  if (diffInHours <= 0) {
    return 'EXPIRED';
  }

  if (diffInHours <= 24) {
    return 'NEAR_EXPIRY';
  }

  return 'FRESH';
};

module.exports = { getFoodStatus };


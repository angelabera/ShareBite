const express = require('express');
const router = express.Router();
const {
  createFoodListing,
  getAllFoodListings,
  getFoodListingById,
  updateFoodListing,
  deleteFoodListing,
  getFoodSafetyStats
} = require('../controllers/foodListingController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllFoodListings);
router.get('/stats', getFoodSafetyStats);
router.get('/:id', getFoodListingById);

// Protected routes (require authentication)
router.post('/', protect, createFoodListing);
router.put('/:id', protect, updateFoodListing);
router.delete('/:id', protect, deleteFoodListing);

module.exports = router;
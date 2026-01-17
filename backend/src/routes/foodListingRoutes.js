const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
  createListing,
  getAllListings,
  getListingById,
  getNearbyListings,
  getCityListings,
  updateListing,
  deleteListing,
  claimListing,
} = require('../controllers/foodListingController');

const router = express.Router();

// 🔹 CREATE FOOD LISTING
router.post(
  '/',
  protect,
  [
    body('foodType').notEmpty().withMessage('Food type is required'),
    body('quantity').notEmpty().withMessage('Quantity is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('freshUntil').isISO8601().withMessage('Valid fresh until date is required'),
    body('pickupTime').notEmpty().withMessage('Pickup time is required'),
    body('pickupLocation').notEmpty().withMessage('Pickup location is required'),
    body('contactInfo').notEmpty().withMessage('Contact info is required'),
    body('dietaryTags').optional().isArray(),
    body('photos').optional().isArray(),

    body('latitude')
      .notEmpty()
      .withMessage('Latitude is required')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be valid'),

    body('longitude')
      .notEmpty()
      .withMessage('Longitude is required')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be valid'),
  ],
  createListing
);

// 🔹 SPECIAL ROUTES (STATIC — MUST COME FIRST)
router.get('/nearby', protect, getNearbyListings);
router.get('/city', protect, getCityListings);

// 🔹 GENERAL ROUTES (DYNAMIC — LAST)
router.put('/:id/claim', protect, claimListing);
router.get('/', getAllListings);
router.get('/:id', getListingById);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;

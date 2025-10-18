const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
} = require('../controllers/foodListingController');

const router = express.Router();

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
    body('photos').optional().isArray(),
  ],
  createListing
);

router.get('/', getAllListings);
router.get('/:id', getListingById);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;

router.post(
  '/',
  protect,
  [
    body('foodType').notEmpty().withMessage('Food type is required'),
    body('quantity').notEmpty().withMessage('Quantity is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('freshUntil').isISO8601().withMessage('Valid fresh until date is required'),
    body('pickupTime').notEmpty().withMessage('Pickup time is required'),
    body('description').optional().isString().trim(),
    body('pickupLocation').notEmpty().withMessage('Pickup location is required'),
    body('contactInfo').notEmpty().withMessage('Contact info is required'),
    body('dietaryTags').optional().isArray().withMessage('Dietary tags must be an array'),
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

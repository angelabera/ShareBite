const express = require('express');
const { body } = require('express-validator');
const { registerNgo, loginNgo } = require('../controllers/ngoAuthController');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('nickname').optional().isString(),
    body('availability').optional().isString(),
  ],
  registerNgo
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  loginNgo
);

module.exports = router;

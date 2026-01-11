const express = require('express');
const router = express.Router();
const {
  createClaim,
  getAllClaims,
  updateClaimStatus
} = require('../controllers/claimController');

router.post('/', createClaim);
router.get('/', getAllClaims);
router.put('/:id/status', updateClaimStatus);

module.exports = router;

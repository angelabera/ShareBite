const express = require('express');
const router = express.Router();
const FoodListing = require('../models/FoodListing');

/**
 * GET /api/impact/summary
 * Overall impact summary (all time)
 */
router.get('/summary', async (req, res) => {
  try {
    const completed = await FoodListing.find({ status: 'completed' });

    const totalFoodRescued = completed.reduce(
      (sum, item) => sum + parseInt(item.quantity || 0),
      0
    );

    const mealsSaved = totalFoodRescued * 4;

    res.json({
      totalFoodRescued,
      mealsSaved
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch impact summary' });
  }
});

/**
 * GET /api/impact/weekly
 * Impact for last 7 days
 */
router.get('/weekly', async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const completed = await FoodListing.find({
      status: 'completed',
      updatedAt: { $gte: startOfWeek }
    });

    const totalFoodRescued = completed.reduce(
      (sum, item) => sum + parseInt(item.quantity || 0),
      0
    );

    const mealsSaved = totalFoodRescued * 4;

    res.json({
      period: 'last_7_days',
      totalFoodRescued,
      mealsSaved
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch weekly impact' });
  }
});

/**
 * GET /api/impact/monthly
 * Impact for current month
 */
router.get('/monthly', async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);

    const completed = await FoodListing.find({
      status: 'completed',
      updatedAt: { $gte: startOfMonth }
    });

    const totalFoodRescued = completed.reduce(
      (sum, item) => sum + parseInt(item.quantity || 0),
      0
    );

    const mealsSaved = totalFoodRescued * 4;

    res.json({
      period: 'current_month',
      totalFoodRescued,
      mealsSaved
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch monthly impact' });
  }
});

module.exports = router;


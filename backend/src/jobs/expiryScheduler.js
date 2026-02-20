const cron = require('node-cron');
const FoodListing = require('../models/FoodListing');
const { getFoodStatus } = require('../utils/expiryUtils');

cron.schedule('0 * * * *', async () => {
  try {
    const foods = await FoodListing.find({ isActive: true });

    for (const food of foods) {
      const status = getFoodStatus(food.freshUntil);

      if (food.expiryStatus !== status) {
        food.expiryStatus = status;

        if (status === 'EXPIRED') {
          food.isActive = false;
        }

        await food.save();
      }
    }
  } catch (err) {
    console.error('Expiry scheduler error:', err);
  }
});


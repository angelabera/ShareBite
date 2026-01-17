const mongoose = require('mongoose');

const foodListingSchema = new mongoose.Schema(
  {
    dietaryTags: [{ type: String }],
    foodType: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    // Expiry date
    freshUntil: { type: Date, required: true },

    // Expiry tracking
    expiryStatus: {
      type: String,
      enum: ["FRESH", "NEAR_EXPIRY", "EXPIRED"],
      default: "FRESH"
    },

    isActive: {
      type: Boolean,
      default: true
    },
    pickupTime: { type: String, required: true },
    pickupLocation: { type: String, required: true, trim: true },
    contactInfo: { type: String, required: true, trim: true },
    photos: [{ type: String }],
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['available', 'reserved', 'completed'], 
      default: 'available' 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FoodListing', foodListingSchema);

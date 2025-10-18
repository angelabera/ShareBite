const mongoose = require('mongoose');

const foodListingSchema = new mongoose.Schema(
  {
    foodType: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    freshUntil: { type: Date, required: true },
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

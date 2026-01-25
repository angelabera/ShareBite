const mongoose = require('mongoose');

const foodListingSchema = new mongoose.Schema(
  {
    dietaryTags: [{ type: String }],
    foodType: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    freshUntil: { type: Date, required: true },
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
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      },
      city: {
        type: String,
        required: true
      }
    },
    contactInfo: { type: String, required: true, trim: true },
    photos: [{ type: String }],
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'completed'],
      default: 'available',
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
  },
  { timestamps: true }
);

// Enable geospatial queries
foodListingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('FoodListing', foodListingSchema);


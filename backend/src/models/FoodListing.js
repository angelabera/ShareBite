const mongoose = require('mongoose');

const foodListingSchema = new mongoose.Schema(
  {
    dietaryTags: [{ type: String }],
    foodType: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    freshUntil: { type: Date, required: true },
    pickupTime: { type: String, required: true },
    pickupLocation: { type: String, required: true, trim: true },

    //  ADD LOCATION HERE
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
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    status: { 
      type: String, 
      enum: ['available', 'reserved', 'completed'], 
      default: 'available' 
    },
  },
  { timestamps: true }
);

// VERY IMPORTANT (for distance queries)
foodListingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('FoodListing', foodListingSchema);

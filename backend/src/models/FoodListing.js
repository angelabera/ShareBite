const mongoose = require('mongoose');

const FoodListingSchema = new mongoose.Schema({
  // Basic Information
  foodType: {
    type: String,
    required: [true, 'Food type is required']
  },
  quantity: {
    type: String,
    required: [true, 'Quantity is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['restaurant', 'household', 'bakery', 'event']
  },
  description: {
    type: String,
    trim: true
  },
  
  // Pickup Information
  location: {
    type: String,
    required: [true, 'Pickup location is required']
  },
  contact: {
    type: String,
    required: [true, 'Contact information is required']
  },
  pickupTime: {
    type: String,
    required: [true, 'Pickup time is required']
  },
  freshUntil: {
    type: Date
  },
  
  // FOOD SAFETY FIELDS (NEW)
  preparedDate: {
    type: Date,
    required: [true, 'Preparation date is required']
  },
  preparedTime: {
    type: String,
    required: [true, 'Preparation time is required']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  expiryTime: {
    type: String,
    required: [true, 'Expiry time is required']
  },
  preparedDateTime: {
    type: Date,
    required: [true, 'Prepared date/time is required'],
    validate: {
      validator: function(v) {
        return v <= new Date();
      },
      message: 'Preparation date cannot be in the future'
    }
  },
  expiryDateTime: {
    type: Date,
    required: [true, 'Expiry date/time is required'],
    validate: {
      validator: function(v) {
        return v > this.preparedDateTime && v > new Date();
      },
      message: 'Expiry must be after preparation and in the future'
    }
  },
  storageCondition: {
    type: String,
    required: [true, 'Storage condition is required'],
    enum: {
      values: ['refrigerated', 'frozen', 'room_temp', 'hot_holding'],
      message: '{VALUE} is not a valid storage condition'
    }
  },
  allergens: [{
    type: String,
    enum: ['milk', 'eggs', 'peanuts', 'tree_nuts', 'soy', 'wheat', 'fish', 'shellfish', 'sesame']
  }],
  
  // Additional Fields
  dietary: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'nut-free', 'dairy-free']
  }],
  photo: {
    type: String
  },
  photoUrl: {
    type: String
  },
  
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donor: {
    type: String
  },
  
  // Status
  status: {
    type: String,
    default: 'available',
    enum: ['available', 'claimed', 'completed', 'expired']
  }
}, {
  timestamps: true
});

// Indexes for performance
FoodListingSchema.index({ expiryDateTime: 1 });
FoodListingSchema.index({ status: 1 });
FoodListingSchema.index({ category: 1 });
FoodListingSchema.index({ userId: 1 });

// Instance method to check if food is expired
FoodListingSchema.methods.isExpired = function() {
  return new Date() >= this.expiryDateTime;
};

// Static method to mark expired listings
FoodListingSchema.statics.markExpiredListings = async function() {
  const now = new Date();
  const result = await this.updateMany(
    { 
      expiryDateTime: { $lte: now }, 
      status: 'available' 
    },
    { 
      $set: { status: 'expired' } 
    }
  );
  return result;
};

// Pre-save middleware to auto-set preparedDateTime and expiryDateTime
FoodListingSchema.pre('save', function(next) {
  if (this.isModified('preparedDate') || this.isModified('preparedTime')) {
    this.preparedDateTime = new Date(`${this.preparedDate}T${this.preparedTime}`);
  }
  
  if (this.isModified('expiryDate') || this.isModified('expiryTime')) {
    this.expiryDateTime = new Date(`${this.expiryDate}T${this.expiryTime}`);
  }
  
  next();
});

module.exports = mongoose.model('FoodListing', FoodListingSchema);
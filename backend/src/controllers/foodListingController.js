const FoodListing = require('../models/FoodListing');

// Create new food listing with safety validation
exports.createFoodListing = async (req, res) => {
  try {
    const {
      foodType,
      quantity,
      category,
      description,
      location,
      contact,
      preparedDate,
      preparedTime,
      expiryDate,
      expiryTime,
      storageCondition,
      allergens,
      dietary,
      freshUntil,
      pickupTime,
      photo
    } = req.body;

    // Validate required fields
    if (!preparedDate || !preparedTime || !expiryDate || !expiryTime || !storageCondition) {
      return res.status(400).json({
        success: false,
        message: 'All food safety fields are required'
      });
    }

    // Combine date and time
    const preparedDateTime = new Date(`${preparedDate}T${preparedTime}`);
    const expiryDateTime = new Date(`${expiryDate}T${expiryTime}`);
    const now = new Date();

    // Server-side validation
    if (preparedDateTime > now) {
      return res.status(400).json({
        success: false,
        message: 'Preparation date cannot be in the future'
      });
    }

    if (expiryDateTime <= preparedDateTime) {
      return res.status(400).json({
        success: false,
        message: 'Expiry date must be after preparation date'
      });
    }

    if (expiryDateTime <= now) {
      return res.status(400).json({
        success: false,
        message: 'Cannot list food that has already expired'
      });
    }

    // Create new listing
    const foodListing = new FoodListing({
      foodType,
      quantity,
      category,
      description,
      location,
      contact,
      preparedDate,
      preparedTime,
      expiryDate,
      expiryTime,
      preparedDateTime,
      expiryDateTime,
      storageCondition,
      allergens: allergens || [],
      dietary: dietary || [],
      freshUntil,
      pickupTime,
      photo,
      userId: req.user?._id // Assuming you have auth middleware
    });

    await foodListing.save();

    res.status(201).json({
      success: true,
      message: 'Food listing created successfully',
      data: foodListing
    });

  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create food listing',
      error: error.message
    });
  }
};

// Get all available food listings (exclude expired)
exports.getAllFoodListings = async (req, res) => {
  try {
    // Mark expired listings
    await FoodListing.markExpiredListings();

    const { category, dietary, search } = req.query;
    
    let query = { status: 'available' };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (dietary) {
      query.dietary = { $in: dietary.split(',') };
    }

    if (search) {
      query.$or = [
        { foodType: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const listings = await FoodListing.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });

  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food listings',
      error: error.message
    });
  }
};

// Get single food listing with safety info
exports.getFoodListingById = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id)
      .populate('userId', 'name email phone');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found'
      });
    }

    // Check if expired
    if (listing.isExpired() && listing.status === 'available') {
      listing.status = 'expired';
      await listing.save();
    }

    res.status(200).json({
      success: true,
      data: listing
    });

  } catch (error) {
    console.error('Get listing by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food listing',
      error: error.message
    });
  }
};

// Update food listing
exports.updateFoodListing = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found'
      });
    }

    // Check if user owns this listing
    if (listing.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }

    // Update fields
    const updatedListing = await FoodListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Food listing updated successfully',
      data: updatedListing
    });

  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update food listing',
      error: error.message
    });
  }
};

// Delete food listing
exports.deleteFoodListing = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found'
      });
    }

    // Check if user owns this listing
    if (listing.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Food listing deleted successfully'
    });

  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete food listing',
      error: error.message
    });
  }
};

// Get food safety statistics
exports.getFoodSafetyStats = async (req, res) => {
  try {
    const totalListings = await FoodListing.countDocuments();
    const expiredListings = await FoodListing.countDocuments({ status: 'expired' });
    const activeListings = await FoodListing.countDocuments({ status: 'available' });

    // Allergen statistics
    const allergenStats = await FoodListing.aggregate([
      { $unwind: '$allergens' },
      { $group: { _id: '$allergens', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Storage condition statistics
    const storageStats = await FoodListing.aggregate([
      { $group: { _id: '$storageCondition', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalListings,
        active: activeListings,
        expired: expiredListings,
        allergenDistribution: allergenStats,
        storageDistribution: storageStats
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};
const { validationResult } = require('express-validator');
const FoodListing = require('../models/FoodListing');

exports.createListing = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      foodType,
      quantity,
      category,
      description,
      freshUntil,
      pickupTime,
      pickupLocation,
      contactInfo,
      photos,
      dietaryTags,
      latitude,
      longitude,
      city
    } = req.body;

    if (
      latitude === undefined ||
      longitude === undefined ||
      isNaN(parseFloat(latitude)) ||
      isNaN(parseFloat(longitude)) ||
      !city
    ) {
      return res.status(400).json({
        message: 'Valid latitude, longitude, and city are required'
      });
    }

    const listing = await FoodListing.create({
      foodType,
      quantity,
      category,
      description,
      freshUntil,
      pickupTime,
      pickupLocation,
      contactInfo,
      photos: photos || [],
      dietaryTags: dietaryTags || [],
      donorId: req.user ? req.user._id : null,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        city
      }
    });

    res.status(201).json(listing);
  } catch (err) {
    console.error('Create listing error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllListings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const listings = await FoodListing.find(filter).populate('donorId', 'name email').sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error('Get listings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id).populate('donorId', 'name email');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    console.error('Get listing error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Prevent updates on expired food
    if (listing.expiryStatus === 'EXPIRED') {
      return res.status(400).json({
        message: 'Cannot update an expired food listing'
      });
    }

    // Only donor can update
    if (req.user && listing.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const {
      latitude,
      longitude,
      ...rest
    } = req.body;

    const updateData = { ...rest };

    // Update map location ONLY if coordinates are provided
    if (latitude && longitude) {
      updateData.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }

    const updatedListing = await FoodListing.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedListing);
  } catch (err) {
    console.error('Update listing error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteListing = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Only donor can delete their listing
    if (listing.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await FoodListing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error('Delete listing error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getNearbyListings = async (req, res) => {
  try {
    //const { lat, lng, distance = 5000 } = req.query;
const lat = parseFloat(req.query.lat);
const lng = parseFloat(req.query.lng);
const distance = req.query.distance
  ? parseFloat(req.query.distance)
  : 5000;


   if (isNaN(lat) || isNaN(lng) || isNaN(distance)) {
  return res.status(400).json({
    message: 'lat, lng, and distance must be valid numbers',
  });
}


    const listings = await FoodListing.find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [lng, lat], // longitude FIRST
      },
      $maxDistance: distance,
    },
  },
  status: 'available',
});


    res.json(listings);
  } catch (err) {
    console.error('Nearby listing error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getCityListings = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }

    const listings = await FoodListing.find({
      'location.city': city,
      status: 'available'
    }).sort({ freshUntil: 1 });

    res.json(listings);
  } catch (err) {
    console.error('City listing error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.claimListing = async (req, res) => {
  try {
    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if already reserved
    if (listing.status === 'reserved' || listing.status === 'completed') {
      return res.status(400).json({ message: 'This item has already been reserved' });
    }

    // Mark as Reserved
    listing.status = 'reserved';
    listing.claimedBy = req.user._id;
    const savedListing = await listing.save();

    // Currently set to 10 seconds. For 24 hours use: 24 * 60 * 60 * 1000
    setTimeout(async () => {
      try {
        await FoodListing.findByIdAndDelete(savedListing._id);
        // It is good practice to keep one log for background tasks
        console.log(`Listing ${savedListing._id} auto-deleted successfully.`);
      } catch (err) {
        console.error(`Error auto-deleting listing ${savedListing._id}:`, err);
      }
    }, 20000);

    res.json({ message: 'Food reserved successfully', listing: savedListing });

  } catch (err) {
    console.error('Claim listing error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

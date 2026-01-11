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
    } = req.body;

    // ✅ Validate map coordinates
    if (!latitude || !longitude) {
      return res.status(400).json({
        message: 'Pickup location coordinates are required',
      });
    }

    const listing = await FoodListing.create({
      foodType,
      quantity,
      category,
      description,
      freshUntil,
      pickupTime,
      pickupLocation, // human-readable address
      contactInfo,
      photos: photos || [],
      dietaryTags: dietaryTags || [],
      donorId: req.user._id,

      // 📍 GeoJSON location for maps
      location: {
        type: 'Point',
        coordinates: [longitude, latitude], // IMPORTANT ORDER
      },
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

    // Only donor can update
    if (listing.donorId.toString() !== req.user._id.toString()) {
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

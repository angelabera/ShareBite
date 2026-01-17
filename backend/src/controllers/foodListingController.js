const { validationResult } = require('express-validator');
const FoodListing = require('../models/FoodListing');

exports.createListing = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

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
      donorId: req.user._id,
     // ✅ ADD THIS
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
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Only donor can update their listing
    if (listing.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const updated = await FoodListing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
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

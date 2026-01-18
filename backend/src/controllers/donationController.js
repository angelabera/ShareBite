const {
  recommendDonations
} = require("../services/donationRecommendation.service");
exports.getRecommendedDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ isExpired: false });

    const stats = {
      minExpiry: 1,
      maxExpiry: 72,
      minQuantity: 1,
      maxQuantity: 100,
      maxDistance: 50
    };

    const rankedDonations = recommendDonations(donations, stats);
    res.status(200).json(rankedDonations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
};


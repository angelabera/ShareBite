function normalize(value, min, max) {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

function scoreDonation(donation, stats) {
  const expiryScore =
    1 - normalize(donation.hoursToExpire, stats.minExpiry, stats.maxExpiry);

  const quantityScore =
    normalize(donation.quantity, stats.minQuantity, stats.maxQuantity);

  const distanceScore =
    1 - normalize(donation.distanceKm, 0, stats.maxDistance);

  const donorScore = donation.donorRating / 5;

  return (
    expiryScore * 0.4 +
    quantityScore * 0.3 +
    distanceScore * 0.2 +
    donorScore * 0.1
  );
}

function recommendDonations(donations, stats) {
  return donations
    .map(donation => ({
      ...donation,
      score: scoreDonation(donation, stats)
    }))
    .sort((a, b) => b.score - a.score);
}

module.exports = { recommendDonations };


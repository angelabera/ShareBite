const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/claims.json');

const readClaims = () => {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
};

const writeClaims = (claims) => {
  fs.writeFileSync(dataPath, JSON.stringify(claims, null, 2));
};

// POST /api/claims
exports.createClaim = (req, res) => {
  const { foodId, donorId, collectorId } = req.body;

  if (!foodId || !donorId || !collectorId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const claims = readClaims();

  const newClaim = {
    id: uuidv4(),
    foodId,
    donorId,
    collectorId,
    status: 'requested',
    createdAt: new Date().toISOString()
  };

  claims.push(newClaim);
  writeClaims(claims);

  res.status(201).json(newClaim);
};

// GET /api/claims
exports.getAllClaims = (req, res) => {
  const claims = readClaims();
  res.status(200).json(claims);
};

// PUT /api/claims/:id/status
exports.updateClaimStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['requested', 'accepted', 'collected'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const claims = readClaims();
  const claim = claims.find(c => c.id === id);

  if (!claim) {
    return res.status(404).json({ message: 'Claim not found' });
  }

  claim.status = status;
  claim.updatedAt = new Date().toISOString();

  writeClaims(claims);

  res.status(200).json(claim);
};


const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Ngo = require('../models/Ngo');

const generateToken = (id) => jwt.sign({ id, role: 'ngo' }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.registerNgo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password, phone, address, nickname, availability } = req.body;
    const exists = await Ngo.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const ngo = await Ngo.create({ name, email, password, phone, address, nickname, availability });
    const token = generateToken(ngo._id);
    res.status(201).json({ ngo: { id: ngo._id, name: ngo.name, email: ngo.email }, token });
  } catch (err) {
    console.error('NGO register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginNgo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const ngo = await Ngo.findOne({ email });
    if (!ngo) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await ngo.matchPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(ngo._id);
    res.json({ ngo: { id: ngo._id, name: ngo.name, email: ngo.email }, token });
  } catch (err) {
    console.error('NGO login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const express = require('express');
const { addMarketPrice, getAllPrices } = require('../controllers/market.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// GET all prices (Public - anyone can see the dashboard)
router.get('/prices', getAllPrices);

// POST a new price (Protected - only logged-in users can report prices)
router.post('/add', authenticateToken, addMarketPrice);

module.exports = router;
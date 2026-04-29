const MarketPrice = require('../models/MarketPrice');

const addMarketPrice = async (req, res) => {
  try {
    const { cropName, mandiLocation, price } = req.body;

    const newPrice = await MarketPrice.create({
      cropName,
      mandiLocation,
      price: parseFloat(price)
    });

    res.status(201).json({ message: "Market price updated successfully", data: newPrice });
  } catch (error) {
    console.error("Market Error:", error);
    res.status(500).json({ error: "Failed to add market price" });
  }
};

const getAllPrices = async (req, res) => {
  try {
    const prices = await MarketPrice.find().sort({ dateUpdated: -1 });
    res.status(200).json(prices);
  } catch (error) {
    console.error("Market Error:", error);
    res.status(500).json({ error: "Failed to fetch market prices" });
  }
};

module.exports = { addMarketPrice, getAllPrices };
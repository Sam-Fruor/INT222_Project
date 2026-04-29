const InventoryItem = require('../models/InventoryItem');

// 1. CREATE or UPDATE: Add crop or sum up if it exists
const addInventoryItem = async (req, res) => {
  try {
    const { cropName, quantity, pricePerKg } = req.body;
    const farmerId = req.user.id; 

    // Check if crop already exists for this farmer
    const existingItem = await InventoryItem.findOne({ farmerId, cropName });

    if (existingItem) {
      // Sum up the quantity
      existingItem.quantity += parseInt(quantity);
      existingItem.pricePerKg = parseFloat(pricePerKg); // Update to newest price
      await existingItem.save();
      
      return res.status(200).json({ message: "Stock updated successfully!", item: existingItem });
    }

    // If it doesn't exist, create a new one
    const newItem = await InventoryItem.create({
      cropName,
      quantity: parseInt(quantity),
      pricePerKg: parseFloat(pricePerKg),
      farmerId
    });

    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item" });
  }
};

// 2. READ: Get all items for the logged-in farmer
const getMyInventory = async (req, res) => {
  try {
    const items = await InventoryItem.find({ farmerId: req.user.id });
    
    // Convert Mongoose _id to id so the frontend doesn't break
    const formattedItems = items.map(item => ({
      id: item._id,
      cropName: item.cropName,
      quantity: item.quantity,
      pricePerKg: item.pricePerKg
    }));

    res.status(200).json(formattedItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
};

// 3. UPDATE: Update quantity or price directly
const updateInventoryItem = async (req, res) => {
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.status(200).json({ message: "Item updated", item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to update item" });
  }
};

// 4. DELETE: Remove an item
const deleteInventoryItem = async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete item" });
  }
};

module.exports = { addInventoryItem, getMyInventory, updateInventoryItem, deleteInventoryItem };
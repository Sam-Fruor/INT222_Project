const express = require('express');
const {
  addInventoryItem,
  getMyInventory,
  updateInventoryItem,
  deleteInventoryItem
} = require('../controllers/inventory.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Apply the authentication middleware to ALL routes in this file
router.use(authenticateToken);

// CRUD Routes
router.post('/add', addInventoryItem);          // CREATE
router.get('/my-items', getMyInventory);        // READ
router.put('/update/:id', updateInventoryItem); // UPDATE
router.delete('/delete/:id', deleteInventoryItem); // DELETE

module.exports = router;
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose'); // 👈 Import Mongoose

// Initialize Express App
const app = express();
const server = http.createServer(app);

// 👈 Connect to MongoDB (Make sure MONGO_URI is in your .env)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🍃 MongoDB Connected Successfully!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Initialize Socket.io (For Unit III: Real-time Bidding/Chat)
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"]
  }
});

// Basic Middlewares (For Unit II & III)
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true }));
const authRoutes = require('./routes/auth.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const aiRoutes = require('./routes/ai.routes');
const marketRoutes = require('./routes/market.routes');

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/market', marketRoutes); 

app.get('/', (req, res) => {
  res.status(200).json({ 
    message: "Welcome to KisaanSetu/Agri-Chain API",
    status: "Server is up and running!"
  });
});

io.on('connection', (socket) => {
  console.log(`A farmer connected: ${socket.id}`);

  socket.on('new_bid', (data) => {
    console.log('New bid received:', data);
    socket.broadcast.emit('receive_bid', data); 
  });

  socket.on('disconnect', () => {
    console.log(`Farmer disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
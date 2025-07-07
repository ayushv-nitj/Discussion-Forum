const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config();

const threadRoutes = require('./routes/threadRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/threads', threadRoutes);
app.use('/api/messages', messageRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Socket.IO Logic
io.on("connection", socket => {
  console.log("User connected");

  socket.on("send-message", (msg) => {
    io.emit("receive-message", msg); // Broadcast to all clients
  });
});

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

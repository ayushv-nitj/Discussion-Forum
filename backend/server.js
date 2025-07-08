
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

// CORS setup
const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://discussion-forum.vercel.app", // live frontend
  "https://discussion-forum-topaz.vercel.app", // Vercel fallback
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));         // ✅ Only use this ONCE
app.use(express.json());            // ✅ For JSON body parsing

// Routes
app.use('/api/threads', threadRoutes);
app.use('/api/messages', messageRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

// Socket.IO Setup
const io = new Server(server, {
  cors: corsOptions
});

io.on("connection", socket => {
  console.log("📡 A user connected");

  socket.on("send-message", (msg) => {
    io.emit("receive-message", msg); // Broadcast to all
  });

  socket.on("disconnect", () => {
    console.log("🔌 A user disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

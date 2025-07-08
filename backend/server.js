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
const allowedOrigins = [
  "http://localhost:3000", // development
  "https://discussion-forum.vercel.app", // your custom domain
  "https://discussion-forum-topaz.vercel.app", // fallback Vercel domain
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or from allowedOrigins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

// Also update for Socket.IO
const io = new Server(server, {
  cors: corsOptions
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

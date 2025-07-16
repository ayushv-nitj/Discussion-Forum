const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  threadId: String,
  user: {
    id: String,
    name: String,
    image: String
  },
  content: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);

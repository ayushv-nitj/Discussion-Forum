const mongoose = require('mongoose');

const MessageReadSchema = new mongoose.Schema({
  threadId: { type: String, required: true },
  messageId: { type: String, required: true },
  userId: { type: String, required: true },
  readAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MessageRead", MessageReadSchema);

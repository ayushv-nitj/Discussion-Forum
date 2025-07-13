const mongoose = require('mongoose');

const messageReadSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
  },
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Message',
  },
  userId: {
    type: String,
    required: true,
  },
  readAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('MessageRead', messageReadSchema);

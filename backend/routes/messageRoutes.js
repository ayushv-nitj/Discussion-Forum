const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// ✅ Get messages for a thread
router.get('/:threadId', async (req, res) => {
  try {
    const messages = await Message.find({ threadId: req.params.threadId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ✅ Post a new message
router.post('/', async (req, res) => {
  const { threadId, user, content } = req.body;

  if (!threadId || !user || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const msg = new Message({ threadId, user, content, timestamp: new Date() });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    console.error("Error posting message:", err);
    res.status(500).json({ error: "Failed to post message" });
  }
});

// ✅ Delete a message
router.delete('/:id', async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Message not found" });

    await msg.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// ✅ Update a message
router.put('/:id', async (req, res) => {
  const { content } = req.body;

  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Message not found" });

    msg.content = content;
    await msg.save();

    res.json(msg);
  } catch (err) {
    console.error("Error updating message:", err);
    res.status(500).json({ error: "Failed to update message" });
  }
});

module.exports = router;

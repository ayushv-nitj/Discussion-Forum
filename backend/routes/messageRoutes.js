const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const MessageRead = require('../models/MessageRead'); // 🔼 Put at the top

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

// ✅ Get unread counts for all threads in a project for a user
router.get('/unread-counts/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId query param" });
  }

  try {
    // Get last read time per thread for the user
    const reads = await MessageRead.find({ userId });
    const lastReadMap = {};
    reads.forEach(r => {
      lastReadMap[r.threadId] = r.lastReadAt;
    });

    // Get latest messages in each thread under this project
    const threads = await Message.aggregate([
      { $match: { projectId } },
      {
        $group: {
          _id: "$threadId",
          latestTime: { $max: "$timestamp" }
        }
      }
    ]);

    const result = {};
    threads.forEach(t => {
      const lastRead = lastReadMap[t._id];
      if (!lastRead || new Date(lastRead) < new Date(t.latestTime)) {
        result[t._id] = 1;
      }
    });

    res.json(result);
  } catch (err) {
    console.error("Error getting unread counts:", err);
    res.status(500).json({ error: "Failed to fetch unread counts" });
  }
});

// ✅ Mark a thread as read by user (for ThreadPage)
router.post('/mark-read', async (req, res) => {
  const { threadId, userId } = req.body;

  if (!threadId || !userId) {
    return res.status(400).json({ error: "Missing threadId or userId" });
  }

  try {
    const existing = await MessageRead.findOne({ threadId, userId });

    if (existing) {
      existing.lastReadAt = new Date();
      await existing.save();
    } else {
      await MessageRead.create({ threadId, userId, lastReadAt: new Date() });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error marking thread as read:", err);
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

module.exports = router;

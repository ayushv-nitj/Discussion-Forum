const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/:threadId', async (req, res) => {
  const messages = await Message.find({ threadId: req.params.threadId });
  res.json(messages);
});

router.post('/', async (req, res) => {
  const { threadId, user, content } = req.body;
  const msg = new Message({ threadId, user, content });
  await msg.save();
  res.json(msg);
});

module.exports = router;

// DELETE a message
router.delete('/:id', async (req, res) => {
  const msg = await Message.findById(req.params.id);
  if (!msg) return res.status(404).json({ error: "Message not found" });

  await msg.deleteOne();
  res.json({ success: true });
});

// UPDATE a message
router.put('/:id', async (req, res) => {
  const { content } = req.body;
  const msg = await Message.findById(req.params.id);
  if (!msg) return res.status(404).json({ error: "Message not found" });

  msg.content = content;
  await msg.save();

  res.json(msg);
});

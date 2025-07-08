const express = require('express');
const router = express.Router();
const Thread = require('../models/Thread');

// ✅ Get all threads for a project
router.get('/:projectId', async (req, res) => {
  try {
    const threads = await Thread.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    res.json(threads);
  } catch (err) {
    console.error("Error fetching threads:", err);
    res.status(500).json({ error: "Server error while fetching threads" });
  }
});

// ✅ Create a new thread
router.post('/', async (req, res) => {
  const { title, projectId, user, description } = req.body;

  if (!title || !projectId || !user) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const thread = new Thread({
      title,
      projectId,
      description: description || "",
      createdBy: {
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
      }
    });

    await thread.save();
    console.log("Thread created:", thread.title);
    res.status(201).json(thread);
  } catch (err) {
    console.error("Error creating thread:", err);
    res.status(500).json({ error: "Server error while creating thread" });
  }
});

// ✅ Delete a thread (only by its creator)
router.delete('/:id', async (req, res) => {
  const { email } = req.body;

  try {
    const thread = await Thread.findById(req.params.id);

    if (!thread) return res.status(404).json({ error: "Thread not found" });
    if (thread.createdBy.email !== email)
      return res.status(403).json({ error: "Not authorized to delete this thread" });

    await thread.deleteOne();
    res.status(200).json({ message: "Thread deleted successfully" });
  } catch (err) {
    console.error("Error deleting thread:", err);
    res.status(500).json({ error: "Server error while deleting thread" });
  }
});

module.exports = router;

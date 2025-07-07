const express = require('express');
const router = express.Router();
const Thread = require('../models/Thread');

router.get('/:projectId', async (req, res) => {
  const threads = await Thread.find({ projectId: req.params.projectId });
  res.json(threads);
});

router.post('/', async (req, res) => {
const { title, projectId, user, description } = req.body; 
 console.log("Received description:", description); 
  const thread = new Thread({
    title,
    projectId,
    description,
    createdBy: {
      id: user.id,
      name: user.name,
      image: user.image,
      email: user.email,
     // ✅ Ensure email is saved
    }
  });

  console.log("New Thread Payload:", thread);

  await thread.save();
  res.status(201).json(thread);
});


// ✅ Your delete route:
router.delete("/:id", async (req, res) => {
  const { email } = req.body;
  const thread = await Thread.findById(req.params.id);

  if (!thread) return res.status(404).send("Thread not found");
  if (thread.createdBy.email !== email)
    return res.status(403).send("Not authorized to delete this thread");

  await thread.deleteOne();
  res.status(200).send("Thread deleted");
});



module.exports = router;

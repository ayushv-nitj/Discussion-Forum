const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
  title: String,
  projectId: String,
    description: String, 
  createdBy: {
    id: String,
    name: String,
    image: String,
    email: String,
  },
}, { timestamps: true }); 

module.exports = mongoose.model("Thread", ThreadSchema);

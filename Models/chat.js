const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    chat: String,
    user: {
      id: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
      },
      name: String,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model('Chat', chatSchema);

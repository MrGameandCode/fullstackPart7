const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  url: String,
  likes: Number,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

module.exports = mongoose.model('Blog', blogSchema);

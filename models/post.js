const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({ 
	title: String, 
	author: String, 
	content: String,  
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
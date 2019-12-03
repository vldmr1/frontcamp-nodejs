import mongoose from 'mongoose';

const articleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: Number,
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: String
});

export default mongoose.model('Article', articleSchema);
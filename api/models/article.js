import mongoose from 'mongoose';

const { Schema } = mongoose;

const articleSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  source: {
    id: String,
    name: String,
  },
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  description: String,
  publishedAt: String,
  content: String,
});

export const Article = mongoose.model('Article', articleSchema);
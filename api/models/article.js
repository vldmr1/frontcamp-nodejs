import mongoose from 'mongoose';

const { Schema } = mongoose;

const articleSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
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
  publishedAt: String
});

export const Article = mongoose.model('Article', articleSchema);
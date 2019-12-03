import express from 'express';
import mongoose from 'mongoose';
import { DB_URL } from './constants/constants.js';
import { router as articlesRouter } from './api/routes/index.js';
import { logger } from './middleware/index.js';

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PW}${DB_URL}`
);
const app = express();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/articles', articlesRouter);
app.use((req, res, next) => {
  const err = new Error('ADDRESS NOT FOUND!')
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ message: err.message });
});

app.listen(3000,
  () => console.log('Application started on port 3000'));
import express from 'express';
import { router as articlesRouter } from './routes/index.js';
import { logger } from './middleware/index.js';

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
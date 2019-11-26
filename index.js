import express from 'express';
import { articlesRouter } from './routes/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/articles', articlesRouter);

app.listen(3000,
  () => console.log('Application started on port 3000'));
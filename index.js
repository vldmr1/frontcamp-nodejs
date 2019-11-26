import express from 'express';
import { articlesRouter } from './routes/index.js';
import { logger } from './middleware/index.js';

const app = express();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/articles', articlesRouter);
app.use((error, req, res, next) => {
  res.json({ message: error.message });
});
app.use((req, res) => {
  res.status(404);
  res.send('404: Page Not Found');
});

app.listen(3000,
  () => console.log('Application started on port 3000'));
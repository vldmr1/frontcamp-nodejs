import express from 'express';
import {
  getArticlesListHandler,
  getArticleHandler,
  createArticleHandler,
  updateArticleHandler,
  deleteArticleHandler,
} from './handlers/handlers.js'

const articlesRouter = express.Router();

articlesRouter.get('/', getArticlesListHandler);
articlesRouter.get('/:id', getArticleHandler);
articlesRouter.post('/', createArticleHandler);
articlesRouter.put('/:id', updateArticleHandler);
articlesRouter.delete('/:id', deleteArticleHandler);

export { articlesRouter };
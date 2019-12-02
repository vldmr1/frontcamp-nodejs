import express from 'express';
import {
  getArticlesListHandler,
  getArticleHandler,
  createArticleHandler,
  updateArticleHandler,
  deleteArticleHandler,
} from './handlers.js'

export const router = express.Router();

router.get('/', getArticlesListHandler);
router.get('/:id', getArticleHandler);
router.post('/', createArticleHandler);
router.put('/:id', updateArticleHandler);
router.delete('/:id', deleteArticleHandler);
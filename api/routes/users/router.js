import express from 'express';

import {
  createUserHandler,
  loginUserHandler,
  getLoginPageHandler,
} from './handlers.js'

export const router = express.Router();

router.post('/', createUserHandler);
router.post('/login', loginUserHandler);
router.get('/login', getLoginPageHandler);

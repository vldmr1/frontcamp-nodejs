import express from 'express';
import passport from 'passport';

import {
  createUserHandler,
  loginUserHandler,
  getLoginPageHandler,
  fBcallbackHandler,
} from './handlers.js'

export const router = express.Router();

router.post('/', createUserHandler);
router.post('/login', loginUserHandler);
router.get('/login', getLoginPageHandler);
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', fBcallbackHandler);

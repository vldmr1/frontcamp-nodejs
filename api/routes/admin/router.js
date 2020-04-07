import express from 'express';
import { checkAuthentication } from '../../../middleware/index.js';

export const router = express.Router();

router.get('/',
  checkAuthentication,
  (req, res, next) => {
    res
      .status(200)
      .json({
        message: 'Welcome to Admin Area!',
      });
  },
);

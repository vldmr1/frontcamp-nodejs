import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { DB_URL } from './constants/constants.js';
import { logger } from './middleware/index.js';
import {
  articlesRouter,
  usersRouter
} from './api/routes/index.js';
import './config/passport.js';

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PW}${DB_URL}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
);
const app = express();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret123',
  cookie: {
    path: '/',
    maxAge: 60000,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/articles', articlesRouter);
app.use('/api/users', usersRouter);
app.use((req, res, next) => {
  const err = new Error('ADDRESS NOT FOUND!')
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ message: err.message });
  console.log(err);
});

app.listen(3000,
  () => console.log('Application started on port 3000'));
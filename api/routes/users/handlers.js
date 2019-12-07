import { User } from '../../models/index.js';
import mongoose from 'mongoose';
import passport from 'passport';

const addNewUser = (req, res, next) => {
  const { email } = req.body;
  User
    .findOne({ email: email })
    .then(user => {
      if (user) {
        const err = new Error(`${email} is already registered`);
        err.status = 500;
        next(err);
      }

      new User({
        _id: new mongoose.Types.ObjectId(),
        ...req.body,
      })
      .save()
      .then(user => {
        res.status(201);
        req.data = {
          message: 'User registered!',
          user: {
            userName: user.userName,
            email: user.email,
          },
        };
        next();
      })
      .catch(() => {
        const err = new Error('Failed save User');
        err.status = 500;
        next(err);
        }
      );
    });
};

const loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      console.log()
      return res.redirect('api/users/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.redirect('/api/articles');
    });
  })(req, res, next);
};

const getLoginPage = (req, res, next) => {
  req.data = {
    message: 'Please log in!',
  };
  next()
};

const sendDataToClient = (req, res) =>
  res
    .type('json')
    .send(req.data);

export const createUserHandler = [
  addNewUser,
  sendDataToClient,
];

export const loginUserHandler = [
  loginUser
];

export const getLoginPageHandler = [
  getLoginPage,
  sendDataToClient
]

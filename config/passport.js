import mongoose from 'mongoose';
import passport from 'passport';
import passportLocal from 'passport-local';
import passportFacebook from 'passport-facebook';
import { FB_ID } from '../constants/constants.js';

const User = mongoose.model('User');
const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

passport.use(
  new FacebookStrategy({
    ...FB_ID
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ 'facebook.id': profile.id }, (err, user) => {
      if (err) return done(err);
      if (user) return done(null, user);
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        'facebook.id': profile.id,
        'facebook.token': accessToken,
        'facebook.name': profile.displayName,
      });
      if (
        typeof profile.emails != 'undefined'
        && profile.emails.length > 0
      ) {
        newUser.facebook.email = profile.emails[0].value;
      }
      newUser.save(function(err) {
        if (err) throw err;
        return done(null, newUser);
      });
    })
  })
)

passport.use(
  new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false);
      if (!user.verifyPassword(password)) return done(null, false);
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
import mongoose from 'mongoose';
import passport from 'passport';
import passportLocal from 'passport-local';

const User = mongoose.model('User');
const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
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
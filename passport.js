const User = require('./models/user');
const key = require('./config/jwt');

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const LocalStrategy = require('passport-local');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const { google, facebook } = require('./config/oAuth');

//Opts are required as an  argument of the JwtStrategy method
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.jwt;


//----------------------------------------------Middleware
//Verify token---passport-jwt
passport.use(new JwtStrategy(opts,
  async (jwt_payload, done) => {
    try {
      //find user specified in token
      const foundUser = await User.findById(jwt_payload.sub);
      if (foundUser) {
        return done(null, foundUser);
      }
      else {
        return done(null, false);
      }
    }
    catch (error) {
      done(error, false)
    }
  }));

//Verify user---passport-local
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  async (email, password, done) => {
    try {
      const user = await User.findOne({ 'local.email': email });
      if (!user) {
        return done(null, false);
      }
      const isMatch = await user.verifyPassword(password);
      if (!isMatch) {
        return done(null, false);
      }
      else {
        return done(null, user);
      }
    }
    catch (err) {
      done(err, false);
    }
  }
));

//Facebook OAuth Strategy
passport.use(new FacebookTokenStrategy({
  clientID: facebook.clientID,
  clientSecret: facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ 'facebook.id': profile.id });
    if (user) {
      return done(null, user);
    }
    else {
      const newUser = await User.create({
        method: 'facebook',
        facebook: {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value
        }
      });
      done(null, newUser);
    }
  }
  catch (error) {
    done(error, false, error.message);
  }
}));

//Google OAuth Strategy
passport.use(new GooglePlusTokenStrategy({
  clientID: google.clientID,
  clientSecret: google.clientSecret,
  passpReqToCallback: true
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ "google.id": profile.id });
    if (user) {
      return done(null, user);
    }
    else {
      const newUser = await User.create({
        method: 'google',
        google: {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value
        }
      });
      done(null, newUser);
    }
  }
  catch (error) {
    done(error, false, error.message);
  }
}));

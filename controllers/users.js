const User = require('../models/user');
const jwt = require('jsonwebtoken');
const key = require('../config/jwt');

const createToken = (userID) => {
  return jwt.sign({ sub: userID }, key.jwt, { expiresIn: 60 });
}

const oauth = (res, token, socialNetwork) => {
  return res.status(200).header('x-auth', token).json({
    user: {
      name: socialNetwork.name,
      email: socialNetwork.email
    },
    message: 'Auth Successful'
  });
}

exports.signUp = async (req, res, next) => {
  const { email, password } = req.body;
  const foundUser = await User.findOne({ "local.email": email });
  if (foundUser) {
    return res.status(409).json({
      error: 'User already exists'
    });
  }
  else {
    const user = new User({
      method: 'local',
      local: {
        email,
        password
      }
    });
    await user.save();
    res.status(201).json({ createdUser: user });
  }
}

exports.signIn = async (req, res, next) => {
  const token = await createToken(req.user._id);
  return res.status(200).header('x-auth', token).json({
    message: 'Auth successful'
  });

}

exports.oauthGoogle = async (req, res, next) => {
  const token = await createToken(req.user._id);
  const googleUser = req.user.google;
  return oauth(res, token, googleUser);
}

exports.oauthFacebook = async (req, res, next) => {
  const token = await createToken(req.user._id);
  const facebookUser = req.user.facebook;
  return oauth(res, token, facebookUser);
}

exports.secret = async (req, res, next) => {
  res.status(200).json({
    message: 'auth succeded'
  });
}
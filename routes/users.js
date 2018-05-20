const express = require('express');
const router = require('express-promise-router')();

const { checkSchema } = require('express-validator/check');
const { schema } = require('../helpers/schemaRules');
const Validator = require('../helpers/validator');

const passportConfig = require('../passport');
const passport = require('passport');

const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const googleOAuth = passport.authenticate('google-plus-token', { session: false });
const facebookOAuth = passport.authenticate('facebook-token', { session: false });

const UsersController = require('../controllers/users');

router.post('/signup', checkSchema(schema), Validator.validate, UsersController.signUp);

router.post('/signin', passportSignIn, UsersController.signIn);

router.post('/oauth/google', googleOAuth, UsersController.oauthGoogle);

router.post('/oauth/facebook', facebookOAuth, UsersController.oauthFacebook);

router.get('/secret', passportJWT, UsersController.secret);

module.exports = router;
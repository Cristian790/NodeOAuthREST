const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const mongoose = require('mongoose');
const { database } = require('./config/database');
const passport = require('passport');
const error = require('./helpers/errors');

//
const app = express();


//---------------------------------------Connect to database
mongoose.connect(database);
let db = mongoose.connection;
db.on('open', () => { console.log('Connected to MongoDB') });
db.on('error', err => { console.log(err) });


//----------------------------------------Declare mongoose promise as global
mongoose.Promise = global.Promise;

//---------------------------------------Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//---------------------------------------Routes
app.use('/users', users);

//---------------------------------------Error
//Catch 404 errors and foward them to error handler
app.use(error.notFound);
//Error Handler
app.use(error.errorHandler);


//---------------------------------------Start server
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
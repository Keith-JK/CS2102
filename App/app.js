var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
const pg = require('pg');
var app = express();

require('dotenv').config();

/* PAGES FOR THE PROJECT */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var driverRouter = require('./routes/driver');
var awaitingApprovalRouter = require('./routes/awaitingApproval');
var registerDriverRouter = require('./routes/registerDriver');
var ridesRouter = require('./routes/rides');
var homepageRouter = require('./routes/homepage');
var addRideRouter = require('./routes/addRide');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var testPageRouter = require('./routes/testPage');


// set views directory to 'views' folder 
app.set('views', path.join(__dirname, 'views'));
// set view engine to ejs
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//set folder for css and javascript
app.use(express.static(path.join(__dirname, 'public')));

/* FOR PROJECT */
app.use('/', indexRouter);
app.use('/driver', driverRouter);
app.use('/awaitingApproval', awaitingApprovalRouter);
app.use('/registerDriver', registerDriverRouter);
app.use('/rides', ridesRouter);
app.use('/homepage', homepageRouter);
app.use('/addRide', addRideRouter);

app.use('/testpage', testPageRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// uncomment this if using nodemon / node, else if node bin/www, leave it commented
var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
}); 

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
const pg = require('pg');
// for hashing -- havent use
var bcrypt = require('bcryptjs');

// initialise the application 
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

//var testPageRouter = require('./routes/testPage');


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
// app.use('/testpage', testPageRouter);

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var passport = require("passport");

// passport jwt
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

// list of options to include for strategy 
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromHeader();
// this is secret key, choose a suitable secret key to encrypt
//jwtOptions.secretOrKey = process.env.SECRET_KEY; 
jwtOptions.secretOrKey = "Hi,Im_a_secret_key";

passport.use(new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // database call 
  User.findOne({id: jwt_payload.sub}, function(err, user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      return done(null, user);
    } else {
        return done(null, false);
      // or you could create a new account
      }
    });
}));

app.use(passport.initialize());
    
// a post request to login and get token 
app.post("/login", function(req, res) {
  // checks if empty fields 
  if(req.body.name && req.body.password){
    var name = req.body.name;
    var password = req.body.password;
  }else{
    return res.send("No field")
  }
  // usually this would be a database call: -------------------------------TODO database call {name:userid, password:password} ----------------------------------

  // MOCK USER FOR TESTING PURPOSES
  const user = {
    id: 1,
    username: 'Keith',
    email: 'keithcjk123@gmail.com'
  }

  // if not in database
  if(!user){
    res.status(401).json({message:"no such user found"});
  }

  if(user.password === req.body.password) {
    // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
    var payload = {id: user.id};

    // create a token
    var token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: '1000'});

    // send a jsonfile with message ok and the token
    res.render('/homepage', {message: "ok", token: token});
  } else {
    res.status(401).json({message:"passwords did not match"});
  }
});

// test GET request to test jwt 
app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json({message: "Success! You can not see this without a token"});
});


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

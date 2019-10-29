var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
const sql_query = require('./sql/index');
const pg = require('pg');
// for hashing -- havent use
var bcrypt = require('bcryptjs');
var auth = require('./verifyToken')
// initialise the application 
var app = express();
const { Pool } = require('pg')

require('dotenv').config();
const pool = new Pool ({
  connectionString: process.env.DATABASE_URL
});

/* PAGES FOR THE PROJECT */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var driverRouter = require('./routes/driver');
var awaitingApprovalRouter = require('./routes/awaitingApproval');
var registerDriverRouter = require('./routes/registerDriver');
var ridesRouter = require('./routes/rides');
var homepageRouter = require('./routes/homepage');
var addRideRouter = require('./routes/addRide'); 
var individualRideRouter = require('./routes/individualRide');
var registerUserRouter = require('./routes/registerUser');

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
// not token protected
app.use('/', indexRouter);
app.use('/registerDriver', registerDriverRouter);

// verifyToken middleware to authenticate user when proceeding to protected routes
app.use('/driver', auth, driverRouter);
app.use('/awaitingApproval', auth, awaitingApprovalRouter);
app.use('/rides', auth, ridesRouter);
app.use('/homepage', auth, homepageRouter);
app.use('/registerUser', registerUserRouter);
app.use('/addRide', auth, addRideRouter);
app.use('/individualRide', auth, individualRideRouter);

// app.use('/testpage', testPageRouter);


// JWT passport authentication 
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var passport = require("passport");
app.use(passport.initialize());

// passport jwt
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

// list of options to include for strategy 
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// this is secret key, choose a suitable secret key to encrypt
//secretOrKey = process.env.SECRET_KEY; 
jwtOptions.secretOrKey = "Hi,Im_a_secret_key";
jwtOptions.audience = "http://localhost:3000/secret"


passport.use(new JwtStrategy(jwtOptions, function(jwt_payload, done) {
  console.log('payload received', jwt_payload);
  done(null,user)
  /* // database call -- this is a mongooseDB method, idk whats the Postgres equivalent
  User.findOne({id: jwt_payload.id}, function(err, user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      return done(null, user);
    } else {
        return done(null, false);
      // or you could create a new account
      }
    }); */
}));

// LOGIN 
app.get("/login", function(req, res) {
  
  // GET request / POST request
  const username = req.query.username || req.body.username
  const password = req.query.password || req.body.password

  console.log("username input:", username)
  console.log("password input:", password)
  if(!username || !password){
    //res.send("Empty fields! Famine is coming!")
    res.send("The fields are empty, go grow some rice")
  }
  
  // usually this would be a database call: -------------------------------TODO database call {name:userid, password:password} ----------------------------------
  // find the user object using the req.body.name to do the SQL query
  // MOCK USER FOR TESTING PURPOSES
  pool.query(sql_query.query.check_username, [username], (err,data) => {
    if(err) throw err
    console.log(data.rows[0])
    pool.end()
    
    const user = data.rows[0]
  
    // if not found in database
    if(!user){
      res.status(401).json({message:"no such user found"});
    }
    // bcrypt.compare(password, user.password, (err, success) =>{
      // if(err) console.log(err)
    if(password == user.password){
      console.log("password verified with database")
      var payload = {
        id:user.id,
        username: user.username,
        email: user.email
      };
      
      // create a token
      jwt.sign(payload, jwtOptions.secretOrKey, (err, token) =>{
        if(err) console.log(err)
        else{
          const decode = jwt.decode(token)
          // pass on the token
          console.log("token", token)
          /* res.json({
            success:true,
            token:"Bearer " + token,
            decode:decode
          }); */

          // SETTING GLOBAL VARIABLES -- Refer to it by using req.app.locals.____ 
          app.locals.user = username
          app.locals.token = token
          
          // Alternative method -- refer to it by the var name e.g. console.log(global.user)
          global.user = username
          global.token = token

          res.redirect('/homepage')
        }
      });
    }else{
      console.log("wrong password")
      res.redirect("/")
    }
    // });
  });
});

// test GET request to test jwt 
app.get("/secret", auth, function(req, res){
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

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
var individualRideRouter = require('./routes/individualRide');

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
// passport middleware to authenticate user when proceeding to protected routes
app.use('/', indexRouter);
app.use('/registerDriver', registerDriverRouter);
app.use('/driver', driverRouter);
app.use('/awaitingApproval', awaitingApprovalRouter);
app.use('/rides', ridesRouter);
app.use('/homepage', homepageRouter);
app.use('/addRide', addRideRouter);
app.use('/individualRide', individualRideRouter);

// app.use('/testpage', testPageRouter);

// JWT passport authentication 
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var passport = require("passport");
app.use(passport.initialize());
var auth = require('./verifyToken')

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

passport.use(new JwtStrategy(jwtOptions, function(jwt_payload, done) {
  console.log('payload received', jwt_payload);
  return (done,user)
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
app.post("/login", function(req, res) {
  console.log(req.body)
  const username = req.body.username
  const password = req.body.password
  console.log(username)
  console.log(password)
  if(!username || !password){
    //res.send("Empty fields! Famine is coming!")
    res.send("The fields are empty, go grow some rice")
  }

  // usually this would be a database call: -------------------------------TODO database call {name:userid, password:password} ----------------------------------
  // find the user object using the req.body.name to do the SQL query
  // MOCK USER FOR TESTING PURPOSES
  const user = {
    id: 1,
    username: 'user',
    email: 'user@gmail.com',
    password: "123"
  }
  // if not found in database
  if(!user){
    res.status(401).json({message:"no such user found"});
  }
  // bcrypt.compare(password, user.password, (err, success) =>{
    // if(err) console.log(err)
  if(password == user.password){
    console.log("password same")
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
        res.json({
          success:true,
          token:"Bearer " + token,
          decode:decode
        });
      }
    });
  }
  // });
});

app.post('/register', (req, res) =>{
  User.findOne({email: req.body.email}, (err, user) =>{
    if(user){
      let error = "Email already in use"
      return res.status(400).json(error)
    }else{
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Generate salt
      bcrypt.genSalt(10, (err, salt) =>{
        if(err) {
          console.log(err);
        }
        // hash it with salt
        bcrypt.hash(newUser.password, salt, (err,hash)=>{
          if(err) console.log(err)
          newUser.password = hash
          // save to database -- IDK POSTGRES METHODS
          newUser.save().then(user => res.json(user))
            .catch(err => res.status(400).json(err))
        });
      });      
    }
  })
})

// test GET request to test jwt 
/* app.get("/secret", passport.authenticate('jwt', {session:false}), function(req, res){
  res.json({message: "Success! You can not see this without a token"});
}); */
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

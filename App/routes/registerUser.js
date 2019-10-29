const sql_query = require('../sql');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

const { Pool } = require('pg')
const pool = new Pool ({
	connectionString: process.env.DATABASE_URL
});

router.get('/', function(req, res, next) {
	res.render('registerUser', {title: 'Register User'}); 
});

router.post('/', function(req, res, next) {
	var name = req.body.name;
	var username = req.body.username;
	var password = req.body.password;

	pool.query(sql_query.query.check_username, [username], (err, data) =>{
		if(data != undefined) {
      console.log("username in use")
			res.redirect('/registerUser');
		} else {
      console.log("adding to database")
	    // Generate salt
      bcrypt.genSalt(10, (err, salt) =>{
        if(err) {
          console.log(err);
        }
        // hash it with salt
        bcrypt.hash(password, salt, (err,hash)=>{
          if(err) console.log(err)
          passwrod = hash
          // save to database -- IDK POSTGRES METHODS
          pool.query(sql_query.query.add_user, [name, username, password], function(err, data){
            console.log("pass")
            res.redirect("/")
          });
        });
      });
    }
  });
});

module.exports = router;
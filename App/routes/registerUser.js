const sql_query = require('../sql/index');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

const { Pool } = require('pg')
require('dotenv').config();
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
    console.log("data:", data.rows[0])
		if(data.rows[0] != undefined) {
      console.log("username in use")

			res.redirect('/registerUser');
		} else {
      // new username
      console.log("adding to database")
	    // Generate salt
      bcrypt.genSalt(10, (err, salt) =>{
        if(err) {
          console.log(err);
        }
        // hash it with salt
        bcrypt.hash(password, salt, (err,hash)=>{
          if(err) console.log(err)
          password = hash
          console.log(`${username} + ${password} + ${name}`);
          // save to database 
          pool.query(sql_query.query.add_user, [username, name, password], (err, data) => {
            if(err) console.log(err)
            console.log("pass")
            pool.query(sql_query.query.add_passenger, [username, name], (err, data) => {
              console.log("add passenger")
              res.redirect('/');
            });
          });
        });
      });
    }
  });
});

module.exports = router;
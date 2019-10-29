const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

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

	pool.query(sql_query.query.check_username, [username], (err, data) {
		if(data.rows[0] == 1 ) {
			res.redirect('/registerUser', {title: 'username in use! try again'});
		} else {

		}
	// Generate salt
      bcrypt.genSalt(10, (err, salt) =>{
        if(err) {
          console.log(err);
        }
        // hash it with salt
        bcrypt.hash(password, salt, (err,hash)=>{
          if(err) console.log(err)
          // save to database -- IDK POSTGRES METHODS
          pool.query(sql_query.query.add_user, [name, username, password], (err, data) {

          });
        });
      });
    });
});

module.exports = router;
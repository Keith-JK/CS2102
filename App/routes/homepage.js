const sql_query = require('../sql');
var express = require('express');
var router = express.Router();
const { Pool } = require('pg')
const pool = new Pool ({
  connectionString: process.env.DATABASE_URL
})

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = global.user;

  pool.query(sql_query.query.check_user_is_admin, [user], (err,data) => {
  	if(data.rows[0] != undefined){
  		pool.query(sql_query.query.get_verify, (err, data) => {
  			res.render('adminHomepage', {title: 'Express', user: user, data: data.rows});
  		});	
  	} else {
  		res.render('homepage', { title: 'Express', user: user});
  	}
  });
});

module.exports = router;
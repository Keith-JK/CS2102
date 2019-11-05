const sql_query = require('../sql');
var express = require('express');
var router = express.Router();
const { Pool } = require('pg')
const pool = new Pool ({
  connectionString: process.env.DATABASE_URL
})

/* GET favourite drivers. */
router.get('/', function(req, res, next) {
  var user = global.user;

  pool.query(sql_query.query.get_favourite_driver, [user], (err, data) => {
  		if(err){
  			throw err
		}
		console.log("was here")
  		if(data.rows[0] != undefined){
  			res.render('favouriteDriver', {data: data.rows});
  		} else {
  			res.render('favouriteDriverEmpty');
  		}
  });
  
});

module.exports = router;
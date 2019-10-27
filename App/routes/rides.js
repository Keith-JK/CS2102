const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool ({
	connectionString: process.env.DATABASE_URL
});


// get testpage
router.get('/', function(req, res, next) {
	pool.query(sql_query.query.all_rides, (err, data) => {
		if (err) {
    		throw err
  		}
		res.render('rides', { title: 'testing page', data: data.rows });
	});
});

router.post('/', function(req, res, next) {
	var start_location = req.body.start_location.toUpperCase();
	var end_location = req.body.end_location.toUpperCase();
	
	pool.query(sql_query.query.rides_search, [start_location, end_location], (err, data) => {
		if (err) {
    		throw err
  		}
		res.render('rides', { title: 'rides page', data: data.rows });
	});
});


module.exports = router;
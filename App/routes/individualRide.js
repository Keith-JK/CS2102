const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool ({
	connectionString: process.env.DATABASE_URL
});


router.get('/', function(req, res,next) {
	var arr = req.body.location.split(" ");
	var pickup = arr[0].toUpper();
	var dropoff = arr[2].toUpper();
	var driver = req.body.driverusername;
	var date = req.body.date;

	pool.query(sql_query.query.individualRide,[pickup, dropoff, date, driver], (err, data) => {
		if (err) {
    		throw err
  		}
  		res.render('individualRide', {data: data.rows});
	});

});

module.exports = router;
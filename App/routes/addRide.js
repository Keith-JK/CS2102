const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const {Pool} = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

router.get('/', function(req, res, next) {
	res.render('addRide', { title: 'Add new ride' });
});

// POST
router.post('/', function(req, res, next) {
	// Retrieve Information
	var pickup  = req.body.pickup;
	var dropoff = req.body.dropoff;
	var capacity = req.body.capacity;
	var dateOfRide = req.body.dateOfRide;
	var timeOfRide = req.body.timeOfRide;

	
	pool.query(sql_query.query.add_ride, [pickup, dropoff, dateOfRide, timeOfRide, capacity], (err, data) => {
		if(err) {
			console.error("Error in adding ride", err);
			res.redirect('/');
		}
		res.redirect('/homepage')
	});
	
});
module.exports = router;
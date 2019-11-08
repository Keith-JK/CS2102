const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const {Pool} = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

// when redirecting to addRide - some middleware to handle logic flow
router.get('/', function(req, res, next) {
	res.render('addRide', { title: 'Add new ride' });
});

// POST
router.post('/', function(req, res, next) {
	// Retrieve Information
	var pickup = req.body.pickup.toUpperCase();
	var dropoff = req.body.dropoff.toUpperCase();
	var capacity = req.body.capacity;
	var dateOfRide = req.body.dateOfRide;
	var timeOfRide = req.body.timeOfRide;
	var username = global.user;
	console.log(username, pickup, dropoff, dateOfRide, timeOfRide, capacity);

	pool.query(sql_query.query.add_ride, [username, pickup, dropoff, dateOfRide, timeOfRide, capacity], (err, data) => {
		if(err) {
			console.error("Error in adding ride", err);
			res.redirect('/homepage');
		}
		res.redirect('/driver')
	});
	
});
module.exports = router;
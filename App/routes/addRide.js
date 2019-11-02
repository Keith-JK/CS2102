const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const {Pool} = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

// when redirecting to addRide - some middleware to handle logic flow
router.get('/', function(req, res, next) {
	pool.query(sql_query.query.check_driver_verified, [global.user], (err, data) =>{
		if(err) console.log(err)

		// check driver status
		if(data.rows[0] == undefined){
			// driver not registered
			console.log("driver not registered")

			// redirect to registerDriver page
			res.redirect("/registerDriver")
		}else{
			// check if driver is verified by admins
			pool.query(sql_query.query.check_driver_able_to_add_rides, [global.user], (err, data) =>{
				if(err) console.log(err)

				if(data.rows[0] == undefined){
					// driver has not been verified by admins
					console.log("driver made request to verify but not accepted yet!")
					res.redirect("/awaitingApproval")
				}else{
					// driver is verified user
					res.render('addRide', { title: 'Add new ride' });
				}
			})
		}
	})
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
			res.redirect('/');
		}
		res.redirect('/homepage')
	});
	
});
module.exports = router;
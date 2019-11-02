const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const {Pool} = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});



// POST
router.get('/', function(req, res, next) {
	// Retrieve Information
	var platenumber  = req.query.platenumber;
	var model    = req.query.model;
	var capacity = req.query.capacity;
	var username = global.user;
	var name;
	var today = new Date()

	if (platenumber == null) {
		pool.query(sql_query.query.check_driver_verified, [username], (err, data) =>{
			if(err) console.log(err)

			if(data.rows[0] == undefined){
				// driver not verified
				console.log("Driver not registered, proceed to register")
				res.render('registerDriver', { title: 'Register driver' });
			}else{
				// driver already send request for verification
				console.log("Driver awaiting approval")
				res.redirect("/awaitingApproval")
			}
		})
	} else {
		console.log(`+++++++++++++++++++++`);
		console.log(`user:${username}, platenum:${platenumber}`);

		pool.query(sql_query.query.check_username,[username], (err, data) => {
			// get name of user
			name = data.rows[0].name;

			pool.query(sql_query.query.add_driver, [username, name], (err, data) => {
				if(err) {
					console.log(err);
				} else {
					console.log(`added driver!`);
					pool.query(sql_query.query.add_verify, [username, today], (err, data) => {
						if(err) {
							console.log(err);
						} else {
							console.log(`added request to verify driver record!`);
						}
					});
				}
			});
		});
		
		pool.query(sql_query.query.add_car, [platenumber, model, capacity], (err, data) => {
			if(err) {
				console.error("Error in adding car", err);
				res.redirect('/');
			}
			console.log(`added car!`);
			res.redirect('/homepage')
		});
	}
});
module.exports = router;
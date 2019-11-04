const sql_query = require('../sql');
var express = require('express');
const url = require('url'); 
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool ({
	connectionString: process.env.DATABASE_URL
});


router.get('/', (req, res, next) => {
	
	var arr = req.query.locationValue.split(" ");
	var pickup = arr[0].toUpperCase();
	var dropoff = arr[2].toUpperCase();
	var date = new Date(Date.parse(req.query.dateValue));
	var time = req.query.timeValue;
	var user = global.user;

	pool.query(sql_query.query.individualRide, [pickup, dropoff, date, time, user], (err, data) => {
		if(err){
			throw err
		} else if(data.rows[0] != undefined){
			res.render('individualRideDriver', {data: data.rows});
		} else {
			res.render('individualRideDriverNoBids', {pickup, dropoff, user, date, time});
		}			
	});
	
});

router.post('/', (req,res,next) => {
	var pickup = req.param.pickup;
	var dropoff = req.param.dropoff;
	var startDate = req.param.dateValue;
	var time = req.param.timeValue;

	console.log(`${pickup} TO ${dropoff} received!`)
});



module.exports = router;
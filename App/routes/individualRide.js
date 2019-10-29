const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool ({
	connectionString: process.env.DATABASE_URL
});


router.get('/', function(req, res, next) {
	
	var arr = req.query.locationValue.split(" ");
	var pickup = arr[0].toUpperCase();
	var dropoff = arr[2].toUpperCase();
	var driver = req.query.driverValue;
	var date = new Date(Date.parse(req.query.dateValue));
	var time = req.query.timeValue;
	//doesnt display the rides that dont have bids, need to change to sql for that
	pool.query(sql_query.query.individualRide,[pickup, dropoff, date, time, driver], (err, data) => {
		if (err) {
    		throw err
  		}
  		if (data.rows[0] != undefined){
  			res.render('individualRide', {data: data.rows});	
  		} else {
  			res.render('individualRideNoBids', {pickup, dropoff, driver, date, time});
  		}
  		
	}); 
});

router.post('/', function(req,res,next) {
	var bid = req.body.bidamount;
	var timeValue = req.body.timeValue;
	var dateValue = new Date(Date.parse(req.body.dateValue));
	var pickup = req.body.pickup;
	var dropoff = req.body.dropoff;
	var duname = req.body.duname;
	var puname = global.user;
	console.log(`+++++++++++++++++`);
	console.log(`${puname} and ${dateValue}`);
	//set trigger such that if >5 time bid for same travel path, auto add into bookmarks;

	pool.query(sql_query.query.add_bid, [puname, duname, pickup, dropoff, dateValue, timeValue, bid], (err,data) => {
		if(err) {
			throw err
		}
		res.render('homepage');
	});
});

module.exports = router;
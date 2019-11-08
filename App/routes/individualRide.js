const sql_query = require('../sql');
var express = require('express');
const url = require('url'); 
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool ({
	connectionString: process.env.DATABASE_URL
});


router.get('/', function(req, res, next) {
	
	var pickup = req.query.pickup
	var dropoff = req.query.dropoff;
	var driver = req.query.driverValue;
	var date = new Date(Date.parse(req.query.dateValue));
	var time = req.query.timeValue;
	
	pool.query(sql_query.query.individualRide,[pickup, dropoff, date, time, driver], (err, data) => {
		if (err) {
    		throw err
  		}
  		if (data.rows[0] != undefined){
  			res.render('individualRide', {data: data.rows});	
  		} else {
  			res.redirect(url.format({pathname: 'individualRideNoBids', query: req.query,})
  				);
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

	pool.query(sql_query.query.add_bid, [puname, duname, pickup, dropoff, dateValue, timeValue, bid], (err,data) => {
		if(err) {
			throw err
		}
		res.render('homepage');
	});
});

module.exports = router;
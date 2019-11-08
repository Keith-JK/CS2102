const sql_query = require('../sql');
var express = require('express');
const url = require('url'); 
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool ({
	connectionString: process.env.DATABASE_URL
});


router.get('/', (req, res, next) => {
	
	var pickup = req.query.pickup;
	var dropoff = req.query.dropoff;
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
	var pickup = req.body.pickup;
	var dropoff = req.body.dropoff;
	var startDate = new Date(Date.parse(req.body.dateValue));
	var time = req.body.timeValue;
	var capacity = req.body.capacity;

	pool.query(sql_query.query.update_win_bid,[pickup, dropoff, startDate, time, global.user, capacity], (err, data) => {
		if(err){
			throw err
		} 
		res.redirect('/homepage');
	})
});



module.exports = router;
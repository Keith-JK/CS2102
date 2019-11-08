const sql_query = require('../sql');
var express = require('express');
const url = require('url'); 
var router = express.Router();
const { Pool } = require('pg')
const pool = new Pool ({
	connectionString: process.env.DATABASE_URL
});


router.post('/', (res, req, next) => {
	console.log(`++++++++++++++++++++++`);
	console.log(`date: ${req.body.date} time: ${req.body.time} `);
	var bid = req.body.bidamount;
	var date = new Date(Date.parse(req.body.date));
	var timeValue = req.body.time;
	var pickup = req.body.pickup;
	var dropoff = req.body.dropoff;
	var duname = global.user;
	var puname = req.body.puname;

	pool.query(sql_query.query.update_individual_bid, [pickup, dropoff, date, timeValue, duname, puname], (err, data) => {
		if(err){
			throw err
		}
		res.redirect('/driver');
	});
});

module.exports = router;
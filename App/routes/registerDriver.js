const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const {Pool} = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

router.get('/', function(req, res, next) {
	res.render('registerDriver', { title: 'Register driver' });
});

/* SQL Query */
var sql_query1 = 'INSERT INTO Car VALUES';
var sql_query2 = 'INSERT INTO Drives VALUES';
var sql_query3 = 'INSERT INTO Verify VALUES';
var sql_query4 = 'INSERT INTO Driver VALUES';

// POST
router.get('/', function(req, res, next) {
	// Retrieve Information
	var platenumber  = req.body.platenumber;
	var model    = req.body.model;
	var capacity = req.body.capacity;

	
	pool.query(sql_query.query.add_car, [platenumber, model, capacity], (err, data) => {
		if(err) {
			console.error("Error in adding car", err);
			res.redirect('/');
		}
		res.redirect('/homepage')
	});
	

});
module.exports = router;
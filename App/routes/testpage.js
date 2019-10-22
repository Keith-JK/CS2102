const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool ({
	connectionString: process.env.DATABASE_URL
});


pool.query('SELECT * FROM rides', (err, res) => {
  if (err) {
    throw err
  }
  var result = res;
})

router.get('/', function(req, res, next) {
	pool.query(sql_query.query.all_rides, (err, data) => {
		if (err) {
    		throw err
  		}
		res.render('testpage', { title: 'testing page', data: data.rows });
	});
});

/* GET testpage 
router.get('/', function(req, res, next) {
	res.render('testpage', { title: 'express'});
});*/


module.exports = router;
const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool ({
	connectionString: process.env.DATABASE_URL
});


pool.query('SELECT * FROM rides', [1], (err, res) => {
  if (err) {
    throw err
  }
  console.log('user:', res.rows[0])
})

/* GET testpage 
router.get('/', function(req, res, next) {
	res.render('testpage', { title: 'express'});
});*/


module.exports = router;
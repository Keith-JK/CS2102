const sql_query = require('../sql');
var express = require('express');
var router = express.Router();

const {Pool} = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});


/* Awaiting approval page */
router.get('/', function(req, res, next) {
  pool.query(sql_query.query.check_driver_verified, [global.user], (err, data) =>{
    if(data.rows[0] == undefined){
      // driver not registered 
      console.log("driver not registered, redirecting to registerDriver")
      res.redirect("/registerDriver")
    }else{
      // driver awaiting approval
      res.render('awaitingApproval', { title: 'Patience is key' });
    }
  })
});

module.exports = router;
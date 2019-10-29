var express = require('express');
var router = express.Router();
//const { Pool } = require('pg')

/*
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});
*/

/* SQL Query 
var sql_query = 'Select * FROM Verify WHERE Verify.uname = @user_id';
*/

/* TEMP FOR SEEING OUTPUT */
router.get('/', function(req, res, next) {
	res.render('driver', { title: 'So u think u can drive?' });
});




/* GET register driver page STILL IN WORKS 
router.get('/', function(req, res, next) {
  if(
  	//new driver
  	) {
  		res.render('registerDriver', { title: 'Driver' });
  	}
   else if (
  	// pending approval from admin
  	) {
  		res.render('awaitingApproval', { title: 'username' });
  	} 
  	else {
  		res.render('postRides', { title: 'username' });
  	}
});
*/

module.exports = router;
const sql_query = require('../sql');
var express = require('express');
var router = express.Router();
const { Pool } = require('pg')
const pool = new Pool ({
  connectionString: process.env.DATABASE_URL
})


/* TEMP FOR SEEING OUTPUT */
router.get('/', function(req, res, next) {
  var user = global.user

  pool.query(sql_query.query.check_driver_exists_and_verified, [user], (err, data) => {
      if(err){
          throw err
      } 
      else if (data.rows[0] != undefined) {
         if(data.rows[0].is_verified) {
            pool.query(sql_query.query.get_driver_rides, [user], (err, data) => {
                if(err){
                    throw err
                } else {
                    res.render('driverVerified', {title: 'Grab Express', data: data.rows});
                }
            });   
          } else {
            res.redirect('awaitingApproval');
          }
      } else {
          res.redirect('registerDriver');
      }  
  });
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
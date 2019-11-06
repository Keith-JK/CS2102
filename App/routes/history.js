const sql_query = require('../sql');
var express = require('express');
var moment = require('moment')
var router = express.Router();
const { Pool } = require('pg')
const pool = new Pool ({
  connectionString: process.env.DATABASE_URL
})

/* GET history */
router.get('/', function(req, res, next) {
  var user = global.user;
  // user = 'A'
  pool.query(sql_query.query.get_upcoming_rides_driver, [user], (err, up_driver) => {
  	if(err){
  		throw err
  	}else{
        pool.query(sql_query.query.get_upcoming_rides_passenger, [user], (err, up_passenger) =>{
            if(err){
                throw err
            }else{
                pool.query(sql_query.query.get_history_as_driver, [user], (err, history_driver) =>{
                    if(err){
                        throw err
                    }else{
                        pool.query(sql_query.query.get_history_as_passenger, [user], (err, history_passenger)=>{
                            if(err){
                                throw err
                            }else{
                                /* var divider = "--------------------------------"
                                console.log(up_driver.rows)
                                console.log(divider)
                                console.log(up_passenger.rows)
                                console.log(divider)
                                console.log(history_driver.rows)
                                console.log(divider)
                                console.log(history_passenger.rows) */
                                res.render("history", {upcoming_driver: up_driver.rows, upcoming_passenger: up_passenger.rows, history_driver: history_driver.rows, history_passenger: history_passenger.rows})
                            }
                        })
                    }
                })
            }
        })
    }
  });
});

// doesnt work since the date we get in the query is different from the date in psql
router.post("/completeRide", function(req, res, next){
    var duname = global.user
    // duname = 'A'
    var start_location = req.body.start_location
    var end_location = req.body.end_location
    var ride_date = req.body.ride_date
    var start_time = req.body.start_time
    /* var divider = "-------------------------------------"
    console.log(start_location)
    console.log(divider)
    console.log(end_location)
    console.log(divider)
    console.log(ride_date)
    console.log(divider)
    console.log(start_time) */

    // this POST request doesn't do jack shit since date is fked up
    res.redirect("/history")
    
    /* pool.query(sql_query.query.complete_upcoming_rides_driver, [duname, start_location, end_location, ride_date, start_time], (err, data)=>{
        if(err){
            console.log(err)
        }else{
            console.log("ok")
            if(data.rowCount == 1){
                console.log("Successful completion of ride!")
                // refresh page
                res.redirect("/history")
            }
        }
    }) */
})

module.exports = router;
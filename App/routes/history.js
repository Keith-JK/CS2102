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
    console.log("POST completing the ride")
    var duname = global.user
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
    console.log(start_time)
    console.log(divider) */
    console.log("Adding 1 day to ride_date due to time-zone inconsistency")
    var date = new Date(ride_date)
    var newDate = new Date(date.setTime(date.getTime() + 1 * 86400000 ));
    newDate = moment(newDate).utc().format("YYYY-MM-DD")
    console.log("oldDate =", ride_date, "newDate =", newDate)
    
    pool.query(sql_query.query.complete_upcoming_rides_driver, [duname, start_location, end_location, newDate, start_time], (err, data)=>{
        if(err){
            console.log(err)
        }else{
            if(data.rowCount == 1){
                console.log("Successful completion of ride!")
                // refresh page
                res.redirect("/history")
            }
        }
    })
})

router.post("/add_to_favourites", function(req, res, next){
    console.log("POST add to favourites")
    var duname = req.body.duname
    var puname = global.user
    pool.query(sql_query.query.check_if_driver_already_favourited, [puname, duname], (err,data)=>{
        if(err){
            console.log(err)
        }else{
            // driver already in favourites
            if(data.rowCount == 1){
                res.redirect("/favouriteDriver")
            }else{
                // Adding to favourites
                pool.query(sql_query.query.add_favourite_driver, [puname, duname], (err,data)=>{
                    if(err){
                        console.log(err)
                    }else{
                        if(data.rowCount == 1){
                            console.log("Added", duname, "To Favourite Driver of", puname)
                            res.redirect("/favouriteDriver")
                        }else{
                            console.log("Unsuccesful Insertion into Likes!")
                            res.redirect("/favouriteDriver")
                        }
                    }
                })
            }
        }
    })


})
module.exports = router;
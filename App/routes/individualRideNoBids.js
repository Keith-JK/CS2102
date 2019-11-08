var express = require('express');
var router = express.Router();

/* GET rides without bids page. */
router.get('/', function(req, res, next) {
  var user = global.user;
  var pickup = req.query.pickup
  var dropoff = req.query.dropoff;
  var driver = req.query.driverValue;
  var date = new Date(Date.parse(req.query.dateValue));
  var time = req.query.timeValue;

  res.render('individualRideNoBids', {pickup, dropoff, driver, date, time});
});

module.exports = router;
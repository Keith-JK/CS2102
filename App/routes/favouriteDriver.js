var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = global.user;
  res.render('favouriteDriver');
});

module.exports = router;
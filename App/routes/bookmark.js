const sql_query = require('../sql');
var express = require('express');
var router = express.Router();
const { Pool } = require('pg')
const pool = new Pool ({
  connectionString: process.env.DATABASE_URL
})

/* GET bookmarks */
router.get('/', function(req, res, next) {
  var user = global.user;
  pool.query(sql_query.query.get_bookmarks, [user], (err, data) => {
  	if(err){
  		throw err
  	}
  	if (data.rows[0] != undefined) {
  		res.render('bookmark', {data : data.rows});
  	} else {
  		res.render('bookmarkEmpty');
  	}
  });
});

router.post('/', (req, res, next) => {
	var user = global.user;
	var startLocation = req.body.start_location;
  	var endLocation = req.body.end_location;
	pool.query(sql_query.query.add_bookmark, [user, startLocation, endLocation], (err, data) => {
      if(err){
        throw err
      }
      res.redirect('/bookmark'); 
  });
});


module.exports = router;
var express = require('express');
var router = express.Router();

const url = require('url'); 
const { Pool } = require('pg')
const pool = new Pool ({
  connectionString: process.env.DATABASE_URL
})


/* GET home page. */
router.get('/', function(req, res, next) {
  var user = global.user;
  var gotClick = false

  pool.query(sql_query.query.check_user_is_admin, [user], (err,data) => {
  	if(data.rows[0] != undefined && gotClick){
  		pool.query(sql_query.query.get_verify, (err, data) => {
  			res.render('adminHomepage', {title: 'Express', user: user, data: data.rows, gotVerify : gotClick});
  		});	
  	} else if (data.rows[0] != undefined){
      pool.query(sql_query.query.get_verify, (err, data) => {
        res.render('adminHomepage', {title: 'Express', user: user, data: data.rows});
      });
    } else {
  		res.render('homepage', { title: 'Express', user: user});
  	}
  });
});


router.post('/', (req, res, next) => {
  var duname = req.body.duname
  var gotVerify = req.body.gotVerify
  pool.query(sql_query.query.add_verify, [duname], (err, data) => {
      if(err){
        throw err
      }
      res.redirect('homepage'); 
      res.redirect(url.format({pathname: 'homepage', query: {"gotClick" : gotVerify}})
          );   
  });
})

module.exports = router;
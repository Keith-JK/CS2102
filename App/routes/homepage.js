var express = require('express');
var router = express.Router();
var sql_query = require("../sql/index")
const url = require('url'); 
const { Pool } = require('pg')
const pool = new Pool ({
  connectionString: process.env.DATABASE_URL
})



/* GET home page. */
router.get('/', function(req, res, next) {
  var user = global.user;
  var gotClick = false
  // console.log(req.query.gotClick, typeof(req.query.gotClick))
  if(req.query.gotClick == "True"){
    gotClick = true
  }
  console.log("gotClick ==", gotClick)
  pool.query(sql_query.query.check_user_is_admin, [user], (err,data) => {
    // if data != undefined == admin
  	if(data.rows[0] != undefined){
  		pool.query(sql_query.query.get_verify, (err, data) => {
        if(gotClick){
          console.log("GOT CLICKED", gotClick)
          res.render('adminHomepage', {title: 'Express', user: user, data: data.rows, gotVerify : gotClick});
        }else{
          console.log("NEVER CLICK,", gotClick)
          res.render('adminHomepage', {title: 'Express', user: user, data: data.rows, gotVerify: gotClick});
        }
  		});	
    } else {
      // not admin
  		res.render('homepage', { title: 'Express', user: user});
  	}
  });
});


router.post('/', (req, res, next) => {
  var duname = req.body.duname
  var gotVerify = req.body.gotVerify
  console.log("gotVerify ==", gotVerify, typeof(gotVerify))
  if(gotVerify == "True"){
    console.log("ok")
  }
  pool.query(sql_query.query.add_verify, [duname], (err, data) => {
      if(err){
        throw err
      }
      res.redirect(url.format({pathname: 'homepage', query: {"gotClick" : gotVerify}})
          );   
  });
})

module.exports = router;
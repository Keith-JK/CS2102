const sql_query = require('../sql');
var express = require('express');
var router = express.Router();
const { Pool } = require('pg')
const pool = new Pool ({
  connectionString: process.env.DATABASE_URL
})

router.get('/', (req,res,next) => {
	var user = global.user;
	pool.query(sql_query.query.get_messages, [user], (err, data) => {
		if(err){
			throw err
		} else {
			res.render('messages', {messages: data.rows})
		}		
	});
});

router.post('/sendMessage' , (req,res,next) => {
	var user = global.user;
	var receiver = req.body.receiver;
	var message = req.body.message 
	var today = new Date();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	console.log(`${time}`);

	pool.query(sql_query.query.insert_message, [user,receiver,message,time], (err, data) => {
		if(err){
			res.redirect('messagesError')
		}
		res.redirect('/messages')
	});
});



module.exports = router;
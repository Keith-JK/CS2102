var express = require('express');
var router = express.Router();
const { Pool } = require('pg')


/* GET loginpage */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'express'});
});

module.exports = router;

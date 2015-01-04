var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('../models/index.js');
var router = express.Router();


router.route('/')
	.get(function(req, res) {
	  res.render('signup');
	})

	.post(function(req, res) {
	  db.user.findOrCreate({
	    where: {username: req.body.username},
	    defaults: {username: req.body.username, email: req.body.email, password: req.body.password}
	  }).spread(function(newUser, created) {
	    if (created == true) {
	      req.flash('info', 'Account Created Successfully');
	      res.redirect('/logon');
	    } else {
	      req.flash('warning', 'User Name already taken');
	      res.redirect('/signup');
	    }
	  }).catch(function(error) {
	    if (error && Array.isArray(error.errors)) {
	      error.errors.forEach(function(errorItem) {
	        req.flash('danger', errorItem.message);
	      })
	    }else{
	      req.flash('danger', 'unkown error');
	    }
	    res.redirect('/signup');
	  })
	})

module.exports = router;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('../models/index.js');
var router = express.Router();
var bcrypt = require('bcrypt');

router.route('/')
  .get(function(req, res) {
    res.render('logon');
  })
  .post(function(req, res) {
    db.user.find({where: {username: req.body.username}}).then(function(foundUser) {
      if(foundUser) {
        bcrypt.compare(req.body.password, foundUser.password, function(error, match) {
          if(match===true) {
            req.session.user = {
              id: foundUser.id,
              email: foundUser.email,
              username: foundUser.username
            }
            req.flash('info', 'Welcome, '+foundUser.username+'!');
            res.redirect('/home');
          } else {
            req.flash('warning', 'Incorrect Password');
            res.redirect('/logon');
          }
        })
      } else {
        req.flash('warning', 'user not found');
        res.redirect('/logon');
      }
    })
  })

module.exports = router;
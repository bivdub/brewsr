var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('../models/index.js');
var router = express.Router();
var BreweryDb = require('brewerydb-node');
var brewdb = new BreweryDb(''+process.env.beer);

router.route('/')
	.get(function(req, res) {
	  brewdb.search.beers({q: req.query.beer}, function(err, data){
	    res.render('beer/search', {data:data});
	  })
	})
	.post(function(req, res) {
	  if (req.getUser()) {
	    var user = req.getUser();
	    db.beer.findOrCreate({
	      where: {dbid: req.body.dbid},
	      defaults: {dbid: req.body.dbid, name: req.body.name}
	    }).spread(function(beerData, created) {
	      db.usersbeers.findOrCreate({
	        where: {beerId: beerData.id, userId: user.id},
	        defaults: {beerId: beerData.id, userId: user.id, elo: 1000, lastrated: Date.now()}
	      }).spread(function(combinedData, created) {
	        if(created) {
	          req.flash('info', 'Beer added to list!');
	          res.redirect('/home');
	        } else {
	          req.flash('warning', 'Beer already on your list!');
	          res.redirect('/home');
	        }
	      })
	    })
	  } else {
	    req.flash('warning', 'Must be logged in to add beers');
	    res.redirect('/logon');
	  }
	})

router.route('/:id')
	.get(function(req, res) {
	  var currentUser = req.getUser();
	  db.beer.find({where: {dbid: req.params.id}}).then(function(beerData) {
	    if(beerData) {
	      db.usersbeers.find({where: {beerId: beerData.id, userId: currentUser.id}}).then(function(onList) {
	        // console.log('ONLIST',onList);
	        brewdb.beer.getById(req.params.id, {withBreweries: 'Y'}, function(err, data) {
	          res.render('beer/beerinfo', {data: data, alreadyOnList: onList});
	        })
	      })
	    } else {
	      brewdb.beer.getById(req.params.id, {withBreweries: 'Y'}, function(err, data) {
	        res.render('beer/beerinfo', {data: data, alreadyOnList: null});
	      })
	    }
	  })
	})

	module.exports = router;
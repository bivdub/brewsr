var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('../models/index.js');
var router = express.Router();
var BreweryDb = require('brewerydb-node');
var brewdb = new BreweryDb(''+process.env.beer);

router.route('/')
	.get(function(req, res) {
	  if(req.getUser()) {
	    var currentUser = req.getUser();
	    db.user.findAll({
	      where: {id: currentUser.id},
	      include: [db.beer]
	    }).then(function(beerData) {
	      if (beerData[0].dataValues.beer.length < 5) {
	        req.flash('info', 'You need 5 beers on your list to battle!');
	        res.redirect('/home');
	      } else {
	        res.render('battle/battlehome');
	      }
	    })
	  } else {
	    req.flash('info', 'You need to be logged on to use Battle Mode');
	    res.redirect('/logon');
	  }
	})

router.route('/battlehome/:id')
	.get(function(req, res) {
	  if(req.getUser()) {
	    var currentUser = req.getUser();
	    db.user.findAll({
	      where: {id: currentUser.id},
	      include: [db.beer]
	    }).then(function(beerData) {
	      if (beerData[0].dataValues.beer.length < 5) {
	        req.flash('info', 'You need 5 beers on your list to battle!');
	        res.redirect('/home');
	      } else {
	        db.beer.find({where: {dbid: req.params.id}}).then(function(featuredBeer) {
	          res.redirect('/battle/round/'+featuredBeer.dataValues.id);
	        })
	      }
	    })
	  } else {
	    req.flash('info', 'You need to be logged on to use Battle Mode');
	    res.redirect('/logon');
	  }
	})

router.route('/round')
	.get(function(req, res) {
	  var currentUser = req.getUser();
	  db.usersbeers.findAll({
	    where: {userId: currentUser.id}, 
	    order:'random()', 
	    limit: 2,
	    include: [{model:db.beer}]
	  }).then(function(usersbeers) {
	    var battleArray = usersbeers;
	    var beerInfo = usersbeers.map(function(beer) {
	      return beer.beer.dbid;
	    });
	    brewdb.beer.getById(beerInfo, {}, function(err, beerData) {
	      if (battleArray[0].beer.dbid === beerData[0].id) {
	        res.render('battle/battleroundv2', {roundData: battleArray, beerData: beerData});
	      } else {
	        beerData.reverse();
	        res.render('battle/battleroundv2', {roundData: battleArray, beerData: beerData});
	      }
	    })
	  });
	});

router.route('/round/:id')
	.get(function(req, res) {
	  var currentUser = req.getUser();
	  db.usersbeers.findAll({
	    where: {userId: currentUser.id, beerId: {not: req.params.id}}, 
	    order:'lastrated ASC', 
	    limit: 1,
	    include: [{model:db.beer}]
	  }).then(function(firstBeer) {
	    db.usersbeers.findAll({
	      where: {userId: currentUser.id, beerId: req.params.id},
	      include: [{model: db.beer}]
	    }).then(function(featuredBeer) {
	      var battleArray = [featuredBeer, firstBeer];
	      var beerInfo = battleArray.map(function(beer) {
	        return beer[0].beer.dbid;
	      });
	      brewdb.beer.getById(beerInfo, {}, function(err, beerData) {
	        if (battleArray[0][0].beer.dbid === beerData[0].id) {
	          if(!beerData[1]) {
	            res.send(beerData);
	          } else {
	            res.render('battle/battleroundv2solo', {roundData: battleArray, beerData: beerData});
	          }
	          
	        } else {
	          beerData.reverse();
	          if(!beerData[1]) {
	            res.send(beerData);
	          } else {
	            res.render('battle/battleroundv2solo', {roundData: battleArray, beerData: beerData});
	          }   
	        }
	      })
	    });
		});
	});


router.route('/round/solo/score/:winner/:loser/:solo')
	.get(function (req, res) {
	  var user = req.getUser();
	  db.usersbeers.findAll({where: {userId: user.id, beerId: req.params.winner}}).then(function(winnerData) {
	    db.usersbeers.findAll({where: {userId: user.id, beerId: req.params.loser}}).then(function(loserData) {
	      var winnerExpected = 1 / (1+Math.pow(10, ((loserData[0].dataValues.elo - winnerData[0].dataValues.elo)/400)));
	      var loserExpected = 1 / (1+Math.pow(10, ((winnerData[0].dataValues.elo - loserData[0].dataValues.elo)/400)));
	      var winnerNewElo = Math.floor(winnerData[0].dataValues.elo + 20*(1-winnerExpected));
	      var loserNewElo = Math.floor(loserData[0].dataValues.elo + 20*(0-loserExpected));
	      db.usersbeers.find({where: {userId: user.id, beerId: req.params.winner}}).then(function(d1) {
	        d1.elo = winnerNewElo;
	        d1.lastrated = Date.now();
	        d1.save().then(function(blank) {
	          db.usersbeers.find({where: {userId: user.id, beerId: req.params.loser}}).then(function(d2) {
	            d2.elo = loserNewElo;
	            d2.lastrated = Date.now();
	            d2.save().then(function(blank2) {
	              res.redirect('/battle/round/'+req.params.solo);
	            })
	          })
	        })
	      })
	    })
	  })
	});

router.route('/round/score/:winner/:loser')
	.get(function (req, res) {
	  var user = req.getUser();
	  db.usersbeers.findAll({where: {userId: user.id, beerId: req.params.winner}}).then(function(winnerData) {
	    db.usersbeers.findAll({where: {userId: user.id, beerId: req.params.loser}}).then(function(loserData) {
	      var winnerExpected = 1 / (1+Math.pow(10, ((loserData[0].dataValues.elo - winnerData[0].dataValues.elo)/400)));
	      var loserExpected = 1 / (1+Math.pow(10, ((winnerData[0].dataValues.elo - loserData[0].dataValues.elo)/400)));
	      var winnerNewElo = Math.floor(winnerData[0].dataValues.elo + 20*(1-winnerExpected));
	      var loserNewElo = Math.floor(loserData[0].dataValues.elo + 20*(0-loserExpected));
	      db.usersbeers.find({where: {userId: user.id, beerId: req.params.winner}}).then(function(d1) {
	        d1.elo = winnerNewElo;
	        d1.lastrated = Date.now();
	        d1.save().then(function(blank) {
	          db.usersbeers.find({where: {userId: user.id, beerId: req.params.loser}}).then(function(d2) {
	            d2.elo = loserNewElo;
	            d2.lastrated = Date.now();
	            d2.save().then(function(blank2) {
	              res.redirect('/battle/round');
	            })
	          })
	        })
	      })
	    })
	  })
	});

module.exports = router;

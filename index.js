//Requirements
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var session = require('express-session');
var db = require('./models/index.js');
var flash = require('connect-flash');
var BreweryDb = require('brewerydb-node');
var brewdb = new BreweryDb(''+process.env.beer);

//app setup / middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret:'s14y3rR00lz',
  resave: false,
  saveUnitialized: true
}))
app.use(function(req,res, next) {
  req.getUser = function() {
    return req.session.user || false;
  }
  next();
})
app.use(flash());

//sets user data and flash data for all pages
app.get('*', function(req,res,next) {
  var alerts = req.flash();
  res.locals.alerts = alerts;
  res.locals.user = req.getUser();
  next();
})

//routes
app.get('/', function (req, res) {
  if (req.getUser()) {
    res.redirect('/home');
  } else {
    res.render('index');
  }
})

app.get('/signup', function(req, res) {
  res.render('signup');
})

app.post('/signup', function(req, res) {
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

app.get('/logon', function(req, res) {
  res.render('logon');
})

app.post('/logon', function(req, res) {
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

app.get('/home', function(req, res) {
  if(req.getUser()){
    var currentUser = req.getUser();
    db.user.findAll({
      where: {id: currentUser.id},
      include: [db.beer],
      order: 'elo DESC'
    }).then(function(data) {
      // res.send(data)
      res.render('home', {data:data});
    })
  } else {
    req.flash('warning', 'Must be logged in to access home!');
    res.redirect('/logon');
  }
})

app.get('/beer', function(req, res) {
  brewdb.search.beers({q: req.query.beer}, function(err, data){
    res.render('beer/search', {data:data});
  })
})

//BATTLE MODE MODEL UPDATING ROUTE
app.put('/beer', function(req, res) {
  db.usersbeers.findAll({where: {userId: req.body.userId, beerId: req.body.winner}}).then(function(winnerData) {
    db.usersbeers.findAll({where: {userId: req.body.userId, beerId: req.body.loser}}).then(function(loserData) {
      var winnerExpected = 1 / (1+Math.pow(10, ((loserData[0].dataValues.elo - winnerData[0].dataValues.elo)/400)));
      var loserExpected = 1 / (1+Math.pow(10, ((winnerData[0].dataValues.elo - loserData[0].dataValues.elo)/400)));
      var winnerNewElo = Math.floor(winnerData[0].dataValues.elo + 20*(1-winnerExpected));
      var loserNewElo = Math.floor(loserData[0].dataValues.elo + 20*(0-loserExpected));
      db.usersbeers.find({where: {userId: req.body.userId, beerId: req.body.winner}}).then(function(d1) {
        d1.elo = winnerNewElo;
        d1.lastrated = Date.now();
        d1.save().then(function(blank) {
          db.usersbeers.find({where: {userId: req.body.userId, beerId: req.body.loser}}).then(function(d2) {
            d2.elo = loserNewElo;
            d2.lastrated = Date.now();
            d2.save().then(function(blank2) {
              console.log('we need to go deeper');
            })
          })
        })
      })
    })
  })
})

app.post('/beer', function(req, res) {
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

app.get('/beer/:id', function(req, res) {
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
        res.render('beer/beerinfo', {data: data, alreadyOnList: Date.now()});
      })
    }
  })
})

app.get('/mybeers', function (req, res) {
  if(req.getUser()){
    var currentUser = req.getUser();
    db.user.findAll({
      where: {id: currentUser.id},
      include: [db.beer],
      order: 'elo DESC'
    }).then(function(data) {
      res.render('users/mylist', {data:data[0].dataValues})
    })
  } else {
    req.flash('warning', 'Must be logged in to access list!');
    res.redirect('/logon');
  }
})

app.get('/battle', function(req, res) {
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

app.get('/battle/battlehome/:id', function(req, res) {
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
          // console.log('BEERDATA', featuredBeer);
          res.redirect('/battle/round/'+featuredBeer.dataValues.id);
        })
      }
    })
  } else {
    req.flash('info', 'You need to be logged on to use Battle Mode');
    res.redirect('/logon');
  }
})

app.get('/battle/round/:id', function(req, res) {
  var currentUser = req.getUser();
  db.usersbeers.findAll({
    where: {userId: currentUser.id, beerId: {not: req.params.id}}, 
    order:'lastrated ASC', 
    limit: 1,
    include: [{model:db.beer}]
  }).then(function(firstBeer) {
    // console.log('FIRSTBEER', firstBeer);
    db.usersbeers.findAll({
      where: {userId: currentUser.id, beerId: req.params.id},
      include: [{model: db.beer}]
    }).then(function(featuredBeer) {
      // console.log('FEATUREDBEER', featuredBeer);
      var battleArray = [featuredBeer, firstBeer];
      // console.log('BATTLEARRAY', battleArray);
      var beerInfo = battleArray.map(function(beer) {
        // console.log(beer);
        return beer[0].beer.dbid;
      });
      // console.log('BEERINFO:', beerInfo);
      brewdb.beer.getById(beerInfo, {}, function(err, beerData) {
        if (battleArray[0][0].beer.dbid === beerData[0].id) {
          if(!beerData[1]) {
            console.log(battleArray, beerData, beerInfo)
            res.send(beerData);
          } else {
          res.render('battle/battleroundv2solo', {roundData: battleArray, beerData: beerData});
          }
        
        } else {
          beerData.reverse();
          if(!beerData[1]) {
            console.log(battleArray, beerData, beerInfo);
            res.send(beerData);
          } else {
            res.render('battle/battleroundv2solo', {roundData: battleArray, beerData: beerData});
          }   
        }
      })
    });
  });
});

app.get('/battle/round/solo/score/:winner/:loser/:solo', function (req, res) {
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

app.get('/battle/round/score/:winner/:loser', function (req, res) {
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

app.get('/battle/round', function(req, res) {
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

app.get('/list', function(req, res) {
  res.render('users/infolists');
})

app.get('/logout', function(req, res) {
  if(req.getUser()) {
    delete req.session.user;
    req.flash('info', 'Logged Out');
    res.redirect('/');
  } else {
    req.flash('info', 'No User Logged In');
    res.redirect('/');
  }
})
app.listen(3000);
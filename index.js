var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var session = require('express-session');
var db = require('./models/index.js');
var flash = require('connect-flash');
var BreweryDb = require('brewerydb-node');
var brewdb = new BreweryDb('35658c8d52dbd0a8af07c8dbd4b3889d');

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


app.get('*', function(req,res,next) {
  var alerts = req.flash();
  res.locals.alerts = alerts;
  next();
})

app.get('/', function (req, res) {
  if (req.getUser()) {
    res.render('home');
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
          res.redirect('home');
        } else {
          req.flash('warning', 'Incorrect Password');
          res.redirect('logon');
        }
      })
    } else {
      req.flash('warning', 'user not found');
      res.redirect('logon');
    }
  })
})

app.get('/home', function(req, res) {
  res.render('home');
})

app.get('/beer', function(req, res) {
  brewdb.search.beers({q: req.query.beer}, function(err, data){
    console.log(data);
    res.render('beer/search', {data:data});
  })
})

app.post('/beer', function(req, res) {
  if (req.getUser()) {
    var user = req.getUser();
    console.log(user.id);
    db.beer.findOrCreate({
      where: {dbid: req.body.dbid},
      defaults: {dbid: req.body.dbid, name: req.body.name}
    }).spread(function(beerData, created) {
      console.log('here2');
      db.usersbeers.findOrCreate({
        where: {beerId: beerData.id, userId: user.id},
        defaults: {beerId: beerData.id, userId: user.id, elo: 1000, lastrated: null}
      }).spread(function(combinedData, created) {
        console.log('here3');
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
  brewdb.beer.getById(req.params.id, {withBreweries: 'Y'}, function(err, data) {
    console.log(data);
    res.render('beer/beerinfo', {data: data});
  })
})

app.get('/mybeers', function (req, res) {
  if(req.getUser()){
    var user = req.getUser();
    db.user.findAll({
      where: {id: user.id},
      include: [db.beer],
      order: 'elo DESC'
    }).then(function(data) {
      console.log(data[0].dataValues.beer[0].dataValues);
      res.render('users/mylist', {data:data[0].dataValues})
    })
  } else {
    req.flash('warning', 'Must be logged in to access list!');
    res.redirect('/logon');
  }
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
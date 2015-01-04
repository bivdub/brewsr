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
  secret:''+process.env.session,
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

var signup = require('./routes/signup');
app.use('/signup', signup);

var logon = require('./routes/logon');
app.use('/logon', logon);

var beer = require('./routes/beer');
app.use('/beer', beer);

var battle = require('./routes/battle');
app.use('/battle', battle);

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

app.get('/list', function(req, res) {
  res.render('users/infolists');
})

app.get('/about', function(req, res) {
  res.render('about');
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
app.listen(process.env.PORT || 3000);
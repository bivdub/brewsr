var db = require('./models/index.js');


var currentUser = {id:1};


db.user.find(currentUser.id).then(function(user) {
    user.getBeer({limit:10,order:'random()'}).then(function(beers) {
    	console.log(beers.map(function(beer){ return beer.name; }))
    });
});

// db.user.find({
// 	where: {id: currentUser.id},
// 	include: [{model:db.beer}],
// 	attributes: ['beer.usersbeers.elo']
// }).then(function(user) {
// // user.getBeer().then(function(beers) {
// 	console.log(user);
// // })
// })
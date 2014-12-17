$(function() {
  //Adds Beer to users list
	$('.addBeer').on('click', function(event) {
		event.preventDefault();
    var button = $(this);
    var body = {dbid: button.data('id'), name: button.data('name')};
    $.post('/beer', body, function(data) {
      button.toggleClass('disabled');
    })
	})

  // //Battle logic - need to DRY
  // //Round 1
  // $('#box0').on('click', function() {
  //   var userId = $(this).data('user');
  //   var winnerBeerId = $(this).data('beer');
  //   var loserBeerId = $('#box1').data('beer');

  //   var body = {userId: userId, winner: winnerBeerId, loser: loserBeerId}
  //   console.log(body);
  //   $(this).toggle();
  //   $('#box1').toggle();
  //   $('#box2').toggle();
  //   $('#box3').toggle();

  //   $.ajax({
  //     url:'/beer',
  //     type:'PUT',
  //     data: body,
  //     success: function(result) {
  //       console.log(result);
  //     }
  //   })
  // })
  // $('#box1').on('click', function() {
  //   var userId = $(this).data('user');
  //   var winnerBeerId = $(this).data('beer');
  //   var loserBeerId = $('#box0').data('beer');

  //   var body = {userId: userId, winner: winnerBeerId, loser: loserBeerId}
  //   console.log(body);
  //   $(this).toggle();
  //   $('#box0').toggle();
  //   $('#box2').toggle();
  //   $('#box3').toggle();

  //   $.ajax({
  //     url:'/beer',
  //     type:'PUT',
  //     data: body,
  //     success: function(result) {
  //       console.log(result);
  //     }
  //   })
  // })

  // //Round 2
  // $('#box2').on('click', function() {
  //   var userId = $(this).data('user');
  //   var winnerBeerId = $(this).data('beer');
  //   var loserBeerId = $('#box3').data('beer');

  //   var body = {userId: userId, winner: winnerBeerId, loser: loserBeerId}
  //   console.log(body);
  //   $(this).toggle();
  //   $('#box3').toggle();
  //   $('#box4').toggle();
  //   $('#box5').toggle();

  //   $.ajax({
  //     url:'/beer',
  //     type:'PUT',
  //     data: body,
  //     success: function(result) {
  //       console.log(result);
  //     }
  //   })
  // })
  // $('#box3').on('click', function() {
  //   var userId = $(this).data('user');
  //   var winnerBeerId = $(this).data('beer');
  //   var loserBeerId = $('#box2').data('beer');

  //   var body = {userId: userId, winner: winnerBeerId, loser: loserBeerId}
  //   console.log(body);
  //   $(this).toggle();
  //   $('#box2').toggle();
  //   $('#box4').toggle();
  //   $('#box5').toggle();

  //   $.ajax({
  //     url:'/beer',
  //     type:'PUT',
  //     data: body,
  //     success: function(result) {
  //       console.log(result);
  //     }
  //   })
  // })

  // //Round 3
  // $('#box4').on('click', function() {
  //   var userId = $(this).data('user');
  //   var winnerBeerId = $(this).data('beer');
  //   var loserBeerId = $('#box5').data('beer');

  //   var body = {userId: userId, winner: winnerBeerId, loser: loserBeerId}
  //   console.log(body);
  //   $(this).toggle();
  //   $('#box5').toggle();
  //   $('#box6').toggle();
  //   $('#box7').toggle();

  //   $.ajax({
  //     url:'/beer',
  //     type:'PUT',
  //     data: body,
  //     success: function(result) {
  //       console.log(result);
  //     }
  //   })
  // })
  // $('#box5').on('click', function() {
  //   var userId = $(this).data('user');
  //   var winnerBeerId = $(this).data('beer');
  //   var loserBeerId = $('#box4').data('beer');

  //   var body = {userId: userId, winner: winnerBeerId, loser: loserBeerId}
  //   console.log(body);
  //   $(this).toggle();
  //   $('#box4').toggle();
  //   $('#box6').toggle();
  //   $('#box7').toggle();

  //   $.ajax({
  //     url:'/beer',
  //     type:'PUT',
  //     data: body,
  //     success: function(result) {
  //       console.log(result);
  //     }
  //   })
  // })
  // //round4
  // $('#box6').on('click', function() {
  //   var userId = $(this).data('user');
  //   var winnerBeerId = $(this).data('beer');
  //   var loserBeerId = $('#box6').data('beer');

  //   var body = {userId: userId, winner: winnerBeerId, loser: loserBeerId}
  //   console.log(body);
  //   $(this).toggle();
  //   $('#box7').toggle();
  //   $('#box8').toggle();
  //   $('#box9').toggle();

  //   $.ajax({
  //     url:'/beer',
  //     type:'PUT',
  //     data: body,
  //     success: function(result) {
  //       console.log(result);
  //     }
  //   })
  // })
  // $('#box7').on('click', function() {
  //   var userId = $(this).data('user');
  //   var winnerBeerId = $(this).data('beer');
  //   var loserBeerId = $('#box6').data('beer');

  //   var body = {userId: userId, winner: winnerBeerId, loser: loserBeerId}
  //   console.log(body);
  //   $(this).toggle();
  //   $('#box6').toggle();
  //   $('#box8').toggle();
  //   $('#box9').toggle();

  //   $.ajax({
  //     url:'/beer',
  //     type:'PUT',
  //     data: body,
  //     success: function(result) {
  //       console.log(result);
  //     }
  //   })
  // })
  // //Round 5
  // $('#box8').on('click', function() {
  //   var userId = $(this).data('user');
  //   var winnerBeerId = $(this).data('beer');
  //   var loserBeerId = $('#box9').data('beer');

  //   var body = {userId: userId, winner: winnerBeerId, loser: loserBeerId};
  //   console.log(body);
  //   $(this).toggle();
  //   $('#box9').toggle();

  //   $.ajax({
  //     url:'/beer',
  //     type:'PUT',
  //     data: body,
  //     success: function(result) {
  //       $.get('home.ejs');
  //     }
  //   })
  // })
  // $('#box9').on('click', function() {
  //   var userId = $(this).data('user');
  //   var winnerBeerId = $(this).data('beer');
  //   var loserBeerId = $('#box8').data('beer');

  //   var body = {userId: userId, winner: winnerBeerId, loser: loserBeerId};
  //   console.log(body);
  //   $(this).toggle();
  //   $('#box8').toggle();
  //   $('#go-home').toggle();


  //   $.ajax({
  //     url:'/beer',
  //     type:'PUT',
  //     data: body,
  //     success: function(result) {
  //       $.get('home.ejs');
  //     }
  //   })
  // })
})
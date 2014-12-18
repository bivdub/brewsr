$(function() {
  //Adds Beer to users list
	$('.addBeer').on('click', function(event) {
    console.log(event);
		// event.preventDefault();
    var button = $(this);
    var body = {dbid: button.data('id'), name: button.data('name')};
    $.post('/beer', body, function(data) {
      location.reload(true);
    })
	})
})
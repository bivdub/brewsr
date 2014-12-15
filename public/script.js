$(function() {

	$('.addBeer').on('click', function(event) {
		event.preventDefault();
    var button = $(this);
    var body = {dbid: button.data('id'), name: button.data('name')};
    $.post('/beer', body, function(data) {
      button.toggleClass('disabled');
    })
	})
})
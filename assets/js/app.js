$(function () {
	var form = $('#ajax-contact');
	var formMessages = $('#form-messages');
	$(form).submit(function (e) {
		e.preventDefault();
		var formData = $(form).serialize();
		$.ajax({
			type: 'POST',
			url: $(form).attr('action'),
			data: formData
		})
			.done(function (response) {
				$(formMessages).removeClass('error');
				$(formMessages).addClass('success');
				$(formMessages).text('Thank you for your message! I will get back to you soon.');
				$('#name').val('');
				$('#email').val('');
				$('#message').val('');
			})
			.fail(function (data) {
				$(formMessages).removeClass('success');
				$(formMessages).addClass('error');
				$(formMessages).text('Sorry, there was an error sending your message. Please try again later or email me directly.');
			});

	});

});
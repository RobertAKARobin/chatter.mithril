'use strict';

document.addEventListener('DOMContentLoaded', function(){
	var socket = io('http://localhost:3000');
	var $questions = document.getElementById('questions');
	var questions = [];
	var addQuestion = function(event){
		var input = event.target;
		var isReturn = (event.keyCode == 13);
		if(isReturn && input.value){
			m.request({
				method: 'POST',
				url: './questions',
				data: {
					question: input.value
				}
			}).then(function(response){
				if(response.success){
					console.log('This POST worked!');
				}
			});
			input.value = '';
		}
	};
	socket.on('greeting', function(data){
		console.log(data.message);
	});
	socket.on('newQuestion', function(data){
		questions.push(data.question);
		m.redraw();
	});
	m.mount($questions, {
		view: function(){
			return [
				questions.map(function(question){
					return m('li', question);
				}),
				m('li', [
					m('input', {onkeyup: addQuestion})
				])
			]
		}
	});
	m.request('./questions').then(function(response){
		questions = response;
	});
});

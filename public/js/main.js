'use strict';

document.addEventListener('DOMContentLoaded', function(){
	var $questions = document.getElementById('questions');
	var questions = [];
	var addQuestion = function(event){
		var input = event.target;
		var isReturn = (event.keyCode == 13);
		if(isReturn && input.value){
			m.request({
				method: 'POST',
				url: './questions'
			}).then(function(response){
				if(response.success){
					console.log('This POST worked!');
				}
			});
			questions.push(input.value);
			input.value = '';
		}
	};
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

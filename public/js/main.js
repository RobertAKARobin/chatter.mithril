'use strict';

document.addEventListener('DOMContentLoaded', function(){
	var $questions = document.getElementById('questions');
	var questions = [
		'Question 1?',
		'Question 2?'
	];
	var addQuestion = function(event){
		var input = event.target;
		var isReturn = (event.keyCode == 13);
		if(isReturn){
			questions.push(input.value);
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
});

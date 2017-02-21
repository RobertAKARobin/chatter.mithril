'use strict';

document.addEventListener('DOMContentLoaded', function(){
	var $questions = document.getElementById('questions');
	var questions = [
		'Question 1?',
		'Question 2?'
	];
	var addQuestion = function(){
		questions.push('Hello, world?');
	};
	m.mount($questions, {
		view: function(){
			return [
				questions.map(function(question){
					return m('li', question);
				}),
				m('li', [
					m('button', {onclick: addQuestion}, 'Hello?')
				])
			]
		}
	});
});

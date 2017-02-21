'use strict';

document.addEventListener('DOMContentLoaded', function(){
	var $questions = document.getElementById('questions');
	var questions = [
		'Question 1?',
		'Question 2?'
	];
	var sayHello = function(){
		console.log('Hello, world!');
	};
	m.render($questions, [
		questions.map(function(question){
			return m('li', question);
		}),
		m('li', [
			m('button', {onclick: sayHello}, 'Hello?')
		])
	]);
});

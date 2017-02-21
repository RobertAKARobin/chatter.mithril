'use strict';

document.addEventListener('DOMContentLoaded', function(){
	var $questions = document.getElementById('questions');
	m.render($questions, [
		m('li', 'Question 1?'),
		m('li', 'Question 2?')
	]);
});

'use strict';

var QuestionList = (function(){
	var $instance = {};
	$instance.event = {};
	$instance.view = {};

	$instance.all = [];
	$instance.save = function(input){
		return m.request({
			method: 'POST',
			url: './questions',
			data: input
		});
	};
	$instance.loadAll = function(){
		m.request('./questions').then(function(input){
			QuestionList.all = input.questions;
		});
		return QuestionList;
	};
	$instance.mountTo = function(element){
		m.mount(element, {
			view: QuestionList.view.list
		});
		return QuestionList;
	}

	$instance.event.save = function(event){
		var input = event.target;
		var isReturn = (event.keyCode == 13);
		if(isReturn && input.value){
			QuestionList.save({question: input.value});
			input.value = '';
		}
	};
	$instance.view.list = function(){
		return [
			QuestionList.all.map(function(question){
				return m('li', question);
			}),
			m('li', [
				m('input', {onkeyup: QuestionList.event.save})
			])
		];
	};

	return $instance;
})();


document.addEventListener('DOMContentLoaded', function(){
	var socket = io('http://localhost:3000');

	QuestionList
		.loadAll()
		.mountTo(document.getElementById('questions'));

	socket.on('newQuestion', function(data){
		QuestionList.all.push(data.question);
		m.redraw();
	});
});

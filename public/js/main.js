'use strict';

var socket = io('http://localhost:3000');

var QuestionList = (function(){
	var list = {};
	list.event = {};
	list.all = [];
	list.save = function(input){
		return m.request({
			method: 'POST',
			url: './questions',
			data: input
		});
	}
	list.push = function(question){
		list.all.push(question);
	}
	list.event.save = function(event){
		var input = event.target;
		var isReturn = (event.keyCode == 13);
		event.redraw = false;
		if(isReturn && input.value){
			list.save({
				question: {
					text: input.value
				}
			});
			input.value = '';
		}
	};

	var component = {};
	component.oninit = function(){
		m.request('/questions').then(function(input){
			var i, l = input.questions.length;
			for(i = 0; i < l; i++){
				list.push(input.questions[i]);
			}
		});
	}
	component.oncreate = function(){
		socket.on('newQuestion', function(data){
			list.push(data.question);
			m.redraw();
		});
	}
	component.view = function(){
		return [
			list.all.map(function(question){
				return m('li', question.id + ' ' + question.text);
			}),
			m('li', [
				m('input', {onkeyup: list.event.save})
			])
		];
	}
	return component;
})();

document.addEventListener('DOMContentLoaded', function(){
	m.route(document.getElementById('questions'), '/', {
		'/': QuestionList
	});
});

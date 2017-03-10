'use strict';

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
	list.loadAll = function(){
		m.request('./questions').then(function(input){
			var i, l = input.questions.length;
			for(i = 0; i < l; i++){
				list.push(input.questions[i]);
			}
		});
		return list;
	};
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

	list.view = function(){
		return [
			list.all.map(function(question){
				return m('li', question.text);
			}),
			m('li', [
				m('input', {onkeyup: list.event.save})
			])
		];
	}

	return list;
})();

document.addEventListener('DOMContentLoaded', function(){
	var socket = io('http://localhost:3000');

	m.mount(document.getElementById('questions'), QuestionList.loadAll());

	socket.on('newQuestion', function(data){
		QuestionList.push(data.question);
		m.redraw();
	});
});

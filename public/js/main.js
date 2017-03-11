'use strict';

var socket = io('http://localhost:3000');

var QuestionList = (function(){
	var list = {};
	list.event = {};
	list.save = function(input){
		return m.request({
			method: 'POST',
			url: './questions',
			data: input
		});
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
		list.all = [];
		m.request('/questions').then(function(input){
			var i, l = input.questions.length;
			for(i = 0; i < l; i++){
				list.all.push(input.questions[i]);
			}
		});
	}
	component.oncreate = function(){
		socket.on('newQuestion', function(data){
			list.all.push(data.question);
			m.redraw();
		});
	}
	component.onremove = function(){
		socket.off('newQuestion');
	}
	component.view = function(){
		return [
			list.all.map(function(question){
				return m('li', [
					m('a', {
						href: '/question/' + question.id,
						oncreate: m.route.link
					}, question.id + ' ' + question.text)
				]);
			}),
			m('li', [
				m('input', {onkeyup: list.event.save})
			])
		];
	}
	return component;
})();

var Question = (function(){
	var question = {};

	var component = {};
	component.oninit = function(vnode){
		m.request('/question/' + vnode.attrs.id).then(function(input){
			question.data = input.question;
		});
	}
	component.view = function(){
		if(question.data){
			return m('h1', question.data.id + ': ' + question.data.text);
		}else{
			return m('h1', 'Loading...');
		}
	}
	return component;
})();

var Header = (function(){
	var component = {};
	component.view = function(){
		return m('h1', [
			m('a', {
				href: '/',
				oncreate: m.route.link
			}, 'Home')
		]);
	}
	return component;
})();

document.addEventListener('DOMContentLoaded', function(){
	m.mount(document.getElementById('header'), Header);
	m.route(document.getElementById('questions'), '/', {
		'/': QuestionList,
		'/question/:id': Question
	});
});

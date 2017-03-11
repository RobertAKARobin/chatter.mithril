'use strict';

var socket = io('http://localhost:3000');

var ConvoList = (function(){
	var list = {};
	list.reset = function(){
		list.all = [];
	}
	list.save = function(input){
		return m.request({
			method: 'POST',
			url: './convos',
			data: input
		});
	}

	var events = {};
	events.save = function(event){
		var input = event.target;
		var isReturn = (event.keyCode == 13);
		event.redraw = false;
		if(isReturn && input.value){
			list.save({
				convo: {
					title: input.value
				}
			});
			input.value = '';
		}
	};

	var component = {};
	component.view = function(){
		return m('ul', [
			list.all.map(function(convo){
				return m('li', [
					m('a', {
						href: '/convo/' + convo.id,
						oncreate: m.route.link
					}, convo.id + ' ' + convo.title)
				]);
			}),
			m('li', [
				m('input', {onkeyup: events.save})
			])
		]);
	}
	component.oninit = function(){
		list.reset();
		m.request('/convos').then(function(input){
			var i, l = input.convos.length;
			for(i = 0; i < l; i++){
				list.all.push(input.convos[i]);
			}
		});
	}
	component.oncreate = function(){
		socket.on('newConvo', function(data){
			list.all.push(data.convo);
			m.redraw();
		});
	}
	component.onremove = function(){
		socket.off('newConvo');
	}
	return component;
})();

var Convo = (function(){
	var convo = {};

	var component = {};
	component.oninit = function(vnode){
		m.request('/convo/' + vnode.attrs.id).then(function(input){
			convo.data = input.convo;
		});
	}
	component.view = function(){
		if(convo.data){
			return m('h1', convo.data.id + ': ' + convo.data.title);
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
	m.route(document.getElementById('main'), '/', {
		'/': ConvoList,
		'/convo/:id': Convo
	});
});

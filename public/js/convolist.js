'use strict';

var ConvoList = (function(){
	var list = {};
	list.construct = function(){
		list.all = [];
	}

	var newConvo = {};
	newConvo.construct = function(){
		newConvo.data = {
			title: m.stream('')
		}
	}
	newConvo.save = function(){
		return m.request({
			method: 'POST',
			url: './convos',
			data: {
				convo: newConvo.data
			}
		});
	}

	var events = {};
	events.save = function(event){
		event.redraw = false;
		newConvo.save().then(function(response){
			if(response.success){
				newConvo.construct();
				m.redraw();
			}
		});
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
				m('input', m._boundInput(newConvo.data.title)),
				m('button', {onclick: events.save}, 'Save')
			])
		]);
	}
	component.oninit = function(){
		list.construct();
		newConvo.construct();
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

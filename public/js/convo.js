'use strict';

var Convo = (function(){
	var convo = {};
	convo.post = function(post){
		return m.request({
			method: 'POST',
			url: './convo/' + convo.data.id,
			data: post
		});
	}

	var events = {};
	events.post = function(event){
		var input = event.target;
		var isReturn = (event.keyCode == 13);
		event.redraw = false;
		if(isReturn && input.value){
			convo.post({
				post: {
					text: input.value
				}
			});
			input.value = '';
		}
	}

	var component = {};
	component.oninit = function(vnode){
		m.request('/convo/' + vnode.attrs.id).then(function(input){
			convo.data = input.convo;
			socket.emit('joinConvo', convo.data.id);
		});
	}
	component.oncreate = function(){
		socket.on('newPost', function(data){
			convo.data.posts.push(data.post);
			m.redraw();
		})
	}
	component.onremove = function(){
		socket.off('newPost');
	}
	component.view = function(){
		if(convo.data){
			return [
				m('h1', convo.data.id + ': ' + convo.data.title),
				m('ul', [
					m('li', [
						m('input', {onkeyup: events.post})
					]),
					convo.data.posts.map(function(post){
						return m('li', post.text);
					})
				])
			];
		}else{
			return m('h1', 'Loading...');
		}
	}
	return component;
})();

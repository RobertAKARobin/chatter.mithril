'use strict';

var Convo = (function(){
	var convo = {};

	var newPost = {};
	newPost.construct = function(){
		newPost.data = {
			text: m.stream('')
		};
	}
	newPost.save = function(){
		return m.request({
			method: 'POST',
			url: './convo/' + convo.data.id,
			background: true,
			data: {
				post: newPost.data
			}
		});
	}

	var events = {};
	events.post = function(event){
		event.redraw = false;
		newPost.save().then(function(response){
			if(response.success){
				newPost.construct();
				m.redraw();
			}
		});
	}

	var views = {};
	views.newPost = function(){
		return m('li', [
			m('input', m._boundInput(newPost.data.text)),
			m('button', {onclick: events.post}, 'Post')
		]);
	}

	return {
		oninit: function(vnode){
			newPost.construct();
			m.request('/convo/' + vnode.attrs.id).then(function(input){
				convo.data = input.convo;
				convo.posts = input.posts;
				socket.emit('joinConvo', convo.data.id);
			});
		},
		oncreate: function(){
			socket.on('newPost', function(data){
				convo.posts.push(data.post);
				m.redraw();
			})
		},
		onremove: function(){
			socket.off('newPost');
		},
		view: function(){
			if(convo.data){
				return [
					m('h1', convo.data.id + ': ' + convo.data.title),
					m('ul', [
						(User.current.isSignedIn == false ? null : views.newPost()),
						convo.posts.map(function(post){
							return m('li', post.text);
						})
					])
				];
			}else{
				return m('h1', 'Loading...');
			}
		}
	}
})();

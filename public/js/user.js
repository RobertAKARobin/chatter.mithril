'use strict';

var User = (function(){
	var message = {};
	message.update = function(input){
		message.kind = (input.success ? 'success' : 'error');
		message.text = (input.message || '');
	}

	var checkForSuccess = function(response){
		var kind = (response.success ? 'success' : 'error');
		message.update(response);
		return response.success;
	}

	var currentUser = {};
	currentUser.isSignedIn = false;
	currentUser.getFromMemory = function(){
		currentUser.data = Cookies.getJSON('user');
		if(currentUser.data){
			currentUser.isSignedIn = true;
		}
	}
	currentUser.signOut = function(){
		return m.request({
			method: 'DELETE',
			url: './session',
			background: true
		});
	}

	var newUser = {};
	newUser.construct = function(){
		newUser.data = {
			name: m.stream(''),
			password: m.stream('')
		}
	}
	newUser.save = function(){
		return m.request({
			method: 'POST',
			url: './users',
			background: true,
			data: {
				user: newUser.data
			}
		});
	}
	newUser.signIn = function(){
		return m.request({
			method: 'POST',
			url: './session',
			background: true,
			data: {
				user: newUser.data
			}
		});
	}

	var events = {};
	events.signUp = function(event){
		event.redraw = false;
		newUser.save().then(function(response){
			checkForSuccess(response);
			m.redraw();
		});
	}
	events.signIn = function(event){
		event.redraw = false;
		newUser.signIn().then(function(response){
			if(checkForSuccess(response)){
				User.current.getFromMemory();
			};
			m.redraw();
		});
	}
	events.signOut = function(event){
		event.redraw = false;
		User.current.signOut();
	}

	var views = {};
	views.signUp = function(){
		return [
			m('input', m._boundInput(newUser.data.name, {
				placeholder: 'Name'
			})),
			m('input', m._boundInput(newUser.data.password, {
				placeholder: 'Password',
				type: 'password'
			})),
			m('button', {
				onclick: events.signUp
			}, 'Sign up'),
			m('button', {
				onclick: events.signIn
			}, 'Sign in')
		];
	}
	views.isSignedIn = function(){
		return [
			m('p', 'Welcome, ' + User.current.data.name + '!'),
			m('button', {onclick: events.signOut}, 'Sign out')
		];
	}

	return {
		current: currentUser,
		oninit: function(){
			newUser.construct();
			User.current.getFromMemory();
		},
		oncreate: function(){
			socket.on('signOut', function(){
				User.current.isSignedIn = false;
				newUser.construct();
				m.redraw();
			});
		},
		view: function(){
			return [
				m('p', {class: message.kind}, message.text),
				(User.current.isSignedIn ? views.isSignedIn() : views.signUp())
			];
		}
	}
})();

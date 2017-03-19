'use strict';

var User = (function(){
	var user = {};
	user.isSignedIn = false;
	user.signIn = function(){
		user.data = Cookies.getJSON('user');
		if(user.data){
			user.isSignedIn = true;
		}
	}
	user.signOut = function(){
		return m.request({
			method: 'DELETE',
			url: './session'
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
			data: {
				user: newUser.data
			}
		});
	}
	newUser.signIn = function(){
		return m.request({
			method: 'POST',
			url: './session',
			data: {
				user: newUser.data
			}
		})
	}

	var events = {};
	events.signUp = function(event){
		event.redraw = false;
		newUser.save();
	}
	events.signIn = function(event){
		event.redraw = false;
		newUser.signIn().then(function(response){
			if(response.success){
				user.signIn();
				m.redraw();
			}
		});
	}
	events.signOut = function(event){
		event.redraw = false;
		user.signOut();
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
			m('p', 'Welcome, ' + user.data.name + '!'),
			m('button', {onclick: events.signOut}, 'Sign out')
		];
	}

	return {
		oninit: function(){
			newUser.construct();
			user.signIn();
		},
		oncreate: function(){
			socket.on('signOut', function(){
				user.isSignedIn = false;
				newUser.construct();
				m.redraw();
			});
		},
		view: function(){
			if(user.isSignedIn == true){
				return views.isSignedIn();
			}else{
				return views.signUp();
			}
		}
	}
})();

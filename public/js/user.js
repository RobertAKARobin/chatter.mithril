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
		return m('p', 'Welcome, ' + user.data.name + '!');
	}

	return {
		oninit: function(){
			newUser.construct();
			user.signIn();
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

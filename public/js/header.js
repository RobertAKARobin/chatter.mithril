'use strict';

var Header = (function(){
	var user = {};
	user.isSignedIn = false;

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

	var events = {};
	events.signUp = function(event){
		event.redraw = false;
		newUser.save().then(function(response){
			if(response.success){
				user.data = response.user;
				user.isSignedIn = true;
				m.redraw();
			}
		});
	}

	var views = {};
	views.user = function(){
		if(user.isSignedIn == true){
			return views.isSignedIn();
		}else{
			return views.signUp();
		}
	}
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
			}, 'Sign up')
		];
	}
	views.isSignedIn = function(){
		return m('p', 'Welcome, ' + user.data.name + '!');
	}

	var component = {};
	component.view = function(){
		return [
			m('h1', [
				m('a', {
					href: '/',
					oncreate: m.route.link
				}, 'Home')
			]),
			views.user()
		];
	}
	component.oninit = function(){
		newUser.construct();
	}
	return component;
})();

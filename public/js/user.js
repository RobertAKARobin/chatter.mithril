'use strict';

var User = (function(){
	var user = {};
	user.data = {};
	user.input = {
		name: m.stream(''),
		password: m.stream('')
	}
	user.isSignedIn = false;
	user.signUp = function(input){
		return m.request({
			method: 'POST',
			url: './users',
			data: input
		}).then(function(response){
			user.isSignedIn = true;
			user.data = response.user;
		});
	}

	user.events = {};
	user.events.signUp = function(event){
		event.redraw = false;
		user.signUp({
			user: user.input
		});
	}

	user.view = function(){
		if(user.isSignedIn == true){
			return user.views.isSignedIn();
		}else{
			return user.views.signUp();
		}
	}
	user.views = {};
	user.views.signUp = function(){
		return [
			m('input', m._boundInput(user.input.name, {
				placeholder: 'Name'
			})),
			m('input', m._boundInput(user.input.password, {
				placeholder: 'Password',
				type: 'password'
			})),
			m('button', {
				onclick: user.events.signUp
			}, 'Sign up')
		];
	}
	user.views.isSignedIn = function(){
		return m('p', 'Welcome, ' + user.data.name + '!');
	}

	return user;
})();

'use strict';

var User = (function(){
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
		newUser.save();
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
			}, 'Sign up')
		];
	}
	views.isSignedIn = function(){
		return m('p', 'Welcome, ' + user.data.name + '!');
	}

	return {
		oninit: function(){
			newUser.construct();
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

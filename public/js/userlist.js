'use strict';

var UserList = (function(){
	var list = {};

	return{
		oninit: function(){
			list.all = [];
			m.request('/users').then(function(response){
				list.all = response.users;
			});
		},
		oncreate: function(){
			socket.on('newUser', function(data){
				list.all.push(data.user);
				m.redraw();
			});
		},
		onremove: function(){
			socket.off('newUser');
		},
		view: function(){
			return m('p', [
				'Users: ',
				list.all.map(function(user, index){
					return m('span', index + ':' + user.name + ' ');
				})
			]);
		}
	}
})();

'use strict';

document.addEventListener('DOMContentLoaded', function(){
	m.mount(document.getElementById('header'), Header);
	m.route(document.getElementById('main'), '/', {
		'/': ConvoList,
		'/convo/:id': Convo
	});
});

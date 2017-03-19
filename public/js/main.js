'use strict';

m._boundInput = function(stream, attrs){
	var attrs = (attrs || {});
	attrs.value = stream();
	attrs.oninput = function(event){
		event.redraw = false;
		m.withAttr('value', stream).call({}, event);
	};
	return attrs;
}

document.addEventListener('DOMContentLoaded', function(){
	m.mount(document.getElementById('header'), Header);
	m.mount(document.getElementById('users'), UserList);
	m.route(document.getElementById('main'), '/', {
		'/': ConvoList,
		'/convo/:id': Convo
	});
});

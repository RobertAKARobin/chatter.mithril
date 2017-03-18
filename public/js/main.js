'use strict';

m.value = function(callback){
	var eventHandler = m.withAttr('value', callback);
	return function(event){
		event.redraw = false;
		eventHandler(event);
	}
}

document.addEventListener('DOMContentLoaded', function(){
	m.mount(document.getElementById('header'), Header);
	m.route(document.getElementById('main'), '/', {
		'/': ConvoList,
		'/convo/:id': Convo
	});
});

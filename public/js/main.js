'use strict';

m.withAttrStatic = function(attribute, callback){
	var eventHandler = m.withAttr(attribute, callback);
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

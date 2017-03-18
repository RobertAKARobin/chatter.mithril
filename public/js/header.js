'use strict';

var Header = (function(){
	var component = {};
	component.view = function(){
		return [
			m('h1', [
				m('a', {
					href: '/',
					oncreate: m.route.link
				}, 'Home')
			]),
			User.view()
		];
	}
	return component;
})();

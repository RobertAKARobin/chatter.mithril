'use strict';

var Header = (function(){
	return {
		view: function(){
			return [
				m('h1', [
					m('a', {
						href: '/',
						oncreate: m.route.link
					}, 'Home')
				])
			];
		}
	}
})();

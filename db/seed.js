'use strict';

const Convo = require('./convo')

const convos = [
	{
		title: 'Is the API working?',
		posts: [
			'Foo',
			'Bar'
		]
	},
	{
		title: 'Is the API still working?',
		posts: [
			'Boo',
			'Fuzz'
		]
	}
]

convos.forEach((input) => {
	const convo = Convo.add({title: input.title})
	for(let i = 0, l = input.posts.length; i < l; i++){
		convo.post({text: input.posts[i]})
	}
})

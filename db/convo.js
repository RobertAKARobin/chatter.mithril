'use strict';

const DB = require('./_connection')

const Convo = (() => {

	const $Class = {}
	$Class.count = 0
	$Class.add = function(input){
		const convo = {}
		convo.id = Convo.count
		convo.title = input.title
		DB.convos[convo.id] = convo

		const convoPostList = {}
		convoPostList.id = convo.id
		convoPostList.posts = []
		DB.convoPosts[convo.id] = convoPostList

		Convo.count += 1
		return convo
	}
	$Class.all = function(){
		return Object.values(DB.convos)
	}
	$Class.load = function(id){
		return DB.convos[id]
	}

	return $Class

})();

module.exports = Convo

'use strict';

const DB = require('./_connection')

const Convo = (() => {

	const $Class = {}
	$Class.count = 0
	$Class.add = function(input){
		const convo = Object.create($instance)
		convo.id = Convo.count
		convo.title = input.title
		DB.convos[convo.id] = convo

		const postList = {}
		postList.count = 0
		postList.id = convo.id
		postList.posts = {}
		DB.convoPosts[convo.id] = postList

		Convo.count += 1
		return convo
	}
	$Class.all = function(){
		return Object.values(DB.convos)
	}
	$Class.load = function(id){
		return DB.convos[id]
	}

	const $instance = {}
	$instance.getPostList = function(){
		const convo = this
		return DB.convoPosts[convo.id]
	}
	$instance.post = function(input){
		const convo = this
		const postList = convo.getPostList()
		const post = {
			text: input.text
		}
		postList.posts[postList.count] = post
		postList.count += 1
		return post
	}
	return $Class

})();

module.exports = Convo

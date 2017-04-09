'use strict';

const DB = require('./_connection')

const User = (() => {

	const $Class = {}
	$Class.count = 0
	$Class.add = function(input){
		const user = Object.create($instance)
		user.name = input.name
		user.password = input.password
		if(DB.users[user.name]){
			return false
		}else{
			DB.users[user.name] = user
			return user
		}
	}
	$Class.all = function(){
		return Object.values(DB.users)
	}
	$Class.signIn = function(input){
		const user = DB.users[input.name]
		let output = null
		if(user && user.password == input.password){
			output = JSON.parse(JSON.stringify(user))
			delete output.password
		}
		return output
	}
	$Class.getCurrent = function(req, res, next){
		const user = Object.create($instance)
		req.currentUser = undefined
		try{
			let clientUser = JSON.parse(req.cookies['user'])
			user.data = DB.users[clientUser.name]
			req.currentUser = user.data
			next()
		}catch(e){
			next()
		}
	}

	const $instance = {}

	return $Class

})();

module.exports = User

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

	const $instance = {}

	return $Class

})();

module.exports = User

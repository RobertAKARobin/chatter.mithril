const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const http = require('http')
const socketio = require('socket.io')


const httpServer = express()
const baseServer = http.createServer(httpServer)
const socketServer = socketio(baseServer)

const DB = require('./db/_connection')
const Convo = require('./db/convo')

let postID = 0
function addPost(convoID, text){
	postID += 1
	const post = {
		text
	}
	DB.convoPosts[convoID].posts[postID] = post
	return post
}

function addUser(name, password){
	const user = {
		name,
		password
	}
	if(DB.users[name]){
		return false
	}else{
		DB.users[name] = user
		return user
	}
}

;(function seed(){
	[
		{title: 'Is the API working?'},
		{title: 'Is the API still working?'}
	].forEach(Convo.add)
})();

baseServer
	.listen('3000', () => console.log(Date().toLocaleString()))

socketServer
	.on('connection', (socket) => {
		socket.on('joinConvo', (convoID) => {
			socket.join(convoID)
		})
	})

httpServer
	.use('/', express.static('./public'))
	.use('/vendor', express.static('./node_modules'))
	.use(bodyParser.json())
	.use(cookieParser())

httpServer
	.get('/db', (req, res) => {
		res.json({
			db: DB
		})
	})
	.get('/convos', (req, res) => {
		res.json({
			convos: Object.values(DB.convos)
		})
	})
	.post('/convos', (req, res) => {
		socketServer.sockets.emit('newConvo', {
			convo: Convo.add(req.body.convo)
		})
		res.json({success: true})
	})
	.get('/convo/:id', (req, res) => {
		const id = req.params.id
		const convo = DB.convos[id]
		convo.posts = Object.values(DB.convoPosts[id].posts)
		res.json({
			convo
		})
	})
	.post('/convo/:id', (req, res) => {
		const id = req.params.id
		socketServer.sockets.in(id).emit('newPost', {
			post: addPost(req.params.id, req.body.post.text)
		})
		res.json({success: true})
	})
	.get('/users', (req, res) => {
		res.json({
			users: Object.values(DB.users)
		})
	})
	.post('/users', (req, res) => {
		const user = addUser(req.body.user.name, req.body.user.password)
		if(user){
			socketServer.sockets.emit('newUser', {
				user
			})
			res.json({
				success: true,
				message: 'now sign in'
			})
		}else{
			res.json({
				success: false,
				message: "username is taken"
			})
		}
	})
	.post('/session', (req, res) => {
		const input = req.body.user
		const user = DB.users[input.name]
		if(user && user.password == input.password){
			res.cookie('user', JSON.stringify(user))
			res.json({success: true})
		}else{
			res.json({
				success: false,
				message: "the username and password don't match"
			})
		}
	})
	.delete('/session', (req, res) => {
		res.clearCookie('user')
		socketServer.sockets.emit('signOut')
		res.json({success: true})
	})

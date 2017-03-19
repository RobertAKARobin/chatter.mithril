const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const socketio = require('socket.io')

const httpServer = express()
const baseServer = http.createServer(httpServer)
const socketServer = socketio(baseServer)
const db = {
	convoList: {},
	convo: {},
	users: {}
}

let convoID = 0
function addConvo(title){
	convoID += 1
	const convoListItem = {
		id: convoID,
		title: title
	}
	const convo = {
		id: convoID,
		posts: []
	}
	db.convoList[convoID] = convoListItem
	db.convo[convoID] = convo
	return convoListItem
}

let postID = 0
function addPost(convoID, text){
	postID += 1
	const post = {
		text
	}
	db.convo[convoID].posts[postID] = post
	return post
}

function addUser(name, password){
	const user = {
		name,
		password
	}
	if(db.users[name]){
		return false
	}else{
		db.users[name] = user
		return user
	}
}

new function seed(){
	[
		'Is the API working?',
		'Is the API still working?'
	].forEach(addConvo)
}

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

httpServer
	.get('/convos', (req, res) => {
		res.json({
			convos: Object.values(db.convoList)
		})
	})
	.post('/convos', (req, res) => {
		socketServer.sockets.emit('newConvo', {
			convo: addConvo(req.body.convo.title)
		})
		res.json({success: true})
	})
	.get('/convo/:id', (req, res) => {
		const id = req.params.id
		const convo = db.convoList[id]
		convo.posts = Object.values(db.convo[id].posts)
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
			users: Object.values(db.users)
		})
	})
	.post('/users', (req, res) => {
		const user = addUser(req.body.user.name, req.body.user.password)
		if(user){
			socketServer.sockets.emit('newUser', {
				user
			})
			res.json({success: true})
		}else{
			res.json({success: false})
		}
	})

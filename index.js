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
const User = require('./db/user')

;(function seed(){
	[
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
	].forEach((input) => {
		const convo = Convo.add({title: input.title})
		for(let i = 0, l = input.posts.length; i < l; i++){
			convo.post({text: input.posts[i]})
		}
	});
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
	.use((req, res, next) => {
		res.report = function(code, message){
			let output = {}
			if(typeof message == 'object'){
				output = message
			}else{
				output.message = message
			}
			output.success = (code < 400)
			// res.statusCode = code
			res.json(output)
		}
		next()
	})

httpServer
	.get('/db', (req, res) => {
		const db = DB
		res.report(200, { db })
	})
	.get('/convos', (req, res) => {
		const convos = Convo.all()
		res.report(200, { convos })
	})
	.post('/convos', User.getCurrent, (req, res) => {
		if(req.currentUser){
			const convo = Convo.add(req.body.convo)
			socketServer.sockets.emit('newConvo', { convo })
			res.report(200)
		}else{
			res.report(401, 'you must be signed in to make a convo')
		}
	})
	.get('/convo/:id', (req, res) => {
		const convo = Convo.load(req.params.id)
		const posts = convo.getPostList()
		res.report(200, { convo, posts })
	})
	.post('/convo/:id', User.getCurrent, (req, res) => {
		if(req.currentUser){
			const convo = Convo.load(req.params.id)
			const post = convo.post({text: req.body.post.text})
			socketServer.sockets.in(convo.id).emit('newPost', { post })
			res.report(200)
		}else{
			res.report(401, 'you must be signed in to make a post')
		}
	})
	.get('/users', (req, res) => {
		const users = User.all()
		res.report(200, { users })
	})
	.post('/users', (req, res) => {
		const user = User.add(req.body.user)
		if(user){
			socketServer.sockets.emit('newUser', { user })
			res.report(200, 'now sign in')
		}else{
			res.report(401, 'username is taken')
		}
	})
	.post('/session', (req, res) => {
		const user = User.signIn(req.body.user)
		if(user){
			res.cookie('user', JSON.stringify(user))
			res.report(200)
		}else{
			res.report(400, 'the username and password don\'t match')
		}
	})
	.delete('/session', (req, res) => {
		res.clearCookie('user')
		socketServer.sockets.emit('signOut')
		res.report(200)
	})

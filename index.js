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

httpServer
	.get('/db', (req, res) => {
		res.json({
			db: DB
		})
	})
	.get('/convos', (req, res) => {
		res.json({
			convos: Convo.all()
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
		const convo = Convo.load(id)
		res.json({
			convo,
			posts: Object.values(convo.getPostList().posts)
		})
	})
	.post('/convo/:id', (req, res) => {
		const convo = Convo.load(req.params.id)
		socketServer.sockets.in(convo.id).emit('newPost', {
			post: convo.post({text: req.body.post.text})
		})
		res.json({success: true})
	})
	.get('/users', (req, res) => {
		res.json({
			users: User.all()
		})
	})
	.post('/users', (req, res) => {
		const user = User.add(req.body.user)
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
		const user = User.signIn(req.body.user)
		if(user){
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

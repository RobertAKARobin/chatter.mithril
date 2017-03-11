const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const socketio = require('socket.io')

const httpServer = express()
const baseServer = http.createServer(httpServer)
const socketServer = socketio(baseServer)
const db = {
	questions: []
}

new function seed(){
	[
		'Is the API working?',
		'Is the API still working?'
	].forEach((question, index) => {
		db.questions.push({
			id: index,
			text: question
		})
	})
}

baseServer
	.listen('3000', () => console.log(Date().toLocaleString()))

socketServer
	.on('connect', (client) => {
		client.emit('greeting', {
			message: 'Hello, from the back-end!'
		})
	})

httpServer
	.use('/', express.static('./public'))
	.use('/vendor', express.static('./node_modules'))
	.use(bodyParser.json())

httpServer
	.get('/questions', (req, res) => {
		res.json({
			questions: db.questions
		})
	})
	.post('/questions', (req, res) => {
		const question = req.body.question
		question.id = db.questions.length;
		db.questions.push(question)
		socketServer.sockets.emit('newQuestion', {
			question
		})
		res.json({success: true})
	})

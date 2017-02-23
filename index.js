const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const socketio = require('socket.io')

const httpServer = express()
const baseServer = http.createServer(httpServer)
const socketServer = socketio(baseServer)
const db = {
	questions: [
		'Is the API working?',
		'Is the API still working?'
	]
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
	.get('/questions', (req, res) => res.json(db.questions))
	.post('/questions', (req, res) => {
		db.questions.push(req.body.question)
		res.json({success: true})
	})

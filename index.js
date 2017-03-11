const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const socketio = require('socket.io')

const httpServer = express()
const baseServer = http.createServer(httpServer)
const socketServer = socketio(baseServer)
const db = {
	questions: {}
}

let questionID = 0
function addQuestionListItem(text){
	questionID += 1
	const question = {
		id: questionID,
		text: text
	}
	db.questions[questionID] = question
	return question
}

new function seed(){
	[
		'Is the API working?',
		'Is the API still working?'
	].forEach(addQuestionListItem)
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
			questions: Object.values(db.questions)
		})
	})
	.post('/questions', (req, res) => {
		socketServer.sockets.emit('newQuestion', {
			question: addQuestionListItem(req.body.question.text)
		})
		res.json({success: true})
	})
	.get('/question/:id', (req, res) => {
		res.json({
			question: db.questions[req.params.id]
		})
	})

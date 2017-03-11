const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const socketio = require('socket.io')

const httpServer = express()
const baseServer = http.createServer(httpServer)
const socketServer = socketio(baseServer)
const db = {
	convoList: {}
}

let convoID = 0
function addConvo(title){
	convoID += 1
	const convoListItem = {
		id: convoID,
		title: title
	}
	db.convoList[convoID] = convoListItem
	return convoListItem
}

new function seed(){
	[
		'Is the API working?',
		'Is the API still working?'
	].forEach(addConvo)
}

baseServer
	.listen('3000', () => console.log(Date().toLocaleString()))

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
		res.json({
			convo: db.convoList[req.params.id]
		})
	})

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = {
	questions: [
		'Is the API working?',
		'Is the API still working?'
	]
}

app
	.use('/', express.static('./public'))
	.use('/vendor', express.static('./node_modules'))
	.use(bodyParser.json())
	.listen('3000', () => console.log(Date().toLocaleString()))

app
	.get('/questions', (req, res) => res.json(db.questions))
	.post('/questions', (req, res) => {
		db.questions.push(req.body.question)
		res.json({success: true})
	})

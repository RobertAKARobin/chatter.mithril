const express = require('express')
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
	.listen('3000', () => console.log(Date().toLocaleString()))

app
	.get('/questions', (req, res) => res.json(db.questions))

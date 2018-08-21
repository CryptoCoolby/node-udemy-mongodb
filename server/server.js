const express = require('express')
const bodyParser = require('body-parser')

const {mongoose} = require('./db/mongoose')
const {User, Todo, newEntry} = require('./models/models')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true})

let app = express()

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    newEntry(req.body, Todo)
    .then((result) => {
        res.send(result)
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (e) => {
        res.status(400).send(e)
    })
})

app.listen(3000, console.log('started on port 3000'))

// newEntry({text: 'constructor'}, Todo)
// newEntry({userName: "moduled", email: "ndl"}, User)

module.exports = {app}

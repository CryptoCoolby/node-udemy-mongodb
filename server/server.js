const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {User, Todo, newEntry} = require('./models/models')

// mongoose.Promise = global.Promise
// mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true})

let app = express()
const port = process.env.PORT || 3000

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

app.get('/todo/:id', (req, res) => {
    Todo.findById(req.params.id).then((todo) => {
        if (todo) {
            res.send({todo})
        } else {
            res.status(404).send()
        }
    }, (e) => {
        res.status(400).send(e)
    })
})

app.delete('/todo/:id', (req, res) => {
    Todo.findByIdAndDelete(req.params.id).then((todo) => {
        if (todo) {
            res.send({todo})
        } else {
            res.status(404).send()
        }
    }, (e) => {
        res.status(400).send(e)
    })
})



app.listen(port, console.log('started on port', port))

// newEntry({text: 'constructor'}, Todo)
// newEntry({userName: "moduled", email: "ndl"}, User)

module.exports = {app}

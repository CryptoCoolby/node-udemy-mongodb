 const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')
const _ = require('lodash')

const {mongoose} = require('./db/mongoose')
const {User, Todo, newEntry} = require('./models/models')
const {authenticate} = require('./middleware/authenticate')

// mongoose.Promise = global.Promise
// mongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true})

let app = express()
const port = process.env.PORT || 3000


app.use(bodyParser.json())

// ----------------------------------------------
//      HANDLE TODO REQUESTS
// ----------------------------------------------

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

app.patch('/todo/:id', (req, res) => {
    if (!req.params) {
        return res.status(404).send()
    }
    let body = _.pick(req.body, ['text', 'completed'])

    if (body.completed == true) {
        body.completedAt = new Date()
    } else {
        body.completed = false
        body.completedAt = null
    }

    Todo.findByIdAndUpdate(req.params.id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send()
        }

        res.send(todo)
    }).catch((e) => {
        res.status(400).send()
    })
})

// ----------------------------------------------
//      HANDLE USER REQUESTS
// ----------------------------------------------

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email','password'])
    let user

    newEntry(body, User).then((res) => {
        user = res
        return user.generateAuthToken()
    }).then((token) => {
        res.header('x-auth', token).send(user)
    }).catch((e) => {
        console.log(e)
        res.status(400).send(e)
    })
})


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})



app.listen(port, console.log('started on port', port))

// newEntry({text: 'constructor'}, Todo)
// newEntry({userName: "moduled", email: "ndl"}, User)

module.exports = {app}

const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const {Todo, User} = require('./../../models/models')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()
const testid = new ObjectID()

const users = [{
    _id: userOneId,
    email: 'crypto@coolby.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
        }]
    }, {
        _id: userTwoId,
        email: 'jen@coolby.com',
        password: 'userTwoPass'
}]
const todos = [{
    text: "first"
}, {
    text: "second",
    _id: testid
}]

const populateTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        Todo.insertMany(todos)
    }).then(() => done())
}

const populateUsers = (done) => {
    User.remove({}).then((res) => {
        let userOne = new User(users[0]).save()
        let userTwo = new User(users[1]).save()

        return Promise.all([userOne, userTwo])
    }).then(() => done())
}

module.exports = {testid, todos, populateTodos, users, populateUsers};

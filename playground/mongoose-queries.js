const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo, User} = require('./../server/models/models')

let id = '5b7c573fa21bca46884a92c8'
let Userid = '5b7c27469c83c8860c73c2df'

// if (!ObjectID.isValid(id)) {
//     console.log('invalid id')
// }
//
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos)
// })
//
// Todo.findOne({
//     _id: id
// }).then(todo => {
//     console.log('Todo', todo)
// })
//
// Todo.findById(id).then(todo => {
//     if (!todo) {
//         return console.log("Id not found")
//     }
//     console.log('Todo By Id', todo)
// }).catch((e) => console.log(e))

User.findById(Userid).then(user => {
    if (!user) {
        return console.log("Id not found")
    }
    console.log('User By Id', user)
}).catch((e) => console.log(e))

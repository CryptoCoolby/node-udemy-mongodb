const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo, User} = require('./../server/models/models')

let id = '5b7c573fa21bca46884a92c8'
let Userid = '5b7c27469c83c8860c73c2df'

// Todo.deleteMany({}).then((res) => {
//     console.log(res)
// })

// Todo.findOneAndDelete({}).then((res) => {
//     console.log(res)
// })

Todo.findByIdAndDelete('5b7d22052528b5580ccacf4d').then((res) => {
    console.log(res)
})

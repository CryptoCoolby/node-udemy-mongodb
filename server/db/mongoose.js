const mongoose = require('mongoose')

mongoose.Promise = global.Promise;

(async function () {
    await mongoose.connect('mongodb://127.0.0.1:27017/TodoApp', {useNewUrlParser: true})
        .then((res) => {
            console.log('connected to local db')
        }, async function () {
            await mongoose.connect('mongodb://asdf1234:asdf1234@ds125302.mlab.com:25302/herokutodosappdb')
            .then((res) => {
                console.log('connected to remote db')
            }, () => {
                console.error('Unable to connect to database');
            })
        })
})()

module.exports = {mongoose}

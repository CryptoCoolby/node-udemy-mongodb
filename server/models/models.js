const mongoose = require('mongoose')

const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        minlength: 1,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
})

const User = mongoose.model('User', {
    userName: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    }
})

let newEntry = (item, model) => {
    return new Promise(function(resolve, reject) {
        new model (item)
        .save().then((res) => {
            console.log('saved entry', res)
            resolve(res)
        }, (e) => {
            // console.log(e)
            reject(e)
        })
    });
}

module.exports = {User, Todo, newEntry}

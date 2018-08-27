const validator = require('validator')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

// ----------------------------------------------
//      TODO MODEL
// ----------------------------------------------

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
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

// ----------------------------------------------
//      USER MODEL
// ----------------------------------------------

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 3,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "{VALUE} is not a valid email"
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6 
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.statics.findByToken = function (token) {
    let User = this
    let decoded

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        // return new Promise((res, rej) => {
        //     reject()
        // })
        return Promise.reject()
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

UserSchema.pre('save', function (next) {
    let user = this

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

UserSchema.methods.toJSON = function () {
    let user = this
    let userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
    let user = this
    let access = 'auth'
    let token = jwt.sign({_id: user.id.toString(), access}, process.env.JWT_SECRET).toString()

    user.tokens = user.tokens.concat([{access, token}])

    return user.save().then(() => token)
}

UserSchema.methods.removeToken = function (token) {
    let user = this

    return user.update({
        $pull: {
            tokens: {token}
        }
    })
}

const User = mongoose.model('User', UserSchema)

let newEntry = (item, model) => {
    return new Promise(function(resolve, reject) {
        new model (item)
        .save().then((res) => {
            // console.log('saved entry', res)
            resolve(res)
        }, (e) => {
            // console.log(e)
            reject(e)
        })
    });
}

module.exports = {User, Todo, newEntry}

const mongoose = require('mongoose')

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV === "production") {
     mongoose.connect(process.env.MONGODB_URI)
} else {
    mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})
}

module.exports = {mongoose}

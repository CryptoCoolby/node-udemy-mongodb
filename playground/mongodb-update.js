// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')


MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.error('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    // findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5b7bd7602067f2828ae3a675')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((res) => {
    //     console.log(res)
    // })

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b7bd31565eef41de048d580')
    }, {
        $set: {
            name: 'Coolby'
        },
        $inc: {
            age: 1
        }
    })

    // client.close()
})

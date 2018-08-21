// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')


MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.error('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Kick ass'}).then((res) => {
    //     console.log(res)
    // })

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Kick ass'}).then((res) => {
    //     console.log(res)
    // })

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((res) => {
    //     console.log(res)
    // })


    // db.collection('Users').findOneAndDelete({_id: new ObjectID('5b7bd42d3ed4bc4008ff25aa')}).then((res) => {
    //     console.log(res)
    // })
    //
    // db.collection('Users').deleteMany({name: 'Dani'})

    // client.close()
})

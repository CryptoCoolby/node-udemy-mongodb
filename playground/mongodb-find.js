// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')


MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.error('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    // db.collection('Todos').find({
    //     _id: new ObjectID('5b7bd7602067f2828ae3a675')
    // }).toArray().then((resolve) => {
    //     console.log('Todos')
    //     console.log(JSON.stringify(resolve, undefined, 2))
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // })

    // db.collection('Todos').find().count().then((resolve) => {
    //     console.log(`Todos count: ${resolve}`)
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // })

    db.collection('Todos').find().count().then((resolve) => {
        console.log(JSON.stringify(resolve, undefined, 2))
    }, (err) => {
        console.log('Unable to fetch todos', err)
    })

    client.close()
})

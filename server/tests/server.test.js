const expect = require('expect')
const request = require('supertest')
const mongoose = require('mongoose')

const {
    app
} = require('./../server')
const {
    Todo,
    User
} = require('./../models/models')
const testid = mongoose.Types.ObjectId()
const todos = [{
    text: "first"
}, {
    text: "second",
    _id: testid
}]

beforeEach((done) => {
    Todo.deleteMany({})
        .then(() => {
            return Todo.insertMany(todos)
        })
        .then(() => {
            done()
        })

})

describe('GET /todo/:id', () => {
    it('should return todo by id', (done) => {

        request(app)
            .get('/todo/'+testid.toString())
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe("second")
                expect(res.body.todo._id).toBe(testid.toString())
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                done()
            })

    })

    it('should return 404 for non-existing or empty id', (done) => {

        request(app)
            .get('/todo/5b7c573fa21bca46884a92c8')
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
            })

        request(app)
            .get('/todo/')
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                done()
            })

    })

    it('should return 400 for invalid id', (done) => {

        request(app)
            .get('/todo/heyho')
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                done()
            })

    })
})

describe('GET /todos', () => {
    it('should list all todos', (done) => {

        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos[1].text).toBe("second")
                expect(res.body.todos.length).toBe(2)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                done()
            })

    })
})

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = "tododo"

        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find().then((todos) => {
                        expect(todos.length).toBe(3)
                        expect(todos[2].text).toBe(text)
                        done()
                    })
                    .catch(e => done(e))
            })
    })

    it('should not create todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(JSON.parse(res.text).name).toBe("ValidationError")
                Todo.find().then((todos) => {
                        expect(todos.length).toBe(2)
                        done()
                    })
                    .catch(e => done(e))
            })

    })
})

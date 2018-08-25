const expect = require('expect')
const request = require('supertest')
const mongoose = require('mongoose')

const {app} = require('./../server')
const {Todo, User} = require('./../models/models')
const {populateTodos, testid, todos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('GET /users/login', () => {

    it('should return email, id and auth token if valid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: 'crypto@coolby.com',
                password: 'userOnePass'
            })
            .expect(200)
            .expect((res) => {
                User.findOne({email: 'crypto@coolby.com'}).then((user) => {
                    expect(user.tokens[user.tokens.length - 1].token)
                    .toBe(res.headers["x-auth"])
                    expect(user.tokens[user.tokens.length - 1].access)
                    .toBe('auth')
                })
                expect(res.body.email).toBe('crypto@coolby.com')
            })
            .end(done)
    })

    it('should return 401 if invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: 'crypto@coolby.com',
                password: 'userOnePasss'
            })
            .expect(401)
            .expect((res) => {
                expect(res.body.email).toBeFalsy()
                expect(res.headers["x-auth"]).toBeFalsy()
            })

        request(app)
            .post('/users/login')
            .send({
                email: 'crypto@cooby.com',
                password: 'userOnePass'
            })
            .expect(401)
            .expect((res) => {
                expect(res.body.email).toBeFalsy()
                expect(res.headers["x-auth"]).toBeFalsy()
            })
            .end(done)
    })
})

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token.slice(1) + 'f')
            .expect(401)
            .end(done)
    })
})

describe('POST /users', () => {

    it('should create a user', (done) => {
        let email = "crypto.cool@by.io"
        let password = "123asd!"

        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toBeTruthy()
                expect(res.body._id).toBeTruthy()
                expect(res.body.email).toBe(email)
            })
            .end((err) => {
                if (err) {
                    return done(err)
                }
                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy()
                    expect(user.password).not.toBe(password)
                    done()
                })
            })
    })

    it('should not create user if email is duplicate', (done) => {
        let email = 'crypto@coolby.com'
        let password = "anything"

        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers["x-auth"]).toBeFalsy()
                expect(res.body._id).toBeFalsy()
                expect(res.body.email).toBeFalsy()
            })
            .end((err) => {
                if (err) {
                    return done(err)
                }
                User.find({email}).then((user) => {
                    expect(user.length).toBe(1)
                    done()
                })
            })

    })

    it('should return validation errors if request is invalid', (done) => {
        let email = 'cryptocoolbycom'
        let password = 'fourbyfour'

        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers["x-auth"]).toBeFalsy()
                expect(res.body._id).toBeFalsy()
                expect(res.body.email).toBeFalsy()
            })
            .end((err) => {
                if (err) {
                    return done(err)
                }
                User.find({email}).then((user) => {
                    expect(user.length).toBe(0)
                })
            })

        email = 'cryp@to.io'
        password = 'four'

            request(app)
                .post('/users')
                .send({
                    email,
                    password
                })
                .expect(400)
                .expect((res) => {
                    expect(res.headers["x-auth"]).toBeFalsy()
                    expect(res.body._id).toBeFalsy()
                    expect(res.body.email).toBeFalsy()
                })
                .end((err) => {
                    if (err) {
                        return done(err)
                    }
                    User.find({email}).then((user) => {
                        expect(user.length).toBe(0)
                        done()
                    })
                })
    })
})

describe('GET /todo/:id', () => {
    it('should return todo by id', (done) => {

        request(app)
            .get('/todo/' + testid.toString())
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe("second")
                expect(res.body.todo._id).toBe(testid.toString())
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
            })
        done()
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

describe('PATCH /todo/:id', () => {

    it('should set todo to completed and add completion time', (done) => {

        request(app)
            .patch('/todo/' + testid.toString())
            .send({
                completed: true,
                text: "changedtext"
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.completed).toBe(true)
                expect(res.body.text).toBe("changedtext")
                expect(res.body.completedAt).toBeTruthy()
                expect(res.body._id).toBe(testid.toString())
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                done()
            })

    })

    it('should set todo completed to false and remove completion time', (done) => {

        request(app)
            .patch('/todo/' + testid.toString())
            .expect(200)
            .expect((res) => {
                expect(res.body.completed).toBe(false)
                expect(res.body.completedAt).toBeFalsy()
                expect(res.body._id).toBe(testid.toString())
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
            .patch('/todo/5b7c573fa21bca46884a92c8')
            .send({
                completed: true
            })
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
            })

        request(app)
            .patch('/todo/')
            .send({
                completed: true
            })
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
            .patch('/todo/heyho')
            .send({
                completed: true
            })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                done()
            })

    })
})

describe('DELETE /todo/:id', () => {
    it('should delete and return todo by id', (done) => {

        request(app)
            .delete('/todo/' + testid.toString())
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe("second")
                expect(res.body.todo._id).toBe(testid.toString())
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find().then((todos) => {
                        expect(todos.length).toBe(1)
                        Todo.findById(testid).then((todo) => {
                            expect(todo).toBe(null)
                        })
                    })
                    .catch(e => done(e))

                done()
            })

    })

    it('should return 404 for non-existing or empty id', (done) => {

        request(app)
            .delete('/todo/5b7c573fa21bca46884a92c8')
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
            })

        request(app)
            .delete('/todo/')
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
            .delete('/todo/heyho')
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                done()
            })

    })
})

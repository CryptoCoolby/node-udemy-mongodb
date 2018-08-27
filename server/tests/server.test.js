const expect = require('expect')
const request = require('supertest')
const mongoose = require('mongoose')

const {app} = require('./../server')
const {Todo, User} = require('./../models/models')
const {populateTodos, testid, todos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('DELETE /users/me/logout', () => {

    it('should get 200 if logged in and 401 if logged out', (done) => {
        let token = users[0].tokens[0].token.toString()
        request(app)
            .delete('/users/me/logout')
            .set('x-auth', token)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                request(app)
                    .delete('/users/me/logout')
                    .set('x-auth', token)
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err)
                        done()
                    })
            })

    })

})

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
    it('should return todo by id if authenticated', (done) => {

        request(app)
            .get('/todo/' + testid.toString())
            .set('x-auth', users[1].tokens[0].token)
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

    it('should not return other users\' todo', (done) => {

        request(app)
            .get('/todo/' + testid.toString())
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
            })

        request(app)
            .get('/todo/')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos[0].text).toBe("first")
                expect(res.body.todos.length).toBe(1)
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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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

    it('should change todo text, set todo to completed and add completion time then set to uncompleted and remove completion time', (done) => {

        request(app)
            .patch('/todo/' + testid.toString())
            .set('x-auth', users[1].tokens[0].token)
            .send({
                completed: true,
                text: "changedtext"
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.n).toBe(1)
                expect(res.body.nModified).toBe(1)
                expect(res.body.ok).toBe(1)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                request(app)
                    .get('/todo/' + testid.toString())
                    .set('x-auth', users[1].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.todo.completed).toBe(true)
                        expect(res.body.todo.text).toBe("changedtext")
                        expect(res.body.todo.completedAt).toBeTruthy()
                        expect(res.body.todo._id).toBe(testid.toString())
                    })
                    .end((err, res) => {
                        if (err) {
                            return done(err)
                        }
                        request(app)
                            .patch('/todo/' + testid.toString())
                            .set('x-auth', users[1].tokens[0].token)
                            .expect(200)
                            .expect((res) => {
                                expect(res.body.n).toBe(1)
                                expect(res.body.nModified).toBe(1)
                                expect(res.body.ok).toBe(1)
                            })
                            .end((err, res) => {
                                if (err) {
                                    return done(err)
                                }
                                request(app)
                                    .get('/todo/' + testid.toString())
                                    .set('x-auth', users[1].tokens[0].token)
                                    .expect(200)
                                    .expect((res) => {
                                        expect(res.body.todo.completed).toBe(false)
                                        expect(res.body.todo.text).toBe("changedtext")
                                        expect(res.body.todo.completedAt).toBeFalsy()
                                        expect(res.body.todo._id).toBe(testid.toString())
                                    })
                                    .end((err, res) => {
                                        if (err) {
                                            return done(err)
                                        }
                                        done()
                                    })
                            })
                    })
            })

    })

    it('should return not modified for non-existing or 404 for empty id', (done) => {

        request(app)
            .patch('/todo/5b7c573fa21bca46884a92c8')
            .set('x-auth', users[1].tokens[0].token)
            .send({
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.n).toBe(0)
                expect(res.body.nModified).toBe(0)
                expect(res.body.ok).toBe(1)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                request(app)
                    .patch('/todo/')
                    .set('x-auth', users[1].tokens[0].token)
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


    })

    it('should return 400 for invalid id', (done) => {

        request(app)
            .patch('/todo/heyho')
            .set('x-auth', users[1].tokens[0].token)
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

    it('should return 401 if unauthorized', (done) => {

        request(app)
            .patch('/todo/' + testid.toString())
            .send({
                completed: true
            })
            .expect(401)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                done()
            })

    })
})

describe('DELETE /todo/:id', () => {

    it('should not delete if not authenticated', (done) => {

        request(app)
            .delete('/todo/' + testid.toString())
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.n).toBe(0)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find().then((todos) => {
                        expect(todos.length).toBe(2)
                        Todo.findById(testid).then((todo) => {
                            expect(todo).toBeTruthy()
                        })
                    })
                    .catch(e => done(e))

                done()
            })

    })

    it('should delete and return todo by id', (done) => {

        request(app)
            .delete('/todo/' + testid.toString())
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.n).toBe(1)
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
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.n).toBe(0)
            })
            .end((err, res) => {
                if (err) return done(err)
                request(app)
                    .delete('/todo/')
                    .set('x-auth', users[1].tokens[0].token)
                    .expect(404)
                    .end((err, res) => {
                        if (err) {
                            return done(err)
                        }
                        done()
                    })

            })


    })

    it('should return 400 for invalid id', (done) => {

        request(app)
            .delete('/todo/heyho')
            .set('x-auth', users[1].tokens[0].token)
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                done()
            })

    })
})

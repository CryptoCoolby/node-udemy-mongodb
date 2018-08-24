const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

let password = '123abc!'

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash)
    })
})

hashedPassword = '$2a$10$5jMh/qTlgNwBZC16UyocJe.bH231C5tFWmJwlluB.x7cwZaOQVR8y'

bcrypt.compare('123abc', hashedPassword, (err, res) => {
    console.log(res)
})
// let data = {
//     id: 1
// }
//
// let token = jwt.sign(data, '123abc')
// console.log(token)
//
// let decoded = jwt.verify(token, '123abc')
// console.log('decoded', decoded)


// let message = 'I am user number 4'
// let hash = SHA256(message)
//
// console.log(message)
// console.log(hash.toString())
//
// let data = {
//     id: 4
// }
//
// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
//
// // token.data.id = 5
// // token.hash = SHA256(JSON.stringify(data)).toString()
//
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()
//
// if (resultHash === token.hash) {
//     console.log('Data was not changed')
// } else {
//     console.log('Data was changed, dont trust')
// }

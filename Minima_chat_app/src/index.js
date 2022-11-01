const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const User = require("../public/models/user")
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const bodyparser = require("body-parser")
app.use(bodyparser.urlencoded({ extended: false, type: "application/x-www-form-urlencoded" }))
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
console.log(publicDirectoryPath)
const mongoose = require("mongoose")
const multer = require('multer')
require("../public/db/mongoose")

app.use(express.static(publicDirectoryPath))







//Signup page psot request
app.post("/", async (req, res) => {

    console.log("POST method on signup page executed")
    console.log(req.body)
    const user = new User(req.body)
    user.save()
    res.status('200').redirect("/login.html?room=" + req.body.room)



})

app.post("/login.html", async (req, res) => {

    var username = req.body.username
    var password = req.body.password

    var data =
    {
        "username": username,
        "password": password,

    }
    const user = await mongoose.connection.collection('users').findOne({ username: data.username })
    //  console.log(user.room[0])
    if (!user) {
        return res.sendFile(publicDirectoryPath + "/tryagain.html")
    }
    if (user.password !== data.password) {
        return res.sendFile(publicDirectoryPath + "/tryagain.html")
    }
    res.redirect("./chat.html?username=" + username + "&room=" + user.room[0])

    //  res.sendFile(publicDirectoryPath+"/chat.html")

})

app.post("/chat.html", async (req, res) => {
    // socket.join(req.body.chatroom)
    // console.log(req)
    console.log("connected succesfully to " + req.body.chatroom)
    res.redirect("./chat.html?username=" + req.query?.username + "&room=" + req.body.chatroom)
    // if (await mongoose.connection.collection('users').findOne({ : req.body.chatroom })) {
    //     console.log("Room name already exist")
    // }
    // else {
    //     mongoose.connection.collection('users').insertOne({ room: req.body.chatroom })
    // }
    const obj = await mongoose.connection.collection('users').find({ room: "Ninad" })
    console.log(obj)
})

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
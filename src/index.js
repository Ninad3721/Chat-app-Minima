const express = require('express')
const path = require('path')
const app = express()
const http = require('http')
const port = process.env.PORT || 3000
const publicDirapth = path.join(__dirname, "./public")
const socketio = require('socket.io')
const { getMessage } = require('./utils/getmessage')
const { getLocation } = require('./utils/getmessage')
const bodyparser = require("body-parser")
require('./db/mongoose')
const User = require('../src/models/user')
const mongoose = require('mongoose')
const Chatroom = require("./models/chatroom")
const user = require('../src/models/user')
const { application } = require('express')
const { userlist, addUser, removeUser, getUser, getUserList } = require("../src/utils/trackUsers")
const server = http.createServer(app)  //We explicitly create a server to pass that as an argument to the socketio and work with it express do it implicitly 
const io = socketio(server)
const multer = require("multer")

app.use(express.static(publicDirapth))
app.use(bodyparser.urlencoded({ extended: false, type: "application/x-www-form-urlencoded" }))
// app.set("view engine", "ejs")



//Setting  up storage engine for multer
const storageEngine = multer.diskStorage({
    destination: "./images",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
    },
});

//making instance of multer
const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});

//Validating file types 
const checkFileType = function (file, cb) {
    //Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg/;
    //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb("Error: You can Only Upload Images!!");
    }
};

let chatroom;
app.get("/", (req, res) => {
    console.log('FILE EXECUTED')
    res.sendFile(__dirname + "/public/index.html")
})

app.post("/", async (req, res) => {
    console.log("post method executed")
    const user = await new User(req.body)
    // var username = req.body.username;
    // var email =req.body.email;
    // var pass = req.body.password;
    // var room = req.body.room
    //  var data={

    //     "username": username,
    //     "email":email,
    //     "password":pass,
    //     "room":room,
    //  }

    try {
        const token = await user.genAuthToken()

        await res.sendFile(__dirname + "/public/login.html")
        console.log(token)
        console.log("Record inserted Successfully");
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }

    //     mongoose.connection.collection('users').insertOne(data,function(err, collection){
    //      if (err) throw err;

    //  })
    ;
})
app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html")
})
app.post("/login", async (req, res) => {

    var username = req.body.username
    var password = req.body.password


    var data =
    {
        "username": username,
        "password": password,

    }
    const user = await mongoose.connection.collection('users').findOne({ username: data.username })

    if (!user) {
        return res.sendFile(__dirname + "/public/tryagain_login.html")
    }
    if (user.password !== data.password) {
        return res.sendFile(__dirname + "/public/tryagain_login.html")
    }
    res.redirect("./chat?username=" + username + "&password=" + password)



})
// app.get('/chat', (req,res)=>
// {
//     res.render("chat")
// })

app.post("/chat", upload.single('uploaded_file'), async (req, res, chatroom, socket, io) => {



    chatroom = req.body.chatroom
    console.log(req.params.username)
    const user = await mongoose.connection.collection('users').findOne({ room: req.body.chatroom })
    socket.on("send-message", (message, callback) => {
        // const user = getUser(socket.id)

        console.log(chatroom)
        io.to(chatroom).emit("message", getMessage(message))
        // callback()
    })
})

app.get("/chat", (req, res) => {
    console.log('Hi')
    console.log(req.query.username)
    res.sendFile(__dirname + "/public/chat.html")


})

app.get("/preview", (req, res) => {
    res.sendFile(__dirname + "/public/preview.html")
})



io.on('connection', (socket) => {
    socket.broadcast.emit('message', getMessage("A new user has joined"))


    // socket.on("send-message",(message, callback)=>
    // {
    //     // const user = getUser(socket.id)

    //     console.log(chatroom)
    //     io.to(chatroom).emit("message", getMessage(message))
    //     // callback()
    // })
    socket.on("send-location", ({ latitude, longitude }, callback) => {
        const user = getUser(socket.id)

        socket.to(user.room).emit("geo-location", getLocation(`https://www.google.com/maps/@${latitude},${longitude}`))
        callback()
    })





    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', getMessage(`${user.username} has left!`))
        }
    })


    socket.on("join", (options, callback, chatroom) => {
        {
            console.log("joined")
            console.log(socket.id)
            // const {error, user} = addUser({id:socket.id, username, roomname})



            // console.log(userlist)
            socket.join(chatroom)
            socket.emit('message', getMessage('Welcome!'))
            socket.broadcast.to(chatroom).emit('message', getMessage(`${user.username} has joined!`))

            // callback()
        }
    })
})





server.listen(3000, () => {
    console.log("Chat App running on port 3000")
})
module.exports = mongoose

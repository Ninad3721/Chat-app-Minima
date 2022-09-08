const express= require('express')
const path =require('path')
const app = express()
const http = require('http')
const port = process.env.PORT || 3000
const publicDirapth = path.join(__dirname, "../public")
const socketio = require('socket.io')
const {getMessage } = require('./utils/getmessage')
const {getLocation} = require('./utils/getmessage')
const bodyparser = require("body-parser")
require('./db/mongoose')
const User = require('../src/models/user')
const mongoose = require('mongoose')
// const {chatRoom_input} = require("../public/js/socketio")                                                       

const server = http.createServer(app)  //We explicitly create a server to pass that as an argument to the socketio and work with it express do it implicitly 
const  io = socketio(server)

// app.use(bodyparser.json())
// app.use(express.json())
app.use(express.static(publicDirapth))

// app.use(bodyparser.urlencoded({extended:true}))
//  app.set("view engine", "html")

// app.get("/index", (req,res)=>
// {
//    res.render("index.html")
// })

// app.post("/index", async(req,res)=>
// { 
//     const user = await new User()

//     var username = req.body.username;
//     var password =req.body.password;
//     var email = req.body.email;
//     var data = {
//         "username": username,
//         "password":password,
//         "email" : email,

//       }       
// mongoose.connection.collection('users').insertOne(data,function(err, collection){
//     if (err) throw err;
//     console.log("Record inserted Successfully");
          
// });})
// app.get("/login", (req,res)=>
// {
//     res.render("login")
// })
// app.post("/login" , async(req, res)=>
// {
//     var username = req.body.username
//     var password = req.body.password
//     var data = 
//     {
//         "username": username,
//         "password" :password,
//     }
//    const user = await mongoose.connection.collection('users').findOne({username:data.username})
//    await console.log(user)
//    if(!user)
//    {
//    return  res.render("tryagain_login")}
//    if(user.password !== data.password)
//    {
//     return  res.render("tryagain_login")
//    }
//    res.render("chat")

// })

// app.get("/chat" , (req,res)=>
// {
//     res.render("chat")
// })
// app.post("/chat" , (req,res)=>
// {
//       console.log({chatRoom_input})
//     console.log(req.body)
//     console.log(chatRoom)
// })



io.on('connection', (socket)=>
{ 
    socket.broadcast.emit('message' , getMessage("A new user has joined"))
    socket.on("send-location", ({latitude, longitude}, callback)=>
    {console.log(latitude, longitude)
        socket.emit("geo-location" ,getLocation(`https://www.google.com/maps/@${latitude},${longitude}`))
        callback()
    })
    socket.on("send-message",(message, callback)=>
    {
        io.emit("message", getMessage(message))
        callback()
    })
    socket.on("disconnect" , ()=>
    {
        socket.broadcast.emit("message", getMessage("A user has left"))
    })
    
    
})

server.listen(3000, ()=>
{
    console.log("Chat App running on port 3000")
})

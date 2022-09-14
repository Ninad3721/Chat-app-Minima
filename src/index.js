const express= require('express')
const path =require('path')
const app = express()
const http = require('http')

const port = process.env.PORT || 3000
const publicDirapth = path.join(__dirname, "./public")
const socketio = require('socket.io')
const {getMessage } = require('./utils/getmessage')
const {getLocation} = require('./utils/getmessage')
const bodyparser = require("body-parser")
require('./db/mongoose')
const User = require('../src/models/user')
const mongoose = require('mongoose')
const Chatroom = require("./models/chatroom")
const user = require('../src/models/user')
const { application } = require('express')
//import { username,password,email } from '../public/js/login.js'     
//   console.log({ username,password,email })                                              

const server = http.createServer(app)  //We explicitly create a server to pass that as an argument to the socketio and work with it express do it implicitly 
const  io = socketio(server)
app.use(express.static(publicDirapth))
app.use(bodyparser.urlencoded({extended:false, type:"application/x-www-form-urlencoded"}))
app.set("view engine", "ejs")


// app.get("/login.html", (req,res)=>
// {
//    res.render("login.html")
//    console.log("login rendered")
// })
app.get("/" , (req,res)=>
{
console.log('FILE EXECUTED')
  res.sendFile(__dirname +"/public/index.html")
})

app.post("/", async(req,res)=>
 { 
    console.log("post method executed")
    const user = await new User()
    var username = req.body.username;
    var email =req.body.email;
    var pass = req.body.password;
    var room = req.body.room
     var data={
    
        "username": username,
        "email":email,
        "password":pass,
        "room":room,
     }
    
    mongoose.connection.collection('users').insertOne(data,function(err, collection){
     if (err) throw err;
     res.sendFile(__dirname+"/public/login.html")
     console.log("Record inserted Successfully");        
 })
;})
 app.get("/login", (req,res)=>
{
    res.sendFile(__dirname +"/public/login.html")
})
app.post("/login" , async(req, res)=>
{
 
    var username = req.body.username
    var password = req.body.password


    var data = 
    {
        "username": username,
        "password" :password,
      
    }
 const user = await mongoose.connection.collection('users').findOne({username:data.username})
 
   if(!user)
   {
   return  res.sendFile(__dirname +"/public/tryagain_login.html")}
   if(user.password !== data.password)
   {
    return  res.sendFile(__dirname +"/public/tryagain_login.html")
   }
//    res.set({'Content-Type': 'application/xhtml+xml; charset=utf-8'});
//    res.locals.text="hello";

    res.render("chat")
})
// app.get('/chat', (req,res)=>
// {
//     res.render("chat")
// })

app.post("/chat" , async (req,res)=>
{
  

    var chatroom = req.body.chatroom
    var data =
    {
        // "username" : username,
        "room" : chatroom,
    }

 const  user = await mongoose.connection.collection('users').findOne({room:req.body.chatroom})  
console.log(user.username)

   res.render("chat", {
    user
   })

}

)

// app.get("/chat", async (req, res)=>
// {
//     const user = await mongoose.connection.collection('users').findOne({username:"varun"})
//     const username = user.username
//     res.render("chat", 
//     {
//         name: username,
//     })
    
    
// })
//    console.log(username)
//     const chatroom_user = await Chatroom.findOne({username: data.username})
//     console.log(chatroom_user.chatroom)



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
    socket.on("join" , (room_name)=>
{
    socket.join(room_name)
})
})

    
 


server.listen(3000, ()=>
{
    console.log("Chat App running on port 3000")
})
module.exports = mongoose

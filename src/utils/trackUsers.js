// const user = require("../models/user");

const userlist = [];
//addUser
const addUser = function({id, username, roomname})
{
   username = username.trim().toLowerCase()
   roomname = roomname.trim().toLowerCase()
   const user = {id, username, roomname}
   userlist.push(user)
   return user;
}

//removeuser
const removeUser = function(id)
{
    const index = userlist.findIndex((user)=>
    {
 
     return user.id === id
      
    })
    console.log(index)
    if(index !== -1)
    {
       return  userlist.splice(index, 1)[0]
    }
}

//getUser
const getUser = function(id)
{
    const index = userlist.findIndex((user)=>
    {
 
     return user.id === id
      
    })
    return userlist[index]  
}

//getUserList
const getUserList = function(roomname)
{
   userlist.filter((user)=>{if(roomname === user.roomname)
    {
        console.log(user)
        return user;
    }}
   
   )
}


addUser({
    id:"234",
    username:"Ninad",
    roomname:"Ninad"
})
addUser({
    id:"214",
    username:"binad",
    roomname:"binad"
})


module.exports = {
    userlist,
    addUser,
    removeUser,
    getUser,
    getUserList
}
// console.log(getUser("123"))
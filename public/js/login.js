
// const mongoose = require('mongoose')
const {username,password,email} = Qs.parse(location.search, {ignoreQueryPrefix: true})
console.log(username,password,email)
// mongoose.connect.collection("users").insertOne({})
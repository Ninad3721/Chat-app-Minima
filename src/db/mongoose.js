const mongoose = require('mongoose')
console.log("connected tot the database")
 mongoose.connect(('mongodb://127.0.0.1:27017/chat_app'),
 {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
 })


 
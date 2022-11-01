const mongoose  = require('mongoose')
console.log("connected to databse")
mongoose.connect(('mongodb://127.0.0.1:27017/chat_app'),
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>
{
    console.log("Connected to DB")
})
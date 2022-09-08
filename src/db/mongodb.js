const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const connectionUrl = 'mongodb://127.0.0.1:27017/chat_app'
const chatapp_users = 'chat-app-users'

MongoClient.connect(connectionUrl, {useNewUrlParser: true}, (error, client)=>
{
    if(error)

        return console.log("errror occured")
    
    const db = client.db(chatapp_users)
    console.log()
}
)

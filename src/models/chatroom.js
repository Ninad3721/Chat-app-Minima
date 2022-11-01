const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema(
    {
        username:
        {
            required: true,
            type: String,
        },
        chatroom:
        {
            unique: true,
            required: true,
            type: String,

        }
    }
)

const Chatroom = mongoose.model("chatroom", UserSchema )
module.exports = Chatroom
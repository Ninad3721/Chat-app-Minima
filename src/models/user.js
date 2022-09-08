const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    password:
    {
     required:true,
       type:String,
       minlength:7,
        validate(value)
        {
            if(vlaue== "password")
            {
                throw new Error("Try another pasword")
            }
        
        }
    },
    username:
    {
        required: true,
        type:String,

    },
    email:
    {
         unique: true,
        required: true,
        type: String,
        validate(value)
        {
            if(validator.isEmail(value) == flase)
            {
                throw new Error("Enter a vlaid email")
            }
        }

    },
    room_name:
    {
        unique: true,
        required: true,
        type: String,
    }
})
const user = mongoose.model("user", UserSchema)
module.exports = user 
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const UserSchema = new mongoose.Schema({
    password:
    {
        sparse : true,
        required:true,
        type:String,
     
        validate(value)
        {
            if(value == "password")
            {
                throw new Error("Try another pasword")
            }
        
        }
    },
    username:
    {
        
        sparse : true,
        required: true,
        type:String,

    },
    email:
    {
        index:true,
        unique: true,
        sparse : true,
        required: true,
        type: String,
        validate(value)
        {
            if(validator.isEmail(value) == false)
            {
                throw new Error("Enter a vlaid email")
            }
        }

    },
    room:[  {
        sparse:true,
        unique: true,
       required: true,
       type: String,
   }],
   tokens:
  [
    {
        token:
        {
                type:String,
                require:true,
        }
       }
  ] 
  
})

UserSchema.methods.genAuthToken = async function()
{
    const user = this
    const token =  jwt.sign({_id: user._id.toString()},'thisismytoken')
    user.tokens = user.tokens.concat({token})
      await user.save()
     return token
}
const user = mongoose.model("user", UserSchema)
module.exports = user 
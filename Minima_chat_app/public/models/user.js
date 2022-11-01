const mongoose = require("mongoose")
const validator  = require("validator")
const UserSchema = new mongoose.Schema({
    username :
    {
        require:true,
        type: String,
        unique:true,
    },

    
    password:
    {
        require:true,
        type: String,
        unique:true,

        validate(value)
        {
            if(value === "password")
            {
                throw new Error("Try another pasword")
            }
        }
    },
    room:[  {
        sparse:true,
        unique: true,
       required: true,
       type: String,
   }],
    
})

const user = mongoose.model("user", UserSchema)
module.exports = user
const jwt = require('jsonwebtoken')
const User = require("../models/user")

const auth =async (req,res,next)=>
{try{const token = req.header('Authorization').replace('Bearer ','')
    const auth = jwt.verify(token,(process.env.JWTSECRET))
    const user = await User.findOne({'_id':auth._id},{'tokens.token': token}) 
    if(!auth)
    {
        res.status(400).send("User not found")
    } 
    req.token =token
    req.user = user
    console.log("done")
    next()
    return user

}catch(e)
{
    res.status(400).send("Error occured during authentication"+e)
}
    
}
module.exports = auth



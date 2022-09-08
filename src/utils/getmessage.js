const moment = require('moment')

const getMessage = (text)=>
{
return {
    text,
    // createdAt : new Date().getTime(),
    createdAt : moment().format(' h:mm a')

}   
}
const getLocation = (url)=>{
return {
    url,
    createdAt : moment().format(' h:mm a')
}
}

module.exports = {
    getMessage,
    getLocation

}
//templates 

const messageTemplate = document.querySelector("#message-template").innerHTML 
const locationTemplate = document.querySelector("#location-template").innerHTML




const iofun =io()
iofun.on("geo-location",(location)=>
{
  
    const html = Mustache.render(locationTemplate,{
       location: location.url,
        createdAt: location.createdAt
    })
    document.querySelector("#message").insertAdjacentHTML('beforeEnd', html)
},
()=>
{
    console.log("Location shared")
})

// Sending message
 iofun.on("message", (message)=> 
 {
    console.log(message.createdAt)
    const html = Mustache.render(messageTemplate,{
        message: message.text,
        createdAt : message.createdAt
    })
    document.querySelector("#message").insertAdjacentHTML('beforeEnd', html)

    
 })


document.querySelector("#form").addEventListener("submit", (e)=>
{ iofun.emit("join")
    e.preventDefault()
    const message = document.querySelector("#form-input").value
    iofun.emit("send-message", (message),()=>
    {  
        console.log("Message delieverd")
        document.querySelector("#form-input").value=""
    })
    
})


document.querySelector("#geo-button").addEventListener("click", ()=>
{
    if(!navigator.geolocation)
    {
        console.log("Update your browser to use location sharing")
    }
    else{
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position.coords.latitude, position.coords.longitude)
          iofun.emit("send-location", ({latitude:position.coords.latitude, longitude:position.coords.longitude}),()=>
          {
            console.log("Location deleiverd")
            document.querySelector("#geo-button").disabled = true
          })

    
             })

}})




// document.querySelector(".incButton").addEventListener("click", ()=>
// {
//    iofun.emit("incCount")
//    iofun.on("displayCount", (count)=>
//    {
//     console.log(count + "is new count")
//    })
// })

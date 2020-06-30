const socket = io()


const $messageForm = document.querySelector("#message_form")
const $messageFormInput = document.querySelector("#input_msg")
const $messageFormSender = document.querySelector("#input_sender")
const $sendLocation = document.querySelector("#send_location")
const $messages = document.querySelector("#messages")

//Templates
const messageTemplate = document.querySelector("#message_template").innerHTML
const locationMessageTemplate = document.querySelector("#location_message_template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML



//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


const autoscroll = () =>{
   const $newMessage = $messages.lastElementChild

   const newMessageStyles = getComputedStyle($newMessage)

   const newMessageMargin = parseInt(newMessageStyles.marginBottom)
   

   const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // console.log(newMessageHeight)
   
  // visible height
   const visibleHight = $messages.offsetHeight

   //Height of messages container
   const containerHeight = $messages.scrollHeight

   const scrollOffset = $messages.scrollTop + visibleHight
 
   
   // console.log("  containerHeight",   containerHeight)
   // console.log("  newMessageHeight",   newMessageHeight)

   
   // console.log("  scrollOffset",   scrollOffset)



   if(containerHeight - newMessageHeight <= scrollOffset){
    //  console.log("apply $messages.scrollHeight",$messages.scrollHeight)
      $messages.scrollTop = $messages.scrollHeight
   } 

}

socket.on("message", (message) => {
  // console.log(message)
   const html = Mustache.render(messageTemplate, {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createAt).format("H:mm")
   })
   $messages.insertAdjacentHTML("beforeend", html)
   autoscroll()

})

socket.on("locationMessage", (message) => {
   //console.log(message)
   const html = Mustache.render(locationMessageTemplate, {
      username: message.username,
      url: message.url,
      createdAt: moment(message.createAt).format("H:mm")
   })
   $messages.insertAdjacentHTML("beforeend", html)
   autoscroll()
})

socket.on("roomData", ({room, users}) => {
 
   const html = Mustache.render(sidebarTemplate, {
      room,
      users
   })
   document.querySelector("#sidebar").innerHTML = html
})


$messageForm.addEventListener("submit", (event) => {
   event.preventDefault()
   $messageFormSender.setAttribute("disabled", "disabled")
   //var msg = document.getElementById("input_msg").value;
   const msg = event.target.elements.message.value
   //console.log(msg)

   socket.emit("sendMessage", msg, (err) => {
      $messageFormSender.removeAttribute("disabled")
      $messageFormInput.value = ""
      $messageFormInput.focus()
      if (err) {
         return console.log(err)
      }
      console.log("The massage was delivered")
   })
})

$sendLocation.addEventListener("click", () => {
   if (!navigator.geolocation) {
      return alert("geolocation is not supported by tour browser")
   }
   $sendLocation.setAttribute("sendLocation_disabled", "disabled")
   navigator.geolocation.getCurrentPosition((position) => {

      const { latitude, longitude } = position.coords

      socket.emit("sendLocation", { latitude, longitude }, (err) => {
         $sendLocation.removeAttribute("sendLocation_disabled")
         if (err) {
            return console.log(err)
         }
         console.log("Location is shared")
      })
   })
})

socket.emit("join", {username, room}, (error) => {
 
   if(error){
      alert(error)
      location.href="/"
   }
})
const socket = io()


const $selectorRooms = document.querySelector("#selector_rooms")
 
const $room = document.querySelector("#room")
 
const selectorRoomsTemplate = document.querySelector("#selector_rooms_template").innerHTML
//const roomTemplate = document.querySelector("#room_template").innerHTML


$selectorRooms.addEventListener("change", (event) =>{
   const selectedRoom = event.target.value
   console.log(typeof selectedRoom)


   // const html = Mustache.render(roomTemplate, {
   //    room: event.target.value
   // })
   // $room.innerHTML = html
   
   document.querySelector("#room").value = selectedRoom
})


socket.on("getAvailableRooms", (rooms) => {

   console.log("getAvailableRooms", rooms)
   const html = Mustache.render(selectorRoomsTemplate, {
      rooms
   })
   $selectorRooms.innerHTML = html

   if(0 < rooms.length){
      document.querySelector("#room").value = rooms[0].room
   }else{
      document.querySelector("#room").value = ""
   }

})



socket.emit("getAvailableRooms", (error) => {
 
   if(error){
      alert(error)
      location.href="/"
   }

   // const html = Mustache.render(selectorRoomsTemplate, {
   //    room: ""
   // })
   // $room.innerHTML = html
})
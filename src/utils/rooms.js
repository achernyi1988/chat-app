const rooms = []

const addRoom = (room) => {

   const value = room.trim().toLowerCase()

   if (!value) {
      return {
         error: "room is required"
      }
   }


   const existingRoom= rooms.find((el_room) => el_room.room === value)

   if (existingRoom) {
      return {
         error: "room is already in use!"
      }
   }
 
   rooms.push({room: value})

   return { value }
}

const removeRoom = (room) => {
   const index = rooms.findIndex((el_room) => el_room.room === room)

   if (-1 >= index) {
      return {
         error: "no room found"
      }
   }

   return rooms.splice(index, 1)[0]

}

//const getUser = (id) => users.find((user) => user.id === id)

const getAvailableRooms = () => rooms


module.exports = {
   addRoom,
   removeRoom,
   getAvailableRooms
}


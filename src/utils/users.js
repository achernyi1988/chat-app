const { addRoom, removeRoom, getAvailableRooms } = require("./rooms")

const users = []

const addUser = ({ id, username, room }) => {
   username = username.trim().toLowerCase()
   room = room.trim().toLowerCase()

   if (!username || !room) {
      return {
         error: "Username and room are required"
      }
   }


   const existingUser = users.find((user) => user.room === room &&
      user.username.trim().toLowerCase() === username)

   if (existingUser) {
      return {
         error: "username is already in use!"
      }
   }

   const user = {
      id,
      username: username.charAt(0).toUpperCase() + username.slice(1),
      room
   }
   //console.log("addUser",room)
   addRoom(room)
   users.push(user)

   return { user }
}


const removeUser = (id) => {
   const index = users.findIndex((user) => user.id === id)

   if (-1 >= index) {
      return {
         error: "no user found"
      }
   }
   const removedUser = users.splice(index, 1)[0]

   
   //if rooms still exist after removed user
   const foundRoom = users.find((user) => user.room === removedUser.room)

   //clean up the  room if it doesn't contain users anymore in that
   if(!foundRoom){
      removeRoom(removedUser.room)
   }

   return removedUser

}


// addUser({id: "11", username:"Alex", room:"Odessa"})
// addUser({id: "33", username:"Bob", room:"Odessa"})
// addUser({id: "22", username:"Tom", room:"Kiev"})

// console.log(getAvailableRooms())

// console.log(removeUser("22"))

// console.log("after removeUser",getAvailableRooms())


const getUser = (id) => users.find((user) => user.id === id)

const getUserInRoom = (room) => users.filter((user) => {
   console.log("getUserInRoom", room)
   if (!room) {
      return {
         error: "room is not set"
      }
   }
   return user.room === room.trim().toLowerCase()
})


module.exports = {
   addUser,
   removeUser,
   getUser,
   getUserInRoom
}


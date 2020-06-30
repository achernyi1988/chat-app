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

   return users.splice(index, 1)[0]

}

const getUser = (id) => users.find((user) => user.id === id)

const getUserInRoom = (room) => users.filter((user) => {
   console.log("getUserInRoom", room)
   if(!room){
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


const express = require("express")
const http = require("http")
const path = require("path")
const socketio = require("socket.io")
const Filter = require("bad-words")

const { log, log_err, log_warn } = require("../utils/logs")
const { generateMessage, generateLocationMessage } = require("./utils/messages")
const { addUser, removeUser, getUser, getUserInRoom } = require("./utils/users")
const { getAvailableRooms } = require("./utils/rooms")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000


const public_dir = path.join(__dirname, "../public")

//setup public dir to serve
app.use(express.static(public_dir))


// app.get("/",(req, res) => {
//    res.sendFile( public_dir + "/index.html")
// })



io.on("connection", (socket) => {
   log("New WebSocket connection")


   socket.on("join", (options, callback) => {
      log_err("join ", options)

      const { error, user } = addUser({ id: socket.id, ...options })

      if (error) {
         return callback(error)
      }

      socket.join(user.room)

      //socket.emit - send to this client
      //io.emit - send to all clients
      //socket.broadcast.emit - send to all clients but current one
      //io.to.emit - send message to all in particular room
      //socket.broadcast.to.emit - send message to all in particular room, except for specific client


      socket.emit("message", generateMessage("Admin", "Welcome to the chat!"))
      socket.broadcast.to(user.room).emit("message",
         generateMessage("Admin",
            `${user.username} has joined!`))

      io.to(user.room).emit("roomData", {
         room: user.room,
         users: getUserInRoom(user.room)
      })
      if (callback) {
         callback()
      }


   })

   socket.on("sendMessage", (msg, callback) => {

      const filter = new Filter()

      if (filter.isProfane(msg)) {
         return callback("profanity is not allowed")
      }

      const user = getUser(socket.id)

      if (!user) {
         callback("user is not found")
      }

      io.to(user.room).emit("message", generateMessage(user.username, msg))
      if (callback)
         callback()
   })

   socket.on("sendLocation", (pos, callback) => {

      const user = getUser(socket.id)

      if (!user) {
         callback("user is not found")
      }

      io.to(user.room).emit("locationMessage",
         generateLocationMessage(
            user.username, `https://google.com/maps?q=${pos.latitude},${pos.longitude}`))
      if (callback)
         callback()
   })

   socket.on("getAvailableRooms", (callback) => {

      const rooms = getAvailableRooms()

      if (!rooms) {
         callback("rooms are not available")
      }

      socket.emit("getAvailableRooms", rooms)
      if (callback)
         callback()
   })


   socket.on("disconnect", () => {
      log("disconnect socket.id", socket.id)
      const user = removeUser(socket.id)

      if (user) {
         io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left!`))

         io.to(user.room).emit("roomData", {
            room:user.room,
            users: getUserInRoom(user.room)
         })
      }
      
   })

})



server.listen(port, () => {
   log("server is up on port", port)
})
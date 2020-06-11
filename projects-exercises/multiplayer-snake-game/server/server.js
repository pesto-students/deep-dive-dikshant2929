const express = require("express");
const app = express();
const port = 3003;
const http = require("http").createServer();

const io = require("socket.io")(http);

// io.on("connection",(socket)=>{
//     socket.emit("Welcome","Welcome to socket.io server")
//     console.log("New Client is Connectedy")

// })
let gameRooms = {};
let gameRoomsStack = [];

io.of("/games").on("connection", (socket) => {
  console.log("New Client is Connectedy");

  socket.emit("welcome", "Welcome to socket.io server");

  socket.on("request_to_join_room", (room) => {
    console.log("room is:---" + room);

    if (!!gameRooms[room]) {
      socket.emit(
        "room_is_full",
        "Unable to join this room, as room is already full"
      );
      return;
    } else if (!gameRoomsStack.includes(room)) {
      socket.join(room);
      gameRoomsStack.push(room);
      socket.emit("joined_room", "snake_1");
      return;
    } else {
      socket.join(room);
      let index = gameRoomsStack.indexOf(room);
      gameRoomsStack.splice(index, 1);
      gameRooms[room] = true;
      socket.emit("joined_room", "snake_2");
      io.of("/games")
        .in(room)
        .emit("start_game", "A new player has joined this room");
      return;
    }
  });
});

http.listen(port, () => {
  console.log("server is litening on localhost:" + port);
});

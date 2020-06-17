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

  socket.on("request_to_join_room", (player) => {
    console.log("room is:---" + player.room);

    if (!!gameRooms[player.room]) {
      socket.emit(
        "room_is_full",
        "Unable to join this room, as room is already full"
      );
      return;
    } else if (!gameRoomsStack.some((info) => info.room == player.room)) {
      socket.emit("joined_room", "snake_1");
      console.log("snake_1");
      socket.join(player.room);
      gameRoomsStack.push(player);
      return;
    } else {
      socket.join(player.room);
      let index = gameRoomsStack.findIndex((info) => info.room === player.room);
      gameRooms[player.room] = {
        snake_1: gameRoomsStack[index].name,
        snake_2: player.name,
      };

      gameRoomsStack.splice(index, 1);

      socket.emit("joined_room", "snake_2");
      console.log("snake_2");
      io.of("/games")
        .in(player.room)
        .emit("start_game", gameRooms[player.room]);
      return;
    }
  });

  socket.on("move_snake", (res) => {
    io.of("/games").in(res.room).emit("move_snake", res.state);
    return;
  });
  socket.on("eat_food", (res) => {
    io.of("/games").in(res.room).emit("eat_food", res.state);
    return;
  });
  socket.on("increase_game_speed", (res) => {
    io.of("/games").in(res.room).emit("increase_game_speed", res.state);
    return;
  });
  socket.on("game_over", (res) => {
    io.of("/games").in(res.room).emit("game_over", res.message);
    gameRooms[res.room] = undefined;

    io.of("/games")
      .in(res.room)
      .clients((error, socketIds) => {
        if (error) throw error;

        socketIds.forEach((socketId) =>
          io.sockets.sockets[socketId].leave(res.room)
        );
      });

    // io.sockets.clients(res.room).forEach(function (s) {
    //   s.leave(res.room);
    // });
    return;
  });
});

http.listen(port, () => {
  console.log("server is litening on localhost:" + port);
});

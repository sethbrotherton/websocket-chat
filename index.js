const express = require("express");
const socket = require("socket.io");
const port = process.env.PORT || 4000;
let serverNumOfUsers = 0;
let currentUsers = [];

// App setup
var app = express();
var server = app.listen(port, function() {
  console.log(`listening to requests on port ${port}`);
});

app.use(express.static("public"));

// Socket setup
var io = socket(server);

io.on("connection", function(socket) {
  serverNumOfUsers++;
  console.log("Made a socket connection", socket.id, serverNumOfUsers);

  io.sockets.emit("newConnection", serverNumOfUsers);

  socket.on("userSignedIn", data => {
    currentUsers.push(data);
    io.sockets.emit("addUser", currentUsers);
  });

  socket.on("userSignedOut", data => {
    let spot = currentUsers.indexOf(data);
    currentUsers.splice(spot, 1);

    io.sockets.emit("removeUser", currentUsers);
  });

  socket.on("chatMessage", data => {
    io.sockets.emit("chatMessage", data);
  });

  socket.on("typing", data => {
    socket.broadcast.emit("typing", data);
  });

  socket.on("blurred", () => {
    socket.broadcast.emit("blurred");
  });

  socket.on("disconnect", function() {
    serverNumOfUsers--;
    io.sockets.emit("disconnection", serverNumOfUsers);
  });
});

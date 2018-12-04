const express = require("express");
const socket = require("socket.io");

// App setup
var app = express();
var server = app.listen(4000, function() {
  console.log("listening to requests on port 4000");
});

app.use(express.static("public"));

// Socket setup
var io = socket(server);

io.on("connection", function(socket) {
  console.log("Made a socket connection", socket.id);

  socket.on("chatMessage", data => {
    io.sockets.emit("chatMessage", data);
  });

  socket.on("typing", data => {
    socket.broadcast.emit("typing", data);
  });
});

const express = require("express");
const socket = require("socket.io");
const port = process.env.PORT || 4000;

// App setup
var app = express();
var server = app.listen(port, function() {
  console.log(`listening to requests on port ${port}`);
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

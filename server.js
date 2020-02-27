const http = require("http");
const express = require("express");
const app = express();
var nsps = [];

app.use(express.static(__dirname + "/public"));

var server = app.listen(3000, function() {
  console.log("listening on *:3000");
});

const io = require("socket.io")(server);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/:id", function(req, res) {
  res.sendFile(__dirname + "/views/room.html");
});

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
  socket.on("file", function(file) {
    console.log(file);
    io.in(file.for).emit("file", file);
  });
  socket.on("room", function(room) {
    socket.join(room);
  });
});
